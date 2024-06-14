import { Container, Dimension, Direction, ItemUseOnBeforeEvent, PlayerInteractWithBlockBeforeEvent, Vector3, system, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { ItemUtil } from "../lib/ItemUtil";
import { EntityUtil } from "../lib/EntityUtil";

function placeStructure(dimension: Dimension, structure : string, location: Vector3){
    dimension.runCommand(`structure load ${structure} ${location.x} ${location.y} ${location.z}`)
}

export class RiceBlock {
    //稻米种植
    @methodEventSub(world.afterEvents.playerInteractWithBlock)
    tryPlaceBlock(args: PlayerInteractWithBlockBeforeEvent) {
        const itemStack = args.itemStack;
        const block = args.block;
        const player = args.player;
        if (!itemStack || itemStack.typeId != 'farmersdelight:rice' || args.blockFace != Direction.Up || (!block.getTags().includes('dirt'))) return
        system.run(() => {
            const water = block.above();
            if (!(water?.typeId == 'minecraft:water' && water?.permutation.getState('liquid_depth') == 0)) return
            placeStructure(block.dimension, 'farmersdelight:rice_crop', water.location);
            if (EntityUtil.gameMode(player)) ItemUtil.clearItem(player.getComponent('inventory')?.container as Container, player.selectedSlotIndex)
        })
    }
    //防止水被装走
    @methodEventSub(world.beforeEvents.itemUseOn)
    tryUseItem(args: ItemUseOnBeforeEvent){
        const itemStack = args.itemStack;
        const block = args.block;
        if (!itemStack || !(itemStack.typeId == 'minecraft:bucket' && block.typeId == 'farmersdelight:rice_block')) return
        args.cancel = true
    }
}