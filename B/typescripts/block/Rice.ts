import { Container, Dimension, Direction, ItemUseBeforeEvent, PlayerInteractWithBlockBeforeEvent, Vector3, system, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { ItemUtil } from "../lib/ItemUtil";
import { EntityUtil } from "../lib/EntityUtil";


export class RiceBlock {
    //防止水被装走
    @methodEventSub(world.beforeEvents.playerInteractWithBlock)
    tryUseItem(args: PlayerInteractWithBlockBeforeEvent){
        const itemStack = args.itemStack;
        const block = args.block;
        if (!itemStack || !(itemStack.typeId == 'minecraft:bucket' && block.typeId == 'farmersdelight:rice_block')) return
        args.cancel = true
    }
}