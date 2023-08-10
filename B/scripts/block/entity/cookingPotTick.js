import { world, ItemStack } from "@minecraft/server";
import { RecipeHolder } from "../../lib/RecipeHolder";
import { location } from "../../lib/BlockEntity";
import { vanillaCookingPotRecipe } from "../../data/recipe/cookingPotRecipe";

const options = { entityTypes: ['farmersdelight:cooking_pot'], eventTypes: ['farmersdelight:cooking_pot_tick'] };

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
        entity.triggerEvent('farmersdelight:despawn');
    }
}

function working(args) {
    const entity = args.entity;
    const dimension = entity?.dimension;
    const block = dimension.getBlock(entity.location);
    const stove = dimension.getBlock({ x: entity.location.x, y: entity.location.y - 1, z: entity.location.z })?.permutation?.getState('farmersdelight:is_working');
    if (block) {
        const data = new Map();
        const blockLocation = location(entity);
        const oldBlock = dimension.getBlock(blockLocation);
        const container = entity.getComponent('inventory').container;
        const recipes = vanillaCookingPotRecipe.recipe;
        const holder = new RecipeHolder(container, recipes, 0);
        const index = holder.index;
        data.set('recipe', index);
        // if (index >= 0 && !currentTick % (recipes[index].cookingtime)) {
        // holder.output()
        // }
        if (stove) {
            holder.consume();
        }
        potLoot(container, oldBlock.typeId, entity, blockLocation, 'farmersdelight:cooking_pot');
    }
}
world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(working, options);