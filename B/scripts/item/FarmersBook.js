var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ItemUseAfterEvent, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { ActionFormData } from '@minecraft/server-ui';
function thanksForm(player) {
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
    })
        .button({ "rawtext": [{ "text": "farmersdelight.book.back" }] });
    thanks.show(player).then((response) => {
        if (response.selection === 0) {
            mainForm(player);
        }
    });
}
;
function cuttingBoardForm(player) {
    const cuttingBoard = new ActionFormData()
        .title({ "rawtext": [{ "text": "tile.farmersdelight:cutting_board.name" }] })
        .body({
        "rawtext": [
            { "translate": "farmersdelight.book.cutting_board.main" }
        ]
    })
        .button({ "rawtext": [{ "text": "farmersdelight.book.back" }] });
    cuttingBoard.show(player).then((response) => {
        if (response.selection === 0) {
            mainForm(player);
        }
    });
}
;
function stoveForm(player) {
    const stove = new ActionFormData()
        .title({ "rawtext": [{ "text": "tile.farmersdelight:stove.name" }] })
        .body({
        "rawtext": [
            { "translate": "farmersdelight.book.stove.main" },
            { "text": "\n" },
            { "translate": "farmersdelight.book.stove.switch_title" },
            { "text": "\n" },
            { "translate": "farmersdelight.book.stove.switch" }
        ]
    })
        .button({ "rawtext": [{ "text": "farmersdelight.book.back" }] });
    stove.show(player).then((response) => {
        if (response.selection === 0) {
            mainForm(player);
        }
    });
}
;
function cookingPotForm(player) {
    const cookingPotForm = new ActionFormData()
        .title({ "rawtext": [{ "text": "tile.farmersdelight:cooking_pot.name" }] })
        .body({
        "rawtext": [
            { "translate": "farmersdelight.book.cooking_pot.main" },
            { "text": "\n" },
            { "translate": "farmersdelight.book.cooking_pot.heat_source_title" },
            { "text": "\n" },
            { "translate": "farmersdelight.book.cooking_pot.heat_source" },
            { "text": "\n" },
            { "translate": "farmersdelight.book.cooking_pot.use_title" },
            { "text": "\n" },
            { "translate": "farmersdelight.book.cooking_pot.use.1" },
            { "text": "\n" },
            { "translate": "farmersdelight.book.cooking_pot.use.2" },
            { "text": "\n" },
            { "translate": "farmersdelight.book.cooking_pot.use.3" },
            { "text": "\n" },
            { "translate": "farmersdelight.book.cooking_pot.use.4" }
        ]
    })
        .button({ "rawtext": [{ "text": "farmersdelight.book.back" }] });
    cookingPotForm.show(player).then((response) => {
        if (response.selection === 0) {
            mainForm(player);
        }
    });
}
function skilletForm(player) {
    const skilletForm = new ActionFormData()
        .title({ "rawtext": [{ "text": "tile.farmersdelight:skillet_block.name" }] })
        .body({
        "rawtext": [
            { "translate": "farmersdelight.book.skillet.main" },
            { "text": "\n" },
            { "translate": "farmersdelight.book.skillet.block_title" },
            { "text": "\n" },
            { "translate": "farmersdelight.book.skillet.block" },
            { "text": "\n" },
            { "translate": "farmersdelight.book.skillet.item_title" },
            { "text": "\n" },
            { "translate": "farmersdelight.book.skillet.item" }
        ]
    })
        .button({ "rawtext": [{ "text": "farmersdelight.book.back" }] });
    skilletForm.show(player).then((response) => {
        if (response.selection === 0) {
            mainForm(player);
        }
    });
}
function cropForm(player) {
    const cropForm = new ActionFormData()
        .title({ "rawtext": [{ "text": "farmersdelight.book.crop" }] })
        .body({
        "rawtext": [
            { "translate": "farmersdelight.book.crop.main" },
            { "text": "\n" },
            { "translate": "farmersdelight.book.crop.tomatoes_title" },
            { "text": "\n" },
            { "translate": "farmersdelight.book.crop.tomatoes" },
            { "text": "\n" },
            { "translate": "farmersdelight.book.crop.cabbages_title" },
            { "text": "\n" },
            { "translate": "farmersdelight.book.crop.cabbages" },
            { "text": "\n" },
            { "translate": "farmersdelight.book.crop.onions_title" },
            { "text": "\n" },
            { "translate": "farmersdelight.book.crop.onions" },
            { "text": "\n" },
            { "translate": "farmersdelight.book.crop.rice_crop_title" },
            { "text": "\n" },
            { "translate": "farmersdelight.book.crop.rice_crop" }
        ]
    })
        .button({ "rawtext": [{ "text": "farmersdelight.book.back" }] });
    cropForm.show(player).then((response) => {
        if (response.selection === 0) {
            mainForm(player);
        }
    });
}
function mainForm(player) {
    const form = new ActionFormData()
        .title({ "rawtext": [{ "text": "farmersdelight.book.title" }] })
        .button({ "rawtext": [{ "text": "tile.farmersdelight:cutting_board.name" }] })
        .button({ "rawtext": [{ "text": "tile.farmersdelight:stove.name" }] })
        .button({ "rawtext": [{ "text": "tile.farmersdelight:cooking_pot.name" }] })
        .button({ "rawtext": [{ "text": "tile.farmersdelight:skillet_block.name" }] })
        .button({ "rawtext": [{ "text": "farmersdelight.book.crop" }] })
        .button({ "rawtext": [{ "text": "farmersdelight.book.thanks" }] });
    form.show(player).then((response) => {
        if (response.selection === 5) {
            thanksForm(player);
        }
        ;
        if (response.selection === 0) {
            cuttingBoardForm(player);
        }
        ;
        if (response.selection === 1) {
            stoveForm(player);
        }
        ;
        if (response.selection === 2) {
            cookingPotForm(player);
        }
        ;
        if (response.selection === 3) {
            skilletForm(player);
        }
        ;
        if (response.selection === 4) {
            cropForm(player);
        }
    });
}
;
export class FarmersBook {
    itemUse(args) {
        const player = args.source;
        const itemStack = args.itemStack;
        if (itemStack?.typeId == "farmersdelight:book_farmersdelight") {
            mainForm(player);
        }
    }
}
__decorate([
    methodEventSub(world.afterEvents.itemUse),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ItemUseAfterEvent]),
    __metadata("design:returntype", void 0)
], FarmersBook.prototype, "itemUse", null);
;
//# sourceMappingURL=FarmersBook.js.map