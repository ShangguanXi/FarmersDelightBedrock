import { Container, Entity, EntityInventoryComponent, ItemStack } from "@minecraft/server"

/**
 * @remarks
 * 配方管理器by诗栩MSolo
 * 提供配方管理器的基础功能
*/
export class RecipeHolder {
    public readonly entity: Entity
    public readonly tags: string[]
    public readonly inputSlots: number
    public readonly outputSlots: number
    readonly container: Container
    private recipeList: any[]
    currentTick: number // 当前刻, 若无配方则应为-1
    currentRecipe: any // 当前配方, 若无配方则应为false
    /**
     * @remarks
     * 创建配方管理器
     * @param entity 配方管理器绑定的实体
     * @param inputSlots 输入栏位的数量
     * @param outputSlots 输出栏位的数量
     * @param tags 接受的配方tag
     * @param recipeList 初始配方数组
    */
    constructor(entity: Entity, inputSlots: number, outputSlots: number, tags: string[], recipeList?: any[]) {
        this.entity = entity
        this.inputSlots = inputSlots
        this.outputSlots = outputSlots
        this.tags = tags
        this.recipeList = recipeList ? recipeList : []
        this.currentRecipe = false
        this.currentTick = this.entity.getDynamicProperty('recipe:progressTick') ? this.entity.getDynamicProperty('recipe:progressTick') as number : -1
        const inventoryComp = entity.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent
        this.container = inventoryComp.container as Container
        if (inputSlots + outputSlots > this.container.size) {
            console.error(`[Recipe Holder]False to create ${entity.typeId} recipe holder!\nThe size of the entity's container is too small.`)
            return
        }
    }
    /**
     * @remarks
     * 添加配方, 若添加的配方的标识符与已有配方相同则会根据优先级选择保留哪个配方
     * @param addingRecipe 要添加的配方
    */
    addRecipe(addingRecipe: any) {
        let alter = false
        for (const index in this.recipeList) {
            if (addingRecipe.identifer == this.recipeList[index].identifer) {
                if (addingRecipe.priority > this.recipeList[index].priority) {
                    this.recipeList[index] = addingRecipe
                    alter = true
                }
            }
        }
        if (!alter) {
            this.recipeList.push(addingRecipe)
        }
    }
    /**
     * @remarks
     * 通过原料获取配方
     * @param ingredients 原料数组, 可通过 getInputs() 方法获取
    */
    getRecipe(ingredients: Array<ItemStack>) {
        for (const recipe of this.recipeList) {
            let needs = JSON.parse(JSON.stringify(recipe.ingredients)) as Array<ItemIngredient | TagIngredient>
            if (ingredients.length == needs.length) {
                let found = ingredients.every((item, index) => {
                    for (const index2 in needs) {
                        if (this.isIngredient(item, needs[index2])) {
                            needs.splice(Number(index2), 1)
                            return true
                        }
                    }
                    return false
                })
                if (found) return recipe
            }
        }
        return false
    }
    /**
     * @remarks
     * 通过配方标识符获取配方
     * @param recipeId 配方标识符
    */
    getRecipeById(recipeId: string) {
        for (const recipe of this.recipeList) {
            if (recipe.identifer == recipeId) {
                return recipe
            }
        }
        return false
    }
    /**
     * @remarks
     * 根据条件获取配方, 若无条件则获取所有配方
    */
    getRecipes(options?: RecipeQueryOptions) {
        if (!options) return this.recipeList
        else {
            let list = []
            if (options.tags) {
                for (const tag of options.tags) {
                    for (const recipe of this.recipeList) {
                        if (recipe.tags.includes(tag)) {
                            list.push(recipe)
                        }
                    }
                }
            }
            return list
        }
    }
    /**
     * @remarks
     * 更新配方进度, 每tick调用
     * 具体功能在子类中实现
    */
    update() {
        
    }
    /**
     * @remarks
     * 获取当前配方进度(0-1小数), 若当前没有配方进行则返回false
    */
    getProgress() {
        if (this.currentRecipe) {
            return this.currentTick / this.currentRecipe.time
        }
        else {
            return false
        }
    }
    /**
     * @remarks
     * 获取当前实体容器输入槽中的物品, 不包括空槽位
    */
    getInputs() {
        let itemList: ItemStack[] = []
        for (let i = 0; i < this.inputSlots; i++) {
            const item = this.container?.getItem(i)
            if (item) itemList.push(item)
        }
        return itemList
    }
    /**
     * @remarks
     * 获取当前实体容器输出槽中的物品, 不包括空槽位
    */
    getOutputs() {
        let itemList: ItemStack[] = []
        for (let i = 0; i < this.outputSlots; i++) {
            const item = this.container?.getItem(i + this.inputSlots)
            if (item) itemList.push(item)
        }
        return itemList
    }
    /**
     * @remarks
     * 设置输出槽物品
     * @param slot 输出槽位
     * @param item 设置的物品堆叠
    */
    setOutput(slot: number, item: ItemStack | undefined) {
        this.container?.setItem(slot + this.inputSlots, item)
    }
    /**
     * @remarks
     * 向输出槽添加物品, 若添加失败返回false, 添加成功返回true
     * @param item 添加的物品堆叠
    */
    addOutput(item: ItemStack) {
        let added = false
        for (let i = 0; i < this.outputSlots; i++) {
            const output = this.container?.getItem(i + this.inputSlots)
            if (!output){
                this.container.setItem(i + this.inputSlots, item)
                added = true
            }
            else if (output?.isStackableWith(item)) {
                if (output.amount + item.amount <= output.maxAmount){
                    output.amount += item.amount
                    added = true
                }
                else{
                    item.amount -= output.maxAmount - output.amount
                    output.amount = output.maxAmount
                }
                this.container?.setItem(i + this.inputSlots, output)
            }
        }
        return added
    }
    /**
     * @remarks
     * 完成一次配方, 按传入的配方调整物品
     * @param recipe 配方
    */
    consume(recipe: any) {
        const resultItem = new ItemStack(recipe.result.item, recipe.result.amount)
        if (this.addOutput(resultItem)) {
            for (let i = 0; i < this.inputSlots; i++) {
                const item = this.container?.getItem(i)
                if (item && item.amount > 1){
                    item.amount -= 1
                    this.container?.setItem(i, item)
                }
                else{
                    this.container?.setItem(i)
                }
            }
        }
    }
    /**
     * @remarks
     * 判断传入的物品是否为所需原料
    */
    isIngredient(need: ItemStack, ingredient: ItemIngredient | TagIngredient | Array<ItemIngredient | TagIngredient>) {
        if ('tag' in ingredient) {
            ingredient as TagIngredient
            return need.hasTag(ingredient.tag)
        }
        else if ('item' in ingredient) {
            ingredient as ItemIngredient
            return need.typeId == ingredient.item
        }
        else if (Array.isArray(ingredient)) {
            ingredient as Array<ItemIngredient | TagIngredient>
            let result = false
            for (const a of ingredient) {
                if (this.isIngredient(need, a)) {
                    result = true
                }
            }
            return result
        }
        return false
    }
}

export interface TagIngredient {
    tag: string
}

export interface ItemIngredient {
    item: string
}

export interface ItemResult {
    item: string,
    amount?: number
}

export interface RecipeQueryOptions {
    tags?: string[]
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
}