var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { PlayerPlaceBlockAfterEvent, world } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { BlockWithEntity } from "../../lib/BlockWithEntity";
export class Basket extends BlockWithEntity {
    placeBlock(args) {
        const block = args.block;
        if (block.typeId != "farmersdelight:basket")
            return;
        const { x, y, z } = block.location;
        const entity = super.setBlock(args.block.dimension, { x: x + 0.5, y: y, z: z + 0.5 }, block.typeId);
        entity.nameTag = `tile.${entity.typeId}.name`;
    }
    setState(args) {
        const block = args.block;
        if (block.typeId != "farmersdelight:basket")
            return;
        const state = block.permutation.getState("minecraft:block_face");
        if (state == "down")
            block.setPermutation(block.permutation.withState("minecraft:block_face", "up"));
        if (state == "up")
            block.setPermutation(block.permutation.withState("minecraft:block_face", "down"));
    }
}
__decorate([
    methodEventSub(world.afterEvents.playerPlaceBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerPlaceBlockAfterEvent]),
    __metadata("design:returntype", void 0)
], Basket.prototype, "placeBlock", null);
__decorate([
    methodEventSub(world.afterEvents.playerPlaceBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerPlaceBlockAfterEvent]),
    __metadata("design:returntype", void 0)
], Basket.prototype, "setState", null);
