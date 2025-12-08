var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ItemStack, system, world, } from "@minecraft/server";
import { BlockEntity } from "../../lib/BlockEntity";
import { isSamePos } from "../../lib/ObjectUtil";
import { vanillaCookingPotRecipe } from "../../data/recipe/cookingPotRecipe";
import { CookingPotRecipe } from "../../lib/CookingPotRecipe";
import { isHeated } from "../../data/Heaters";
import { subscribeEvent } from "../../lib/EventSubscriber";
const recipes = vanillaCookingPotRecipe.recipe;
const recipeFactory = new Map();
function arrowheadUtil(entity, oldItemStack, slot, container) {
    if (entity.getDynamicProperty("farmersdelight:not_can_set"))
        return;
    const itemStack = container.getItem(slot);
    if (itemStack?.typeId != oldItemStack.typeId) {
        container.setItem(slot, oldItemStack);
    }
}
function blockEntityLoot(args, id) {
    const cookingPotblock = new ItemStack('farmersdelight:cooking_pot');
    if (!isSamePos(args.entity.location, args.blockEntityDataLocation))
        args.entity.teleport(args.blockEntityDataLocation);
    if (args.block?.typeId == id)
        return;
    const inventory = args.entity?.getComponent("inventory");
    const container = inventory?.container;
    for (let slot = 0; slot < 9; slot++) {
        const itemStack = container?.getItem(slot);
        if (slot != 6 && slot != 8 && itemStack) {
            args.entity.dimension.spawnItem(itemStack, args.blockEntityDataLocation);
        }
        if (slot == 6) {
            if (itemStack) {
                const typeId = itemStack.typeId;
                const amount = itemStack.amount;
                container?.setItem(6, undefined);
                cookingPotblock.setLore([`§r§f${amount} 份食物: ${typeId}`]);
            }
            container?.setItem(9, undefined);
            container?.setItem(10, undefined);
            args.entity.setDynamicProperty("farmersdelight:not_can_set", true);
            args.entity.dimension.spawnItem(cookingPotblock, args.blockEntityDataLocation);
        }
        if (slot == 8) {
            if (itemStack) {
                args.entity.dimension.spawnItem(itemStack, args.blockEntityDataLocation);
            }
            BlockEntity.clearEntity(args);
            break;
        }
    }
}
export class CookingPotBlockEntity extends BlockEntity {
    tick(args) {
        const entityBlockData = super.blockEntityData(args.entity);
        if (!entityBlockData)
            return;
        const entity = entityBlockData.entity;
        const { x, y, z } = entity.location;
        const block = entityBlockData.block;
        const inventory = args.entity?.getComponent("inventory");
        const container = inventory?.container;
        if (!container)
            return;
        blockEntityLoot(entityBlockData, "farmersdelight:cooking_pot");
        const map = new Map();
        const progress = entity.getDynamicProperty("farmersdelight:cooking_pot_progress") ?? 0;
        const heated = isHeated(block);
        let cookingPotRecipe;
        if (!recipeFactory.get(entity.id)) {
            cookingPotRecipe = new CookingPotRecipe(entity, 6, 1, ['cooking_pot'], recipes);
            recipeFactory.set(entity.id, cookingPotRecipe);
        }
        else {
            cookingPotRecipe = recipeFactory.get(entity.id);
        }
        entity.setDynamicProperty('cookingPot:heated', heated);
        cookingPotRecipe.update();
        if (heated) {
            arrowheadUtil(entity, new ItemStack("farmersdelight:fire_1"), 10, container);
            if (system.currentTick % 15 == 0) {
                const random = Math.floor(Math.random() * 10);
                block.dimension.spawnParticle(`farmersdelight:steam_${random}`, { x: x, y: y + 1, z: z });
                block.dimension.spawnParticle('farmersdelght:bubble', { x: x, y: y + 0.63, z: z });
            }
            if (system.currentTick % 80 == 0) {
                container?.getItem(6) ? entity.runCommand("playsound block.farmersdelight.cooking_pot.boil_soup @a ~ ~ ~ 1 1") : entity.runCommand("playsound block.farmersdelight.cooking_pot.boil_water @a ~ ~ ~ 1 1");
            }
            const progress = cookingPotRecipe.getProgress();
            if (progress) {
                const num = Math.floor(progress * 10) * 10;
                const arrowhead = new ItemStack(`farmersdelight:cooking_pot_arrow_${num}`);
                arrowheadUtil(entity, arrowhead, 9, container);
            }
            else {
                arrowheadUtil(entity, new ItemStack("farmersdelight:cooking_pot_arrow_0"), 9, container);
            }
        }
        else {
            arrowheadUtil(entity, new ItemStack("farmersdelight:fire_0"), 10, container);
        }
    }
}
__decorate([
    subscribeEvent(world.afterEvents.dataDrivenEntityTrigger, { entityTypes: ["farmersdelight:cooking_pot"], eventTypes: ["farmersdelight:cooking_pot_tick"] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CookingPotBlockEntity.prototype, "tick", null);
