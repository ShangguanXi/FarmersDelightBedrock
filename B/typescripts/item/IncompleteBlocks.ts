import { PlayerInteractWithBlockBeforeEvent, world } from "@minecraft/server";
import { subscribeEvent } from "../lib/EventSubscriber";


export class IncompleteBlocks {
    @subscribeEvent(world.beforeEvents.playerInteractWithBlock)
    place(args: PlayerInteractWithBlockBeforeEvent) {
        const itemStack = args.itemStack
        if (!itemStack) return
        const face = args.blockFace
        const block = args.block
        const redstone_list: string[] = [
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
            "minecraft:painting"]
        if (!block.typeId.includes("farmersdelight:")) return
        if (block.typeId.includes("cabinet")||block.typeId.includes("crate")) return
        if (redstone_list.includes(itemStack.typeId)) args.cancel = true
    }
}
