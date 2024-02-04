var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { EntityInventoryComponent, ItemStack, system, world } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { BlockEntity } from "./BlockEntity";
import ObjectUtil from "../../lib/ObjectUtil";
import { vanillaCookingPotRecipe } from "../../data/recipe/cookingPotRecipe";
import { CookingPotRecipe } from "../../lib/CookingPotRecipe";
import { heatConductors, heatSources } from "../../data/heatBlocks";
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
export class CookingPotBlockEntity extends BlockEntity {
    tick(args) {
        const entityBlockData = super.blockEntityData(args);
        if (!entityBlockData)
            return;
        const entity = entityBlockData.entity;
        const { x, y, z } = entity.location;
        const block = entityBlockData.block;
        const container = entity.getComponent(EntityInventoryComponent.componentId)?.container;
        if (!container)
            return;
        blockEntityLoot(entityBlockData, "farmersdelight:cooking_pot");
        const map = new Map();
        const progress = entity.getDynamicProperty("farmersdelight:cooking_pot_progress") ?? 0;
        //热源检测
        const heated = heatCheck(block);
        //配方管理器, 每tick处理一次
        const cookingPotRecipe = new CookingPotRecipe(container, 6, recipes, map.get("previewRecipe") ?? 0, map.get("previewRecipe2") ?? 0);
        map.set("previewRecipe2", cookingPotRecipe.index2);
        if (cookingPotRecipe.index2 > -1)
            cookingPotRecipe.output();
        if (heated) {
            arrowheadUtil(entity, fireArrowFull, 10, container);
            map.set("previewRecipe", cookingPotRecipe.index);
            if (system.currentTick % 15 == 0) {
                const random = Math.floor(Math.random() * 10);
                block.dimension.spawnParticle(`farmersdelight:steam_${random}`, { x: x, y: y + 1, z: z });
                block.dimension.spawnParticle('farmersdelght:bubble', { x: x, y: y + 0.63, z: z });
            }
            if (system.currentTick % 80 == 0) {
                container?.getItem(6) ? entity.runCommandAsync("playsound block.farmersdelight.cooking_pot.boil_soup @a ~ ~ ~ 1 1") : entity.runCommandAsync("playsound block.farmersdelight.cooking_pot.boil_water @a ~ ~ ~ 1 1");
            }
            if (cookingPotRecipe.index > -1 && cookingPotRecipe.itemStackData.length == recipes[cookingPotRecipe.index].ingredients.length && cookingPotRecipe.canRecipe) {
                const cookingTime = recipes[cookingPotRecipe.index].cookingtime;
                const num = Math.floor((progress / cookingTime) * 10) * 10;
                const arrowhead = new ItemStack(`farmersdelight:cooking_pot_arrow_${num}`);
                arrowheadUtil(entity, arrowhead, 9, container);
                if (progress >= cookingTime) {
                    entity.setDynamicProperty("farmersdelight:cooking_pot_progress", 0);
                    cookingPotRecipe.consume();
                }
                else {
                    entity.setDynamicProperty("farmersdelight:cooking_pot_progress", progress + 1);
                }
            }
            else {
                entity.setDynamicProperty("farmersdelight:cooking_pot_progress", 0);
                arrowheadUtil(entity, emptyArrow, 9, container);
            }
        }
        else {
            arrowheadUtil(entity, fireArrowEmpty, 10, container);
        }
    }
}
__decorate([
    methodEventSub(world.afterEvents.dataDrivenEntityTriggerEvent, { entityTypes: ["farmersdelight:cooking_pot"], eventTypes: ["farmersdelight:cooking_pot_tick"] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CookingPotBlockEntity.prototype, "tick", null);
//# sourceMappingURL=CookingPotBlockEntity.js.map