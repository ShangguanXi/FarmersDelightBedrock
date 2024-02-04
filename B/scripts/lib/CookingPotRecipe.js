import { ItemStack } from "@minecraft/server";
import { RecipeHolder } from "./RecipeHolder";
import { ItemUtil } from "./ItemUtil";
export class CookingPotRecipe extends RecipeHolder {
    //判断该配方是否可以进行, 每tick一次
    constructor(container, length, recipes, index, index2) {
        super(container, length, recipes, index);
        this.canRecipe = true;
        //索引2, 用于索引菜品装碗对应容器
        this.index2 = index2;
        //容器槽物品
        const input = this.container.getItem(7);
        //结果槽物品
        const itemStack = this.container.getItem(6);
        //输出槽物品
        const output = this.container.getItem(8);
        if (itemStack) {
            if (itemStack.amount == itemStack.maxAmount) {
                this.canRecipe = false;
            }
            if (!this.isEqualValue(itemStack, this.recipes[this.index2].result)) {
                this.canRecipe = false;
                if (input) {
                    this.index2 = this.getValidRecipeIndex2(itemStack, input, this.recipes);
                }
            }
            if (this.index > -1) {
                const count = this.recipes[this.index].result.count ? this.recipes[this.index].result.count : 1;
                if (itemStack.amount == itemStack.maxAmount || (itemStack.amount += count) > itemStack.maxAmount) {
                    this.canRecipe = false;
                }
            }
        }
    }
    //配方完成时触发
    consume() {
        const output = this.container.getItem(6);
        const recipe = this.recipes[this.index];
        const itemStack = new ItemStack(recipe.result.item);
        if (this.container.emptySlotsCount < this.container.size) {
            this.clear(recipe, itemStack, this.container);
            if (!recipe.container && !output && this.setItem(itemStack, this.container, 8)) {
                ItemUtil.clearItem(this.container, 6);
            }
        }
    }
    //菜品装碗时触发
    output() {
        const recipe = this.recipes[this.index2];
        const itemStack = new ItemStack(recipe.result.item);
        const container = this.container.getItem(6);
        const input = this.container.getItem(7);
        //若菜品不需要容器
        if (!recipe.container) {
            if (container && this.setItem(itemStack, this.container, 8)) {
                ItemUtil.clearItem(this.container, 6);
            }
            //若容器栏容器正确
        }
        else if (this.isEqualValue(input, recipe.container) && container?.typeId == itemStack.typeId) {
            if (this.setItem(itemStack, this.container, 8)) {
                ItemUtil.clearItem(this.container, 6);
                ItemUtil.clearItem(this.container, 7);
            }
        }
    }
    clear(recipe, itemStack, container) {
        const output = container.getItem(6);
        const count = recipe.result.count ? recipe.result.count : 1;
        if (output ? output.amount + count <= itemStack.maxAmount : true) {
            for (let i = 0; i < 6; i++) {
                const getItem = container.getItem(i);
                if (getItem) {
                    ItemUtil.clearItem(container, i);
                }
            }
            this.setItemCount(container, output, itemStack, count, 6);
        }
    }
    setItemCount(container, output, itemStack, count, slot) {
        if (output) {
            let num = output.amount;
            if ((num += count) <= output.maxAmount) {
                output.amount = num;
                container.setItem(slot, output);
            }
        }
        else {
            itemStack.amount = count;
            container.setItem(slot, itemStack);
        }
    }
    setItem(itemStack, container, index) {
        const output = container.getItem(index);
        if (output) {
            if (output.amount < output.maxAmount) {
                output.amount += 1;
                container.setItem(index, output);
                return true;
            }
        }
        else {
            itemStack.amount = 1;
            container.setItem(index, itemStack);
            return true;
        }
        return false;
    }
    getValidRecipeIndex2(output, container, recipes) {
        for (const index in recipes) {
            if ((container ? this.isEqualValue(container, recipes[index].container) : true) && output.typeId === recipes[index].result.item) {
                return parseInt(index);
            }
        }
        return -1;
    }
}
//# sourceMappingURL=CookingPotRecipe.js.map