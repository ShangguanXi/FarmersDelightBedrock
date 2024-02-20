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
export class FarmersBook {
    itemUse(args) {
        const player = args.source;
        const itemStack = args.itemStack;
        if (itemStack?.typeId == "farmersdelight:book_farmersdelight") {
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
                    const thanks = new ActionFormData()
                        .title({ "rawtext": [{ "text": "farmersdelight.book.thanks" }] })
                        .body({ "rawtext": [{ "text": "farmersdelight.book.thanks.body" }] })
                        .button({ "rawtext": [{ "text": "farmersdelight.book.back" }] });
                    thanks.show(player).then((response) => {
                    });
                }
            });
        }
    }
    ;
}
__decorate([
    methodEventSub(world.afterEvents.itemUse),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ItemUseAfterEvent]),
    __metadata("design:returntype", void 0)
], FarmersBook.prototype, "itemUse", null);
//# sourceMappingURL=FarmersBook.js.map