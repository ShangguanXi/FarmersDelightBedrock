import { ItemStack, Player, ItemUseAfterEvent, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { ActionFormData, ActionFormResponse } from '@minecraft/server-ui';

function thanksForm(player: Player) {
    const thanks = new ActionFormData()
        .title({ "rawtext": [{ "text": "farmersdelight.book.thanks" }] })
        .body({
            "rawtext": [
                { "translate": "farmersdelight.book.thanks.sponsored_list_title" },
                { "text": "\n" },
                { "translate": "farmersdelight.book.thanks.sponsored_list" },
                { "text": "\n" },
                { "translate": "farmersdelight.book.thanks.license_title" },
                { "text": "\n" },
                { "translate": "farmersdelight.book.thanks.license" },
                { "text": "\n" },
                { "translate": "farmersdelight.book.thanks.developers_title" },
                { "text": "\n" },
                { "translate": "farmersdelight.book.thanks.developers" },
                { "text": "\n" },
                { "translate": "farmersdelight.book.thanks.contributors_title" },
                { "text": "\n" },
                { "translate": "farmersdelight.book.thanks.contributors" },
                { "text": "\n" },
                { "translate": "farmersdelight.book.thanks.chat_group_title" },
                { "text": "\n" },
                { "translate": "farmersdelight.book.thanks.chat_group.qqchat" },
                { "text": "\n" },
                { "translate": "farmersdelight.book.thanks.chat_group.discord" },
                { "text": "\n" },
                { "translate": "farmersdelight.book.thanks.sponsor_title" },
                { "text": "\n" },
                { "translate": "farmersdelight.book.thanks.sponsor" }
            ]
        }
        )
        .button({ "rawtext": [{ "text": "farmersdelight.book.back" }] });

    thanks.show(player).then((response: ActionFormResponse) => {
        if (response.selection === 0) {
            mainForm(player);
        }
    })
};
function cuttingBoardForm(player: Player) {
    const thanks = new ActionFormData()
        .title({ "rawtext": [{ "text": "tile.farmersdelight:cutting_board.name" }] })
        .body({
            "rawtext": [
                { "translate": "farmersdelight.book.cutting_board.main" }
            ]
        }
        )
        .button({ "rawtext": [{ "text": "farmersdelight.book.back" }] });

    thanks.show(player).then((response: ActionFormResponse) => {
        if (response.selection === 0) {
            mainForm(player);
        }
    })
};
function stoveForm(player: Player) {
    const thanks = new ActionFormData()
        .title({ "rawtext": [{ "text": "tile.farmersdelight:stove.name" }] })
        .body({
            "rawtext": [
                { "translate": "farmersdelight.book.stove.main" },
                { "text": "\n" },
                { "translate": "farmersdelight.book.stove.cswitch_title" },
                { "text": "\n" },
                { "translate": "farmersdelight.book.stove.switch" }
            ]
        }
        )
        .button({ "rawtext": [{ "text": "farmersdelight.book.back" }] });

    thanks.show(player).then((response: ActionFormResponse) => {
        if (response.selection === 0) {
            mainForm(player);
        }
    })
};
function mainForm(player: Player) {
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
            thanksForm(player);
        } 
        if (response.selection === 0) {
            cuttingBoardForm(player);
        }
        if (response.selection === 1) {
            stoveForm(player);
        }


    })
};
export class FarmersBook {


    @methodEventSub(world.afterEvents.itemUse)
    itemUse(args: ItemUseAfterEvent) {
        const player: Player = args.source;
        const itemStack: ItemStack | undefined = args.itemStack;
        if (itemStack?.typeId == "farmersdelight:book_farmersdelight") {
            mainForm(player);
        }
    }
};


