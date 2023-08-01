import { world } from "@minecraft/server";
import { cuttingBoard } from "./useOn/cuttingBoard";
import { skillet } from "./useOn/skillet";

function useOn(args) {
    const block = args.block;
    const player = args.source;
    const itemStack = args.itemStack;
    switch (block.typeId) {
        case 'farmersdelight:cutting_board':
            cuttingBoard(player, itemStack, block);
            break;
        case 'farmersdelight:skillet_block':
            skillet(player, itemStack, block);
            break;
    }
}

world.afterEvents.itemUseOn.subscribe(useOn);