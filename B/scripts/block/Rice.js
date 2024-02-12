var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Direction, ItemUseOnBeforeEvent, PlayerInteractWithBlockBeforeEvent, system, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { ItemUtil } from "../lib/ItemUtil";
import { EntityUtil } from "../lib/EntityUtil";
function placeStructure(dimension, structure, location) {
    dimension.runCommand(`structure load ${structure} ${location.x} ${location.y} ${location.z}`);
}
export class RiceBlock {
    //稻米种植
    tryPlaceBlock(args) {
        const itemStack = args.itemStack;
        const block = args.block;
        const player = args.player;
        if (!itemStack || itemStack.typeId != 'farmersdelight:rice' || args.blockFace != Direction.Up || (!block.getTags().includes('dirt')))
            return;
        system.run(() => {
            const water = block.above();
            if (!(water?.typeId == 'minecraft:water' && water?.permutation.getState('liquid_depth') == 0))
                return;
            placeStructure(block.dimension, 'farmersdelight:rice_crop', water.location);
            if (EntityUtil.gameMode(player))
                ItemUtil.clearItem(player.getComponent('inventory')?.container, player.selectedSlot);
        });
    }
    //防止水被装走
    tryUseItem(args) {
        const itemStack = args.itemStack;
        const block = args.block;
        if (!itemStack || !(itemStack.typeId == 'minecraft:bucket' && block.typeId == 'farmersdelight:rice_block'))
            return;
        args.cancel = true;
    }
}
__decorate([
    methodEventSub(world.beforeEvents.playerInteractWithBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerInteractWithBlockBeforeEvent]),
    __metadata("design:returntype", void 0)
], RiceBlock.prototype, "tryPlaceBlock", null);
__decorate([
    methodEventSub(world.beforeEvents.itemUseOn),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ItemUseOnBeforeEvent]),
    __metadata("design:returntype", void 0)
], RiceBlock.prototype, "tryUseItem", null);
//# sourceMappingURL=Rice.js.map