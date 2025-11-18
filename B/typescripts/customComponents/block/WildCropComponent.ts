import {
    BlockComponentOnPlaceEvent,
    BlockComponentPlayerBreakEvent,
    BlockComponentPlayerPlaceBeforeEvent,
    BlockComponentTickEvent,
    BlockCustomComponent,
    Dimension,
    EntityInventoryComponent,
    ItemComponentTypes,
    ItemEnchantableComponent,
    PlayerBreakBlockBeforeEvent,
    StartupEvent,
    system,
    Vector3,
    world,
} from "@minecraft/server";
import { ItemUtil } from "../../lib/ItemUtil";
import { subscribeEvent } from "../../lib/EventSubscriber";

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
        const enchant = itemStack.getComponent(ItemComponentTypes.Enchantable)
        const silkTouch = enchant?.getEnchantment('silk_touch');
        if (silkTouch) return
        if (itemStack.typeId == "minecraft:shears") {
            const container = player.getComponent("inventory")?.container;
            if (!container) return;
            args.cancel = true
            system.runTimeout(() => {
                ItemUtil.damageItem(container, player.selectedSlotIndex)
                ItemUtil.spawnItem(block, block.typeId)
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
        const dimension = args.dimension;
        const inventory = player?.getComponent("inventory") as EntityInventoryComponent;
        const container = inventory?.container;
        const lootTable = this.getLootTable();
        const lootItem = this.lootItem();
        if (!player) return;
        if (!container) return;
        try {
            const selectedSlot = container?.getSlot(player.selectedSlotIndex)
            const itemId = selectedSlot.typeId;
            const enchantable = container?.getItem(player.selectedSlotIndex)?.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent
            const silkTouch = enchantable?.hasEnchantment("silk_touch");
            if (itemId == "minecraft:shears") {
                ItemUtil.damageItem(container, player.selectedSlotIndex, 1)
                ItemUtil.spawnItem(block, lootItem)

            };
            if ((itemId != "minecraft:shears") && (!silkTouch)) {
                this.spawnLoot(lootTable, dimension, block.location)
            };
        } catch (error) {
            this.spawnLoot(lootTable, dimension, block.location)
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
                ItemUtil.clearItem(container, player.selectedSlotIndex, 1)
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



    spawnLoot(path: string, dimenion: Dimension, location: Vector3) {
        return dimenion.runCommand(`loot spawn ${location.x} ${location.y} ${location.z} loot "${path}"`)
    }
    getLootTable(): string {
        return "farmersdelight/crops/farmersdelight_wild_rice";

    }
    lootItem(): string {
        return "farmersdelight:wild_rice";

    }
}