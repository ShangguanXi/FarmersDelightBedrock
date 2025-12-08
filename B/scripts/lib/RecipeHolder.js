import { EntityInventoryComponent, ItemStack } from "@minecraft/server";
export class RecipeHolder {
    constructor(entity, inputSlots, outputSlots, tags, recipeList) {
        this.entity = entity;
        this.inputSlots = inputSlots;
        this.outputSlots = outputSlots;
        this.tags = tags;
        this.recipeList = recipeList ? recipeList : [];
        this.currentRecipe = false;
        this.currentTick = this.entity.getDynamicProperty('recipe:progressTick') ? this.entity.getDynamicProperty('recipe:progressTick') : -1;
        const inventoryComp = entity.getComponent(EntityInventoryComponent.componentId);
        this.container = inventoryComp.container;
        if (inputSlots + outputSlots > this.container.size) {
            console.error(`[Recipe Holder]False to create ${entity.typeId} recipe holder!\nThe size of the entity's container is too small.`);
            return;
        }
    }
    addRecipe(addingRecipe) {
        let alter = false;
        for (const index in this.recipeList) {
            if (addingRecipe.identifer == this.recipeList[index].identifer) {
                if (addingRecipe.priority > this.recipeList[index].priority) {
                    this.recipeList[index] = addingRecipe;
                    alter = true;
                }
            }
        }
        if (!alter) {
            this.recipeList.push(addingRecipe);
        }
    }
    getRecipe(ingredients) {
        for (const recipe of this.recipeList) {
            let needs = JSON.parse(JSON.stringify(recipe.ingredients));
            if (ingredients.length == needs.length) {
                let found = ingredients.every((item, index) => {
                    for (const index2 in needs) {
                        if (this.isIngredient(item, needs[index2])) {
                            needs.splice(Number(index2), 1);
                            return true;
                        }
                    }
                    return false;
                });
                if (found)
                    return recipe;
            }
        }
        return false;
    }
    getRecipeById(recipeId) {
        for (const recipe of this.recipeList) {
            if (recipe.identifer == recipeId) {
                return recipe;
            }
        }
        return false;
    }
    getRecipes(options) {
        if (!options)
            return this.recipeList;
        else {
            let list = [];
            if (options.tags) {
                for (const tag of options.tags) {
                    for (const recipe of this.recipeList) {
                        if (recipe.tags.includes(tag)) {
                            list.push(recipe);
                        }
                    }
                }
            }
            return list;
        }
    }
    update() {
    }
    getProgress() {
        if (this.currentRecipe) {
            return this.currentTick / this.currentRecipe.time;
        }
        else {
            return false;
        }
    }
    getInputs() {
        let itemList = [];
        for (let i = 0; i < this.inputSlots; i++) {
            const item = this.container?.getItem(i);
            if (item)
                itemList.push(item);
        }
        return itemList;
    }
    getOutputs() {
        let itemList = [];
        for (let i = 0; i < this.outputSlots; i++) {
            const item = this.container?.getItem(i + this.inputSlots);
            if (item)
                itemList.push(item);
        }
        return itemList;
    }
    setOutput(slot, item) {
        this.container?.setItem(slot + this.inputSlots, item);
    }
    addOutput(item) {
        let added = false;
        for (let i = 0; i < this.outputSlots; i++) {
            const output = this.container?.getItem(i + this.inputSlots);
            if (!output) {
                this.container.setItem(i + this.inputSlots, item);
                added = true;
            }
            else if (output?.isStackableWith(item)) {
                if (output.amount + item.amount <= output.maxAmount) {
                    output.amount += item.amount;
                    added = true;
                }
                else {
                    item.amount -= output.maxAmount - output.amount;
                    output.amount = output.maxAmount;
                }
                this.container?.setItem(i + this.inputSlots, output);
            }
        }
        return added;
    }
    consume(recipe) {
        const resultItem = new ItemStack(recipe.result.item, recipe.result.amount);
        if (this.addOutput(resultItem)) {
            for (let i = 0; i < this.inputSlots; i++) {
                const item = this.container?.getItem(i);
                if (item && item.amount > 1) {
                    item.amount -= 1;
                    this.container?.setItem(i, item);
                }
                else {
                    this.container?.setItem(i);
                }
            }
        }
    }
    isIngredient(need, ingredient) {
        if ('tag' in ingredient) {
            ingredient;
            return need.hasTag(ingredient.tag);
        }
        else if ('item' in ingredient) {
            ingredient;
            return need.typeId == ingredient.item;
        }
        else if (Array.isArray(ingredient)) {
            ingredient;
            let result = false;
            for (const a of ingredient) {
                if (this.isIngredient(need, a)) {
                    result = true;
                }
            }
            return result;
        }
        return false;
    }
}
export const testRecipe = {
    'identifer': 'farmersdelight:test_recipe',
    'tags': ['cooking_pot'],
    'priority': 0,
    "container": {
        "item": "minecraft:bowl"
    },
    "time": 200,
    "experience": 1.0,
    "ingredients": [
        {
            "item": "minecraft:brown_mushroom"
        },
        {
            "item": "minecraft:red_mushroom"
        },
        {
            "item": "minecraft:carrot"
        },
        {
            "item": "farmersdelight:rice"
        }
    ],
    "result": {
        "item": "farmersdelight:mushroom_rice"
    }
};
