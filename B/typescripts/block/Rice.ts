import { PlayerInteractWithBlockBeforeEvent, world } from "@minecraft/server";
import { subscribeEvent } from "../lib/EventSubscriber";


export class RiceBlock {
    //防止水被装走
    @subscribeEvent(world.beforeEvents.playerInteractWithBlock)
    tryUseItem(args: PlayerInteractWithBlockBeforeEvent){
        const itemStack = args.itemStack;
        const block = args.block;
        if (!itemStack || !(itemStack.typeId == 'minecraft:bucket' && block.typeId == 'farmersdelight:rice_block')) return
        args.cancel = true
    }
}