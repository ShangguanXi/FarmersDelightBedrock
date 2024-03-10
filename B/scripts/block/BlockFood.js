var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ItemUseOnAfterEvent, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
export class BlockFood {
    itemUseOn(args) {
        const player = args.source;
        const block = args.block;
        const blockTag = block.hasTag("farmersdelight:use_bowl");
        const itemStack = args.itemStack;
        if (blockTag && (itemStack.typeId != "minecraft:bowl")) {
            player.onScreenDisplay.setActionBar({ translate: 'farmersdelight.blockfood.use_bwol' });
        }
    }
}
__decorate([
    methodEventSub(world.afterEvents.itemUseOn),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ItemUseOnAfterEvent]),
    __metadata("design:returntype", void 0)
], BlockFood.prototype, "itemUseOn", null);
//# sourceMappingURL=BlockFood.js.map