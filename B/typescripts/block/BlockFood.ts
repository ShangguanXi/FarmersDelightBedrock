import { Block, ItemStack, ItemUseOnAfterEvent, Player, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
export class BlockFood {
    @methodEventSub(world.afterEvents.itemUseOn)
    itemUseOn(args: ItemUseOnAfterEvent) {
        const player: Player = args.source;
        const block: Block = args.block;
        const blockTag = block.hasTag("farmersdelight:use_bowl");
        const itemStack: ItemStack | undefined = args.itemStack;
        if (blockTag && (itemStack.typeId != "minecraft:bowl")) {
            player.onScreenDisplay.setActionBar({ translate: 'farmersdelight.blockfood.use_bwol' });
        }
    }
}