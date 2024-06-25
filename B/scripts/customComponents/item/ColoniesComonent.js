var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BlockPermutation, Direction, WorldInitializeBeforeEvent, world } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { EntityUtil } from "../../lib/EntityUtil";
import { ItemUtil } from "../../lib/ItemUtil";
class ColoniesComonent {
    constructor() {
        this.onUseOn = this.onUseOn.bind(this);
    }
    onUseOn(args) {
        const itemStack = args.itemStack;
        const block = args.block;
        if (!itemStack ||
            (itemStack.typeId != 'farmersdelight:brown_mushroom_colony_item' && itemStack.typeId != 'farmersdelight:red_mushroom_colony_item') ||
            args.blockFace != Direction.Up ||
            (block.typeId != 'minecraft:mycelium' && block.typeId != 'farmersdelight:rich_soil'))
            return;
        const player = args.source;
        const main = block.above();
        const mainPerm = BlockPermutation.resolve(itemStack.typeId.split('_item')[0], { 'farmersdelight:growth': 4 });
        main?.setPermutation(mainPerm);
        if (EntityUtil.gameMode(player))
            ItemUtil.clearItem(player.getComponent('inventory')?.container, player.selectedSlotIndex);
    }
}
export class ColoniesComonentRegister {
    register(args) {
        args.itemComponentRegistry.registerCustomComponent('farmersdelight:colonies', new ColoniesComonent());
    }
}
__decorate([
    methodEventSub(world.beforeEvents.worldInitialize),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WorldInitializeBeforeEvent]),
    __metadata("design:returntype", void 0)
], ColoniesComonentRegister.prototype, "register", null);
//# sourceMappingURL=ColoniesComonent.js.map