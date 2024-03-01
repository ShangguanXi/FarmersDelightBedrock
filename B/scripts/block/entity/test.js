var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { EntityInventoryComponent, EntityLoadAfterEvent, ItemStack, world } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { BlockEntity } from "./BlockEntity";
import ObjectUtil from "../../lib/ObjectUtil";
import { vanillaCookingPotRecipe } from "../../data/recipe/cookingPotRecipe";
import { heatConductors, heatSources } from "../../data/heatBlocks";
import { RecipeHolder, testRecipe } from "../../lib/RecipeHolder";
const fireArrowFull = new ItemStack("farmersdelight:fire_1");
const fireArrowEmpty = new ItemStack("farmersdelight:fire_0");
const emptyArrow = new ItemStack("farmersdelight:cooking_pot_arrow_0");
const recipes = vanillaCookingPotRecipe.recipe;
// 意义不明的进度函数
function arrowheadUtil(entity, oldItemStack, slot, container) {
    if (entity.getDynamicProperty("farmersdelight:not_can_set"))
        return;
    const itemStack = container.getItem(slot);
    if (itemStack?.typeId != oldItemStack.typeId) {
        container.setItem(slot, oldItemStack);
    }
}
//检查热源  自定义热源可以使用farmersdelight:heat_source的tag进行定义
function heatCheck(block) {
    const blockBelow = block.below();
    if (heatSources.includes(blockBelow?.typeId) || blockBelow?.hasTag('farmersdelight:heat_source'))
        return true;
    if (heatConductors.includes(blockBelow?.typeId) || blockBelow?.hasTag('farmersdelight:heat_conductors')) {
        const blockBelow2 = block.below(2);
        if (heatSources.includes(blockBelow2?.typeId) || blockBelow2?.hasTag('farmersdelight:heat_source'))
            return true;
    }
    return false;
}
world.afterEvents.pistonActivate;
//刷新方块实体状态以及防TP
function blockEntityLoot(args, id) {
    const cookingPotblock = new ItemStack('farmersdelight:cooking_pot');
    if (!ObjectUtil.isEqual(args.entity.location, args.blockEntityDataLocation))
        args.entity.teleport(args.blockEntityDataLocation);
    if (args.block?.typeId == id)
        return;
    const container = args.entity.getComponent(EntityInventoryComponent.componentId)?.container;
    const itemStack = container?.getItem(6);
    if (itemStack) {
        const typeId = itemStack.typeId;
        const amount = itemStack.amount;
        container?.setItem(6, undefined);
        cookingPotblock.setLore([`§r§f目前的 ${amount} 份食物: ${typeId}`]);
    }
    container?.setItem(9, undefined);
    container?.setItem(10, undefined);
    args.entity.setDynamicProperty("farmersdelight:not_can_set", true);
    args.entity.dimension.spawnItem(cookingPotblock, args.blockEntityDataLocation);
    BlockEntity.clearEntity(args);
}
export class test extends BlockEntity {
    tick(args) {
        const entityBlockData = super.blockEntityData(args.entity);
        if (!entityBlockData)
            return;
        const entity = entityBlockData.entity;
        const { x, y, z } = entity.location;
        const block = entityBlockData.block;
        const container = entity.getComponent(EntityInventoryComponent.componentId)?.container;
        if (!container)
            return;
        const holder = new RecipeHolder(entity, 6, 1, ['cooking_pot'], [testRecipe]);
    }
    load(args) {
        console.warn(args.entity.typeId);
    }
}
__decorate([
    methodEventSub(world.afterEvents.dataDrivenEntityTrigger, { entityTypes: ["farmersdelight:cooking_pot"], eventTypes: ["farmersdelight:cooking_pot_tick"] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], test.prototype, "tick", null);
__decorate([
    methodEventSub(world.afterEvents.entityLoad),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EntityLoadAfterEvent]),
    __metadata("design:returntype", void 0)
], test.prototype, "load", null);
//# sourceMappingURL=test.js.map