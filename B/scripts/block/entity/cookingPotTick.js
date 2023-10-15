import { world, ItemStack } from "@minecraft/server";
import { RecipeHolder } from "../../lib/RecipeHolder";
import { location } from "../../lib/BlockEntity";
import { vanillaCookingPotRecipe } from "../../data/recipe/cookingPotRecipe";
import { EntityData } from "../../lib/EntityData";

const options = { entityTypes: ['farmersdelight:cooking_pot'], eventTypes: ['farmersdelight:cooking_pot_tick'] };
const emptyArrowhead = new ItemStack('farmersdelight:cooking_pot_arrow_0');

function potLoot(container, block, entity, blockLocation, id) {
    const cookingPotblock = new ItemStack('farmersdelight:cooking_pot');
    if (block) {
        if (JSON.stringify(entity.location) !== JSON.stringify(blockLocation)) {
            entity.teleport(blockLocation);
        }
    }
    if (block != id) {
        const itemStack = container.getItem(6);
        if (itemStack) {
            const typeId = itemStack.typeId;
            const amount = itemStack.amount;
            container.setItem(6, null);
            cookingPotblock.setLore([`§r§f目前的 ${amount} 份食物: ${typeId}`]);
        }
        entity.dimension.spawnItem(cookingPotblock, blockLocation);
        container.setItem(9, null);
        entity.triggerEvent('farmersdelight:despawn');
    }
}

function arrowheadUtil(container, oldItemStack) {
    const itemStack = container.getItem(9);
    if (itemStack.typeId != oldItemStack.typeId) {
        container.setItem(9, oldItemStack);
    }
}

function working(args) {
    const entity = args.entity;
    try {
        const dimension = entity?.dimension;
        const block = dimension.getBlock(entity.location);
        const stove = dimension.getBlock({ x: entity.location.x, y: entity.location.y - 1, z: entity.location.z })?.permutation?.getState('farmersdelight:is_working');
        if (block) {
            const map = new Map();
            const entityData = new EntityData(entity, 'progress');
            const blockLocation = location(entity);
            const oldBlock = dimension.getBlock(blockLocation);
            const container = entity.getComponent('inventory').container;
            potLoot(container, oldBlock.typeId, entity, blockLocation, 'farmersdelight:cooking_pot');
            const recipes = vanillaCookingPotRecipe.recipe;
            const holder = new RecipeHolder(container, recipes, (map.get('previewRecipe') ?? 0), (map.get('outputRecipe') ?? 0));
            const previewIndex = holder.previewIndex;
            const outputIndex = holder.outputIndex;
            map.set('previewRecipe', previewIndex);
            map.set('outputRecipe', outputIndex);
            if (stove) {
                if (previewIndex > -1 && holder.arr.length == recipes[previewIndex].ingredients.length && holder.canPreviewRecipe) {
                    const cookingTime = recipes[previewIndex].cookingtime;
                    const num = Math.floor((entityData.value / cookingTime) * 10) * 10;
                    const arrowhead = new ItemStack(`farmersdelight:cooking_pot_arrow_${num}`);
                    arrowheadUtil(container, arrowhead);
                    if (entityData.value >= cookingTime) {
                        entityData.setEntityData('remove', cookingTime);
                        holder.consume();
                    } else {
                        entityData.setEntityData('add', 1);
                    }
                } else {
                    entityData.setEntityData('remove', entityData.value);
                    arrowheadUtil(container, emptyArrowhead)
                }
            }
            if (outputIndex > -1) {
                holder.output();
            }
        }
    } catch (e) {
    }
}
world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(working, options);