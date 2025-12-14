import {
    BlockComponentBlockBreakEvent,
    BlockComponentPlayerPlaceBeforeEvent,
    BlockComponentTickEvent,
    BlockCustomComponent,
    CustomComponentParameters,
    EquipmentSlot,
    GameMode,
    Player,
    PlayerBreakBlockBeforeEvent,
    system,
    world,
} from "@minecraft/server";
import { hurtEquippedItem, isEnchanted, spawnStack } from "../../lib/ItemUtil";
import { blockComponent, subscribeEvent } from "../../lib/EventSubscriber";
import { getEquipment } from "../../lib/EntityUtil";
import { destroyBlock, removeBlock } from "../../lib/BlockUtil";

/**
 * @deprecated
 */
@blockComponent("farmersdelight:wild_crop")
export class WildCropComponent implements BlockCustomComponent {
    @subscribeEvent(world.beforeEvents.playerBreakBlock)
    static harvest(event: PlayerBreakBlockBeforeEvent) {
        const player = event.player;
        if (player.getGameMode() === GameMode.Creative) return;
        const block = event.block;
        if (!block.getComponent("farmersdelight:wild_crop")) return;
        const stack = event.itemStack;
        if (!isEnchanted(stack, "silk_touch") && stack?.hasTag("minecraft:is_shears")) {
            const loot = event.block.getItemStack(1, false);
            if (!loot) return;
            system.run(() => {
                spawnStack(loot, block);
                removeBlock(block);
                hurtEquippedItem(player, stack);
            });
            event.cancel = true;
        }
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

    onBreak(event: BlockComponentBlockBreakEvent, params: CustomComponentParameters): void {
        if (params.params !== "upper") return;
        const block = event.block;
        const lower = block.below();
        if (lower?.getComponent("farmersdelight:wild_rice")) { // TODO hasComponent
            removeBlock(lower);
        }
        const entity = event.entitySource;
        if (entity instanceof Player && entity.getGameMode() === GameMode.Creative) return;
        const stack = getEquipment(entity, EquipmentSlot.Mainhand);
        if (isEnchanted(stack, "silk_touch")) return;
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