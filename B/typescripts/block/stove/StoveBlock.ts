import { Block, Container, Entity, ItemStack, PlayerInteractWithBlockAfterEvent, Player, PlayerPlaceBlockAfterEvent, Vector3, world } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { BlockWithEntity } from "../../lib/BlockWithEntity";
import { vanillaItemList } from "../../data/recipe/cookRecipe";
import { EntityUtil } from "../../lib/EntityUtil";
import { ItemUtil } from "../../lib/ItemUtil";
import { CookableComponentParams } from "../../customComponents/item/CookableComponent";



export class StoveBlock extends BlockWithEntity {
    @methodEventSub(world.afterEvents.playerPlaceBlock)
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
    @methodEventSub(world.afterEvents.playerInteractWithBlock)
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
                    ItemUtil.clearItem(stoveContainer, i)
                    return
                }
            }
            return
        }
        //放置
        const upBlock = player.dimension.getBlock({ x: x, y: y + 1, z: z })
        if (!(upBlock?.isAir)) return
        const cookable = itemStack.getComponent("farmersdelight:cookable")
        if (!vanillaItemList.includes(itemStack.typeId) && !cookable) return
        const params = cookable?.customComponentParameters.params as CookableComponentParams
        const maxTime = cookable ? (params.time ? params.time*20 : 200*20) : 200*20
        const emptySlotsCount = stoveContainer?.emptySlotsCount
        if (emptySlotsCount == 0) return
        itemStack.amount = 1
        for (let i = 0; i < 6; i++) {
            if (stoveContainer?.getItem(i) == undefined) {
                stoveContainer?.setItem(i, itemStack)
                entity.setDynamicProperty(`farmersdelight:item_${i}_max_time`, maxTime);
                return
            }
        }
        ItemUtil.clearItem(container, player.selectedSlotIndex)


    }
}