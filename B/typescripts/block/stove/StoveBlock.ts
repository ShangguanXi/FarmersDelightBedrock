import {
    Block,
    Container,
    Entity,
    ItemStack,
    Player,
    PlayerInteractWithBlockAfterEvent,
    PlayerPlaceBlockAfterEvent,
    Vector3,
    world,
} from "@minecraft/server";
import { BlockWithEntity } from "../../lib/BlockWithEntity";
import { hasLimitedMaterials } from "../../lib/EntityUtil";
import { takeItem } from "../../lib/ItemUtil";
import { findCookingRecipe } from "../../data/recipe/cookRecipe";
import { subscribeEvent } from "../../lib/EventSubscriber";

export class StoveBlock extends BlockWithEntity {
    @subscribeEvent(world.afterEvents.playerPlaceBlock)
    placeBlock(args: PlayerPlaceBlockAfterEvent) {
        const block: Block = args.block;
        if (!block.hasTag("farmersdelight:stove")) return;
        //放置直接为点燃状态
        block.setPermutation(block.permutation.withState('farmersdelight:is_working', true));
        const { x, y, z }: Vector3 = block.location;
        const entity: Entity = super.setBlock(args.block.dimension, { x: x + 0.5, y: y, z: z + 0.5 }, block.typeId);
        for (let i = 0; i < 6; i++) {
            entity.setDynamicProperty(`farmersdelight:item_${i}_time`, 0);
            entity.setDynamicProperty(`farmersdelight:item_${i}_max_time`, 0);
        }
    }
    @subscribeEvent(world.afterEvents.playerInteractWithBlock)
    useOnBlock(args: PlayerInteractWithBlockAfterEvent) {
        if (!args.block.hasTag("farmersdelight:stove")) return;
        const data = super.entityBlockData(args.block, {
            type: args.block.typeId,
            location: args.block.location
        });
        const player: Player = args.player;
        const inventory = player?.getComponent("inventory")
        const container: Container | undefined = inventory?.container
        if (!data || !container) return;
        const entity: Entity = data.entity;
        const itemStack: ItemStack | undefined = args.itemStack;
        const stoveContainer = entity?.getComponent("inventory")?.container
        if (!stoveContainer) return
        const { x, y, z }: Vector3 = args.block.location;
        //空手取下
        if (!itemStack) {
            for (let i = 5; i >= 0; i--) {
                const stoveitemStack = stoveContainer.getItem(i)
                if (stoveitemStack) {
                    entity.dimension.spawnItem(stoveitemStack, { x, y: y + 1.4, z })
                    takeItem(stoveContainer, i, 1);
                    return
                }
            }
            return
        }
        //放置
        if (!(args.block.above()?.isAir)) return

        const recipe = findCookingRecipe(itemStack)
        if (!recipe) return
        const maxTime = recipe.time
        const emptySlotsCount = stoveContainer?.emptySlotsCount
        if (emptySlotsCount == 0) return
        itemStack.amount = 1
        for (let i = 0; i < 6; i++) {
            if (stoveContainer?.getItem(i) == undefined) {
                stoveContainer?.setItem(i, itemStack)
                entity.setDynamicProperty(`farmersdelight:item_${i}_max_time`, maxTime);
                if (hasLimitedMaterials(player)) takeItem(container, player.selectedSlotIndex, 1);
                return
            }
        }
    }
}