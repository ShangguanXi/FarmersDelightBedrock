import { Block, BlockPermutation, Dimension, Direction, ItemStack, ItemUseOnBeforeEvent, PlayerInteractWithBlockBeforeEvent, Vector3, system, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";

function placeStructure(dimension: Dimension, structure : string, location: Vector3){
    dimension.runCommand(`structure load ${structure} ${location.x} ${location.y} ${location.z}`)
}

export class RiceBlock {
    //稻米种植
    @methodEventSub(world.beforeEvents.playerInteractWithBlock)
    tryPlaceBlock(args: PlayerInteractWithBlockBeforeEvent) {
        const itemStack = args.itemStack;
        const block = args.block;
        if (!itemStack || itemStack.typeId != 'farmersdelight:rice' || args.blockFace != Direction.Up || (block.typeId != 'minecraft:dirt' && block.typeId != 'minecraft:grass')) return
        system.run(() => {
            const water = block.above();
            if (!(water?.typeId == 'minecraft:water' && water?.permutation.getState('liquid_depth') == 0)) return
            placeStructure(block.dimension, 'farmersdelight:rice_crop', water.location);
        })
    }
    //防止水被装走
    @methodEventSub(world.beforeEvents.itemUseOn)
    tryUseItem(args: ItemUseOnBeforeEvent){
        const itemStack = args.itemStack;
        const block = args.block;
        if (!itemStack || itemStack.typeId != 'minecraft:bucket' || (block.typeId != 'farmersdelight:rice_block' && block.typeId != 'minecraft:water')) return
        args.cancel = true
    }
}