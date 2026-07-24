var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ItemStack, PlayerInteractWithBlockBeforeEvent, PlayerPlaceBlockAfterEvent, system, world, } from "@minecraft/server";
import { attachedBlockEntity, subscribeEvent } from "../lib/EventSubscriber";
import { getBlockEntity } from "../lib/BlockWithEntity";
import { vanillaCookingPotRecipe } from "../data/recipe/cookingPotRecipe";
import { CookingPotRecipe } from "../lib/CookingPotRecipe";
import { isHeated } from "../data/Heaters";
const recipes = vanillaCookingPotRecipe.recipe;
const recipeFactory = new Map();
const potItem = new Map();
function arrowheadUtil(entity, oldItemStack, slot, container) {
    if (entity.getDynamicProperty("farmersdelight:not_can_set"))
        return;
    const itemStack = container.getItem(slot);
    if (itemStack?.typeId != oldItemStack.typeId) {
        container.setItem(slot, oldItemStack);
    }
}
let CookingPotBlockEntity = class CookingPotBlockEntity {
    static onDiscard(entity) {
        const cookingPotblock = new ItemStack('farmersdelight:cooking_pot');
        const inventory = entity.getComponent("inventory");
        const container = inventory?.container;
        if (!container)
            return;
        for (let slot = 0; slot < 9; slot++) {
            const itemStack = container.getItem(slot);
            if (slot != 6 && slot != 8 && itemStack) {
                entity.dimension.spawnItem(itemStack, entity.location);
            }
            if (slot == 6) {
                if (itemStack) {
                    const typeId = itemStack.typeId;
                    const amount = itemStack.amount;
                    container.setItem(6, undefined);
                    cookingPotblock.setLore([`§r§f${amount} 份食物: ${typeId}`]);
                }
                container.setItem(9, undefined);
                container.setItem(10, undefined);
                entity.setDynamicProperty("farmersdelight:not_can_set", true);
                entity.dimension.spawnItem(cookingPotblock, entity.location);
            }
            if (slot == 8) {
                if (itemStack) {
                    entity.dimension.spawnItem(itemStack, entity.location);
                }
            }
        }
        recipeFactory.delete(entity.id);
    }
    static onTick(entity, block) {
        const name = entity.nameTag;
        if (name != "farmersdelight厨锅")
            entity.nameTag = "farmersdelight厨锅";
        const { x, y, z } = entity.location;
        const inventory = entity.getComponent("inventory");
        const container = inventory?.container;
        if (!container)
            return;
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
                container.getItem(6) ? entity.runCommand("playsound block.farmersdelight.cooking_pot.boil_soup @a ~ ~ ~ 1 1") : entity.runCommand("playsound block.farmersdelight.cooking_pot.boil_water @a ~ ~ ~ 1 1");
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
    static stashItem(args) {
        potItem.set(args.player.id, args.itemStack);
    }
    static onPlace(args) {
        const itemStack = potItem.get(args.player.id);
        const block = args.block;
        if (block.typeId != "farmersdelight:cooking_pot")
            return;
        const lores = itemStack?.getLore() ?? [];
        const entity = getBlockEntity(block);
        if (!entity)
            return;
        const inventory = entity.getComponent("inventory");
        const container = inventory?.container;
        if (!container || !lores.length)
            return;
        for (const lore of lores) {
            const data = lore.match(/\d+|\S+:\S+/g);
            if (!data)
                continue;
            const slot = container.getSlot(6);
            const cookingItemStack = new ItemStack(data[1]);
            cookingItemStack.amount = parseInt(data[0]);
            slot.setItem(cookingItemStack);
        }
    }
    static onBreak(args) {
        const block = args.block;
        const location = block.location;
        args.cancel = true;
        system.run(() => {
            block.dimension.setBlockType(location, "minecraft:air");
        });
    }
};
__decorate([
    subscribeEvent(world.beforeEvents.playerInteractWithBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerInteractWithBlockBeforeEvent]),
    __metadata("design:returntype", void 0)
], CookingPotBlockEntity, "stashItem", null);
__decorate([
    subscribeEvent(world.afterEvents.playerPlaceBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerPlaceBlockAfterEvent]),
    __metadata("design:returntype", void 0)
], CookingPotBlockEntity, "onPlace", null);
__decorate([
    subscribeEvent(world.beforeEvents.playerBreakBlock, { blockTypes: ["farmersdelight:cooking_pot"] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CookingPotBlockEntity, "onBreak", null);
CookingPotBlockEntity = __decorate([
    attachedBlockEntity({ eventTypes: ["farmersdelight:cooking_pot_tick"] })
], CookingPotBlockEntity);
export { CookingPotBlockEntity };
