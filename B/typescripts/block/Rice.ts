import { PlayerInteractWithBlockBeforeEvent, world } from "@minecraft/server";
import { subscribeEvent } from "../lib/EventSubscriber";

// noinspection JSUnusedGlobalSymbols
export class RiceBlock {
    //防止水被装走
    @subscribeEvent(world.beforeEvents.playerInteractWithBlock)
    static preventDraining(args: PlayerInteractWithBlockBeforeEvent) {
        if (args.block.typeId === "farmersdelight:rice_block" && args.itemStack?.typeId === "minecraft:bucket") {
            args.cancel = true;
        }
    }
}