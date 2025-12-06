import {
    BlockComponentOnPlaceEvent,
    BlockComponentPlayerBreakEvent,
    BlockComponentPlayerPlaceBeforeEvent,
    BlockComponentTickEvent,
    BlockCustomComponent,
    CustomComponentParameters,
    EquipmentSlot,
    GameMode,
    ItemStack,
    PlayerBreakBlockBeforeEvent,
    StartupEvent,
    system,
    world,
} from "@minecraft/server";
import { hurtItem, isEnchanted, spawnStack } from "../../lib/ItemUtil";
import { blockComponent, subscribeEvent } from "../../lib/EventSubscriber";
import { getEquipment } from "../../lib/EntityUtil";
import { destroyBlock, removeBlock } from "../../lib/BlockUtil";

export class WildCropComponent implements BlockCustomComponent {
    constructor() {
        this.onPlace = this.onPlace.bind(this);

    }
    onPlace(args: BlockComponentOnPlaceEvent): void {}


    @subscribeEvent(world.beforeEvents.playerBreakBlock)
    break(args: PlayerBreakBlockBeforeEvent) {
        const block = args.block
        if (!block.getComponent("farmersdelight:wild_crop")) return;
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
    }
}

@blockComponent("farmersdelight:wild_rice")
export class WildRiceComponent implements BlockCustomComponent {
    beforeOnPlayerPlace(event: BlockComponentPlayerPlaceBeforeEvent, params: CustomComponentParameters): void {
        const block = event.block;
        if (params.params === "upper") {
            if (block.below()?.getComponent("farmersdelight:wild_rice")) return;
        } else if (block.typeId === "minecraft:water" && !block.permutation.getState("liquid_depth")) {
            const upper = block.above();
            if (upper?.isAir) {
                const permutation = event.permutationToPlace.withState("farmersdelight:upper", true);
                system.run(() => {
                    // 在onPlace里放会导致两个方块都过不了placement_filter
                    if (upper.isValid && upper.isAir && upper?.below()?.getComponent("farmersdelight:wild_rice")) {
                        upper.setPermutation(permutation);
                    }
                });
                return;
            }
        }
        event.cancel = true;
    }

    onPlayerBreak(event: BlockComponentPlayerBreakEvent, params: CustomComponentParameters): void {
        if (params.params !== "upper") return;
        const player = event.player;
        if (player?.getGameMode() === GameMode.Creative) return;
        const stack = getEquipment(player, EquipmentSlot.Mainhand);
        if (isEnchanted(stack, "silk_touch")) return;
        const block = event.block;
        const loots = world.getLootTableManager()
            .generateLootFromBlockPermutation(event.brokenBlockPermutation.withState("farmersdelight:upper", false), stack);
        if (loots) {
            const dimension = block.dimension;
            const pos = block.bottomCenter();
            for (const stack of loots) {
                dimension.spawnItem(stack, pos);
            }
        }
    }

    onTick(event: BlockComponentTickEvent, params: CustomComponentParameters): void {
        if (params.params === "upper") return;
        const block = event.block;
        if (block.above()?.getComponent("farmersdelight:wild_rice")) {
            if (block.below()?.isAir) { // 懒得管下面的是土还是石头啥的了
                destroyBlock(block);
            }
        } else {
            removeBlock(block);
        }
    }
}