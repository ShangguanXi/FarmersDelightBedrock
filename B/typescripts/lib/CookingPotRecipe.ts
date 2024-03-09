import { Entity, ItemStack } from "@minecraft/server";
import { RecipeHolder } from "./RecipeHolder";
import { ItemUtil } from "./ItemUtil";

export class CookingPotRecipe extends RecipeHolder {
    private currentRecipe2: any
    constructor(entity: Entity, inputSlots: number, outputSlots: number, tags: string[], recipeList?: any[]) {
        super(entity, inputSlots, outputSlots, tags, recipeList)
        this.currentRecipe2 = false
    }
    update(): void {
        const heated = this.entity.getDynamicProperty('cookingPot:heated')
        //检查结果栏是否可以输出并完成输出操作
        const container = this.container.getItem(7);
        const result = this.container.getItem(6);
        if (result) {
            this.currentRecipe2 = this.getValidRecipe2(result, container)
            if (this.currentRecipe2) {
                const itemStack = new ItemStack(this.currentRecipe2.result.item);
                //若菜品不需要容器
                if (!this.currentRecipe2.container) {
                    if (result && this.setItem(itemStack, 8)) {
                        ItemUtil.clearItem(this.container, 6);
                        this.currentRecipe2 = false
                    }
                }
                //若容器栏容器正确
                else if (container && this.isIngredient(container, this.currentRecipe2.container)) {
                    if (this.setItem(itemStack, 8)) {
                        ItemUtil.clearItem(this.container, 6);
                        ItemUtil.clearItem(this.container, 7);
                        this.currentRecipe2 = false
                    }
                }
            }
        }
        //若加热，执行烹饪步骤
        if (heated) {
            const inputs = this.getInputs()
            const recipe = this.getRecipe(inputs)
            if (recipe) {
                //更新配方数据
                if (!this.currentRecipe || recipe.identifer != this.currentRecipe.identifer) {
                    this.currentTick = 0
                    this.currentRecipe = recipe
                }
                //检测配方是否可以进行 
                const amount = recipe.result.amount ?? 1
                if (result && (
                    result.amount == result.maxAmount ||
                    !this.isIngredient(result, recipe.result) ||
                    result.amount + amount > result.maxAmount
                    )
                    ){
                    return
                }
                this.currentTick += 1
                if (this.currentTick == recipe.time){
                    this.consume(recipe)
                    this.currentRecipe = false
                    this.currentTick = -1
                }
            }
            else {
                this.currentRecipe = false
                this.currentTick = -1
            }
        }
        else {
            this.currentRecipe = false
            this.currentTick = -1
        }
    }
    private setItem(itemStack: ItemStack, index: number) {
        const output = this.container.getItem(index);
        if (output) {
            if (output.typeId != itemStack.typeId) return false
            if (output.amount < output.maxAmount) {
                output.amount += 1;
                this.container.setItem(index, output);
                return true;
            }
        } else {
            itemStack.amount = 1;
            this.container.setItem(index, itemStack);
            return true;
        }
        return false;
    }
    private getValidRecipe2(output: ItemStack, container: ItemStack | undefined) {
        const recipes = this.getRecipes()
        for (const index in recipes) {
            if (((container && recipes[index].container) ? this.isIngredient(container, recipes[index].container) : true) && output.typeId === recipes[index].result.item) {
                return recipes[index]
            }
        }
        return false;
    }
}
