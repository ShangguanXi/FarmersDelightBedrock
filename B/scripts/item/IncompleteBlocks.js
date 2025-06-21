var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { PlayerInteractWithBlockBeforeEvent, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
export class IncompleteBlocks {
    place(args) {
        const itemStack = args.itemStack;
        if (!itemStack)
            return;
        const face = args.blockFace;
        const block = args.block;
        const redstone_list = [
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
            "minecraft:painting"
        ];
        if (!block.typeId.includes("farmersdelight:"))
            return;
        if (block.typeId.includes("cabinet") || block.typeId.includes("crate"))
            return;
        if (redstone_list.includes(itemStack.typeId))
            args.cancel = true;
    }
}
__decorate([
    methodEventSub(world.beforeEvents.playerInteractWithBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerInteractWithBlockBeforeEvent]),
    __metadata("design:returntype", void 0)
], IncompleteBlocks.prototype, "place", null);
//# sourceMappingURL=IncompleteBlocks.js.map