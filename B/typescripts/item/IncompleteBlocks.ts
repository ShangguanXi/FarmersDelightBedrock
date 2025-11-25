import { PlayerInteractWithBlockBeforeEvent, world } from "@minecraft/server";
import { subscribeEvent } from "../lib/EventSubscriber";

const SUPPORT_NEEDED: Set<string> = new Set([
    "minecraft:redstone",
    "minecraft:repeater",
    "minecraft:comparator",
    "minecraft:redstone_torch",
    "minecraft:torch",
    "minecraft:soul_torch",
    "minecraft:vine",
    "minecraft:glow_lichen",
    "minecraft:sculk_vein",
    "minecraft:frame",
    "minecraft:glow_frame",
    "minecraft:painting",
]);

// noinspection JSUnusedGlobalSymbols
export class PartialBlocks {
    @subscribeEvent(world.beforeEvents.playerInteractWithBlock)
    static preventPlacing(args: PlayerInteractWithBlockBeforeEvent) {
        const stack = args.itemStack;
        if (!stack || !SUPPORT_NEEDED.has(stack.typeId)) return;
        const block = args.block.typeId;
        if (!block.startsWith("farmersdelight:")) return;
        if (block.endsWith("cabinet") || block.endsWith("crate")) return;
        args.cancel = true;
    }
}
