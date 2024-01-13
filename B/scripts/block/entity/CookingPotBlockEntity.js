var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { EntityInventoryComponent, ItemStack, world } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { BlockEntity } from "./BlockEntity";
const emptyArrow = new ItemStack("farmersdelight:cooking_pot_arrow_0");
// 意义不明的进度函数
function arrowheadUtil(oldItemStack, slot, container) {
    const itemStack = container.getItem(slot);
    if (itemStack?.typeId != oldItemStack.typeId) {
        container.setItem(slot, oldItemStack);
    }
}
export class CookingPotBlockEntity extends BlockEntity {
    tick(args) {
        const entityBlockData = super.blockEntityData(args);
        if (!entityBlockData)
            return;
        const entity = entityBlockData.entity;
        const container = entity.getComponent(EntityInventoryComponent.componentId)?.container;
        if (!container)
            return;
        arrowheadUtil(emptyArrow, 9, container);
        super.blockEntityLoot(entityBlockData, "farmersdelight:cooking_pot", []);
    }
}
__decorate([
    methodEventSub(world.afterEvents.dataDrivenEntityTriggerEvent, { entityTypes: ["farmersdelight:cooking_pot"], eventTypes: ["farmersdelight:cooking_pot_tick"] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CookingPotBlockEntity.prototype, "tick", null);
//# sourceMappingURL=CookingPotBlockEntity.js.map