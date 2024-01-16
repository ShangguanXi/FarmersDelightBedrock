import { Container, ItemStack } from "@minecraft/server";
import { RecipeHolder } from "./RecipeHolder";
import { ItemUtil } from "./ItemUtil";



export class CookingPotRecipe extends RecipeHolder {
    public canRecipe: boolean = true;
    public index2: number;
    constructor(container: Container, length: number, recipes: any[], index: number, index2: number) {
        super(container, length, recipes, index);
        this.index2 = index2;
        const input: ItemStack | undefined = this.container.getItem(7);
        const itemStack: ItemStack | undefined = this.container.getItem(6);
        if (itemStack && itemStack.amount == itemStack.maxAmount) {
            this.canRecipe = false;
        }
        if (itemStack) {
            if (input && !this.isEqualValue(itemStack, this.recipes[this.index2].result)) {
                this.index2 = this.getValidRecipeIndex2(itemStack, input, this.recipes);
            }
            if (this.index > -1) {
                const count = this.recipes[this.index].result.count ? this.recipes[this.index].result.count : 1;
                if (itemStack.amount == itemStack.maxAmount || (itemStack.amount += count) > itemStack.maxAmount) {
                    this.canRecipe = false;
                }
            }
        }
    }
    public consume(): void {
        const output: ItemStack | undefined = this.container.getItem(6);
        const recipe: any = this.recipes[this.index];
        const itemStack: ItemStack = new ItemStack(recipe.result.item);
        if (this.container.emptySlotsCount < this.container.size) {
            this.clear(recipe, itemStack, this.container);
            if (!recipe.container && !output && this.setItem(itemStack, this.container, 8)) {
                ItemUtil.claerItem(this.container, 6);
            }
        }
    }
    public output(): void {
        const recipe = this.recipes[this.index2];
        const itemStack = new ItemStack(recipe.result.item);
        const container: ItemStack | undefined = this.container.getItem(6);
        const input = this.container.getItem(7);
        if (!recipe.container) {
            if (container && this.setItem(itemStack, this.container, 8)) {
                ItemUtil.claerItem(this.container, 6);
            }
        } else if (this.isEqual(input, recipe.container) && container?.typeId == itemStack.typeId) {
            if (this.setItem(itemStack, this.container, 8)) {
                ItemUtil.claerItem(this.container, 6);
                ItemUtil.claerItem(this.container, 7);
            }
        }
    }
    private clear(recipe: any, itemStack: ItemStack, container: Container) {
        const output: ItemStack | undefined = container.getItem(6);
        const count: number = recipe.result.count ? recipe.result.count : 1;
        if (output ? output.amount + count <= itemStack.maxAmount : true) {
            for (let i = 0; i < 6; i++) {
                const getItem = container.getItem(i)
                if (getItem) {
                    ItemUtil.claerItem(container, i);
                }
            }
            this.setItemCount(container, output, itemStack, count, 6);
        }
    }

    private setItemCount(container: Container, output: ItemStack | undefined, itemStack: ItemStack, count: number, slot: number) {
        if (output) {
            let num: number = output.amount;
            if ((num += count) <= output.maxAmount) {
                output.amount = num;
                container.setItem(slot, output);
            }
        } else {
            itemStack.amount = count;
            container.setItem(slot, itemStack);
        }
    }
    private setItem(itemStack: ItemStack, container: Container, index: number) {
        const output = container.getItem(index);
        if (output) {
            if (output.amount < output.maxAmount) {
                output.amount += 1;
                container.setItem(index, output);
                return true;
            }
        } else {
            itemStack.amount = 1;
            container.setItem(index, itemStack);
            return true;
        }
        return false;
    }
    private getValidRecipeIndex2(output: ItemStack, container: ItemStack, recipes: any[]): number {
        for (const index in recipes) {
            if ((container ? this.isEqualValue(container, recipes[index].container) : true) && output.typeId === recipes[index].result.item) {
                return parseInt(index);
            }
        }
        return -1;
    }
}

