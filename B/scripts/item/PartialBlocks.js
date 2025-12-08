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
import { subscribeEvent } from "../lib/EventSubscriber";
const SUPPORT_NEEDED = new Set([
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
export class PartialBlocks {
    static preventPlacing(args) {
        const stack = args.itemStack;
        if (!stack || !SUPPORT_NEEDED.has(stack.typeId))
            return;
        const block = args.block.typeId;
        if (!block.startsWith("farmersdelight:"))
            return;
        if (block.endsWith("cabinet") || block.endsWith("crate"))
            return;
        args.cancel = true;
    }
}
__decorate([
    subscribeEvent(world.beforeEvents.playerInteractWithBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerInteractWithBlockBeforeEvent]),
    __metadata("design:returntype", void 0)
], PartialBlocks, "preventPlacing", null);
