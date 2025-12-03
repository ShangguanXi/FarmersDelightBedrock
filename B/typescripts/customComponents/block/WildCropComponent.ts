import {
    BlockComponentOnPlaceEvent,
    BlockComponentPlayerBreakEvent,
    BlockComponentPlayerPlaceBeforeEvent,
    BlockComponentTickEvent,
    BlockCustomComponent,
    EntityInventoryComponent,
    ItemStack,
    PlayerBreakBlockBeforeEvent,
    StartupEvent,
    system,
    world,
} from "@minecraft/server";
import { hurtItem, isEnchanted, spawnStack, takeItem } from "../../lib/ItemUtil";
import { subscribeEvent } from "../../lib/EventSubscriber";
import { spawnLootAtBlock } from "../../lib/LootUtil";

export class WildCropComponent implements BlockCustomComponent {
    constructor() {
        this.onPlace = this.onPlace.bind(this);

    }
    onPlace(args: BlockComponentOnPlaceEvent): void {}


    @subscribeEvent(world.beforeEvents.playerBreakBlock)
    break(args: PlayerBreakBlockBeforeEvent) {
        const block = args.block
        const wildCrop = block.getComponent('farmersdelight:wild_crop')
        if (!wildCrop) return
        const itemStack = args.itemStack
        const player = args.player
        const { x, y, z } = args.block.location;
        if (!itemStack) return
        if (isEnchanted(itemStack, "silk_touch")) return;
        if (itemStack.typeId == "minecraft:shears") {
            const container = player.getComponent("inventory")?.container;
            if (!container) return;
            args.cancel = true
            system.runTimeout(() => {
                hurtItem(container, player.selectedSlotIndex, 1);
                spawnStack(new ItemStack(block.typeId), block);
                block.dimension.runCommand(`/setblock ${x} ${y} ${z} air`)

            })
        }
    }

    @subscribeEvent(system.beforeEvents.startup)
    register(args: StartupEvent) {
        args.blockComponentRegistry.registerCustomComponent('farmersdelight:wild_crop', new WildCropComponent());
        args.blockComponentRegistry.registerCustomComponent('farmersdelight:wild_rice', new WildRiceComponent());
    }

}


class WildRiceComponent implements BlockCustomComponent {
    constructor() {
        this.beforeOnPlayerPlace = this.beforeOnPlayerPlace.bind(this);
        this.onTick = this.onTick.bind(this);
        this.onPlayerBreak = this.onPlayerBreak.bind(this);
    }
    onPlayerBreak(args: BlockComponentPlayerBreakEvent): void {
        const player = args.player;
        const block = args.block;
        const inventory = player?.getComponent("inventory") as EntityInventoryComponent;
        const container = inventory?.container;
        const lootTable = this.getLootTable();
        const lootItem = this.lootItem();
        if (!player) return;
        if (!container) return;
        const stack = container?.getItem(player.selectedSlotIndex);
        if (stack?.typeId === "minecraft:shears") {
            hurtItem(container, player.selectedSlotIndex, 1);
            spawnStack(new ItemStack(lootItem), block);
        } else if (!isEnchanted(stack, "silk_touch")) {
            spawnLootAtBlock(block, lootTable)
        }
    };
    beforeOnPlayerPlace(args: BlockComponentPlayerPlaceBeforeEvent): void {

        const player = args.player;
        const inventory = player?.getComponent("inventory") as EntityInventoryComponent;
        const container = inventory?.container;
        const block = args.block;
        const dimension = args.dimension;
        const upBlockId = dimension.getBlock({ x: block.location.x, y: block.location.y + 1, z: block.location.z })?.typeId

        if (upBlockId == "minecraft:water" || upBlockId != "minecraft:air") {
            args.cancel = true;
        }
        else {
            if (!player) return;
            if (!container) return;
            system.runTimeout(() => {
                world.structureManager.place("farmersdelight:wild_rice_no_water", dimension, block.location);
                takeItem(container, player.selectedSlotIndex, 1);
                dimension.playSound("dig.grass", block.location)
            })


        }
    }
    onTick(args: BlockComponentTickEvent): void {
        const block = args.block;
        const dimension = args.dimension;
        const blockState = block.permutation.getState("farmersdelight:wild_rice")
        if (blockState == 0) {
            const upBlockId = dimension.getBlock({ x: block.location.x, y: block.location.y + 1, z: block.location.z })?.typeId
            if (upBlockId != "farmersdelight:wild_rice") {
                dimension.setBlockType(block.location, "minecraft:air")
            }
        }
    }



    getLootTable(): string {
        return "farmersdelight/crops/farmersdelight_wild_rice";

    }
    lootItem(): string {
        return "farmersdelight:wild_rice";

    }
}