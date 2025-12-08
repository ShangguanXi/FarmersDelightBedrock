var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { EntityComponentTypes, ItemStack, } from "@minecraft/server";
import { findCookingRecipe } from "../../data/recipe/cookRecipe";
import { attachedBlockEntity } from "../../lib/EventSubscriber";
import { dropsItems } from "../../lib/EntityUtil";
const xOffset = 0.3;
const yOffset = 0.2;
const stoveOffsets = [
    {
        x: xOffset,
        y: yOffset
    },
    {
        x: 0,
        y: yOffset
    },
    {
        x: -xOffset,
        y: yOffset
    },
    {
        x: xOffset,
        y: -yOffset
    },
    {
        x: 0,
        y: -yOffset
    },
    {
        x: -xOffset,
        y: -yOffset
    }
];
function getRotatedOffsets(direction) {
    switch (direction) {
        case "south":
            return stoveOffsets.map(offset => ({ x: -offset.x, y: -offset.y }));
        case "east":
            return stoveOffsets.map(offset => ({ x: -offset.y, y: offset.x }));
        case "west":
            return stoveOffsets.map(offset => ({ x: offset.y, y: -offset.x }));
        case "north":
        default:
            return stoveOffsets;
    }
}
function getRecipeRequiredTime(slot) {
    const stack = slot.getItem();
    if (!stack)
        return 0;
    const recipe = findCookingRecipe(stack);
    return recipe ? recipe.time : 0;
}
let BasketBlockEntity = class BasketBlockEntity {
    static onDiscard(entity) {
        dropsItems(entity);
    }
    static onTick(entity, block) {
        const container = entity?.getComponent(EntityComponentTypes.Inventory)?.container;
        if (!container)
            return;
        const extinguished = !block.permutation.getState("farmersdelight:is_working");
        const rotatedOffsets = getRotatedOffsets(block.permutation.getState("minecraft:cardinal_direction"));
        const { x, y, z } = block.bottomCenter();
        const dimension = entity.dimension;
        for (let i = 0; i < 6; ++i) {
            const slot = container.getSlot(i);
            if (!slot.hasItem())
                continue;
            const itemId = slot.typeId;
            const name = itemId.split(":");
            const particle = name[0] == "minecraft" ? `farmersdelight:minecraft_stove_${name[1]}` : `${name[0]}:stove_${name[1]}`;
            dimension.spawnParticle(particle, {
                x: x + rotatedOffsets[i].x,
                y: y + 1.02,
                z: z + rotatedOffsets[i].y,
            });
            if (extinguished)
                continue;
            const time = entity.getDynamicProperty(`farmersdelight:item_${i}_time`) ?? 0;
            if (time % 20 == 0) {
                dimension.spawnParticle("farmersdelight:stove_smoke_particle", {
                    x: x + rotatedOffsets[i].x,
                    y: y + 1.02,
                    z: z + rotatedOffsets[i].y,
                });
            }
            if (time < (entity.getDynamicProperty(`farmersdelight:item_${i}_max_time`) ?? getRecipeRequiredTime(slot))) {
                entity.setDynamicProperty(`farmersdelight:item_${i}_time`, time + 1);
            }
            else {
                let stack = slot.getItem();
                if (!stack)
                    continue;
                const recipe = findCookingRecipe(stack);
                if (recipe) {
                    const count = recipe.count ?? 1;
                    stack = new ItemStack(recipe.result, count > 0 ? count * slot.amount : slot.amount);
                }
                dimension.spawnItem(stack, { x, y: y + 1.0, z })?.clearVelocity();
                slot.setItem(undefined);
                entity.setDynamicProperties({
                    [`farmersdelight:item_${i}_time`]: undefined,
                    [`farmersdelight:item_${i}_max_time`]: undefined,
                });
            }
        }
        if (!extinguished && Math.random() < 0.1) {
            dimension.playSound("block.campfire.crackle", { x, y: y + 0.5, z });
        }
    }
};
BasketBlockEntity = __decorate([
    attachedBlockEntity({ eventTypes: ["farmersdelight:stove_tick"] })
], BasketBlockEntity);
export { BasketBlockEntity };
