import { ItemStack, Player, ItemUseAfterEvent, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { ActionFormData, ActionFormResponse } from '@minecraft/server-ui';

export class FarmersBook {

    @methodEventSub(world.afterEvents.itemUse)
    itemUse(args: ItemUseAfterEvent) {
        const player: Player = args.source;
        const itemStack: ItemStack | undefined = args.itemStack;
        if (itemStack?.typeId == "farmersdelight:book_farmersdelight") {
            const form = new ActionFormData()
                .title({ "rawtext": [{ "text": "farmersdelight.book.title" }] })
                .button({ "rawtext": [{ "text": "tile.farmersdelight:cutting_board.name" }] })
                .button({ "rawtext": [{ "text": "tile.farmersdelight:stove.name" }] })
                .button({ "rawtext": [{ "text": "tile.farmersdelight:cooking_pot.name" }] })
                .button({ "rawtext": [{ "text": "tile.farmersdelight:skillet_block.name" }] })
                .button({ "rawtext": [{ "text": "farmersdelight.book.crop" }] })
                .button({ "rawtext": [{ "text": "farmersdelight.book.thanks" }] });

            form.show(player).then((response: ActionFormResponse) => {
                if (response.selection === 5) {
                    const thanks = new ActionFormData()
                        .title({ "rawtext": [{ "text": "farmersdelight.book.thanks" }] })
                        .body({ "rawtext": [{ "text": "farmersdelight.book.thanks.body" }] })
                        .button({ "rawtext": [{ "text": "farmersdelight.book.back" }] });

                    thanks.show(player).then((response: ActionFormResponse) => {

                    })

                }
            });
        }
    };


}