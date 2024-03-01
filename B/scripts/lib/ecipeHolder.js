import { EntityInventoryComponent } from "@minecraft/server";
/**
 * @remarks
 * 配方管理器by诗栩MSolo
 * 提供配方管理器的基础功能
*/
export class RecipeHolder {
    /**
     * @remarks
     * 创建配方管理器
     * @param entity 配方管理器绑定的实体
     * @param inputSlots 输入栏位的数量
     * @param outputSlots 输出栏位的数量
     * @param tags 接受的配方tag
     * @param recipeList 初始配方数组
    */
    constructor(entity, inputSlots, outputSlots, tags, recipeList) {
        this.entity = entity;
        this.inputSlots = inputSlots;
        this.outputSlots = outputSlots;
        this.tags = tags;
        this.recipeList = recipeList ? recipeList : [];
        this.currentRecipe = false;
        this.currentTick = -1;
        if (!entity.hasComponent(EntityInventoryComponent.componentId)) {
            console.error(`[Recipe Holder]False to create ${entity.typeId} recipe holder!\nThis entity doesn't have an inventory component.`);
            return;
        }
        else {
            const inventoryComp = entity.getComponent(EntityInventoryComponent.componentId);
            this.container = inventoryComp?.container;
            if (inputSlots + outputSlots > this.container.size) {
                console.error(`[Recipe Holder]False to create ${entity.typeId} recipe holder!\nThe size of the entity's container is too small.`);
                return;
            }
        }
    }
    /**
     * @remarks
     * 添加配方, 若添加的配方的标识符与已有配方相同则会根据优先级选择保留哪个配方
     * @param addingRecipe 要添加的配方
    */
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
    /**
     * @remarks
     * 通过原料获取配方
     * @param ingredients 原料数组, 可通过 getInputs() 方法获取
    */
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
    /**
     * @remarks
     * 通过配方标识符获取配方
     * @param recipeId 配方标识符
    */
    getRecipeById(recipeId) {
        for (const recipe of this.recipeList) {
            if (recipe.identifer == recipeId) {
                return recipe;
            }
        }
        return false;
    }
    /**
     * @remarks
     * 根据条件获取配方, 若无条件则获取所有配方
    */
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
        }
    }
    /**
     * @remarks
     * 更新配方进度, 每tick调用
     * 具体功能在子类中实现
    */
    update() {
        console.warn('update!');
    }
    /**
     * @remarks
     * 获取当前配方进度(0-1小数), 若当前没有配方进行则返回false
    */
    getProcess() {
        if (this.currentRecipe) {
            return this.currentTick / this.currentRecipe.requireTime;
        }
        else {
            return false;
        }
    }
    /**
     * @remarks
     * 获取当前实体容器输入槽中的物品, 不包括空槽位
    */
    getInputs() {
        let itemList = [];
        for (let i = 0; i < this.inputSlots; i++) {
            const item = this.container?.getItem(i);
            if (item)
                itemList.push(item);
        }
        return itemList;
    }
    /**
     * @remarks
     * 判断传入的物品是否为所需原料
    */
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
//# sourceMappingURL=ecipeHolder.js.map