import { Container, ItemStack } from "@minecraft/server";
import { RecipeHolder } from "./RecipeHolder";
import { ItemUtil } from "./ItemUtil";

// 合作项目不写注释就跑路, 大黑龙我祝你早死早超生啊

export class CookingPotRecipe extends RecipeHolder {
    public canRecipe: boolean = true;
    public index2: number;
    //判断该配方是否可以进行, 每tick一次
    constructor(container: Container, length: number, recipes: any[], index: number, index2: number) {
        super(container, length, recipes, index);
        //索引2, 用于索引菜品装碗对应容器
        this.index2 = index2;
        //容器槽物品
        const input: ItemStack | undefined = this.container.getItem(7);
        //结果槽物品
        const itemStack: ItemStack | undefined = this.container.getItem(6);
        //输出槽物品
        const output: ItemStack | undefined = this.container.getItem(8);
        if (itemStack) {
            //若结果槽已满则停止
            if (itemStack.amount == itemStack.maxAmount) {
                this.canRecipe = false;
            }
            //若结果槽物品与索引2对应配方不同且容器槽内有物品, 则更新索引2
            if (!this.isEqualValue(itemStack, this.recipes[this.index2].result) && input) {
                this.index2 = this.getValidRecipeIndex2(itemStack, input, this.recipes);
            }
            //若结果槽物品与配方结果不同则停止
            if (this.index == -1 || !this.isEqualValue(itemStack, this.recipes[this.index].result)) {
                this.canRecipe = false;
            }
            //若索引1正常则获取配方合成结果数量, 若输出后结果量大于上限则停止输出
            if (this.index > -1) {
                const count = this.recipes[this.index].result.count ? this.recipes[this.index].result.count : 1;
                if (itemStack.amount == itemStack.maxAmount || (itemStack.amount += count) > itemStack.maxAmount) {
                    this.canRecipe = false;
                }
            }
            //若结果槽有物品输出槽无物品且该物品无需容器则移动该物品至输出槽
            if (!output && !this.recipes[this.index2].container) {
                ItemUtil.clearItem(this.container, 6);
                this.setItem(itemStack, this.container, 8);
            }
        }
    }
    //配方完成时触发
    public consume(): void {
        // 结果槽物品
        const output: ItemStack | undefined = this.container.getItem(6);
        // 配方
        const recipe: any = this.recipes[this.index];
        // 配方结果物品
        const itemStack: ItemStack = new ItemStack(recipe.result.item);
        if (this.container.emptySlotsCount < this.container.size) {
            this.clear(recipe, itemStack, this.container);
            if (!recipe.container && !output && this.setItem(itemStack, this.container, 8)) {
                ItemUtil.clearItem(this.container, 6);
            }
        }
    }
    //菜品装碗时触发
    public output(): void {
        const recipe = this.recipes[this.index2];
        const itemStack = new ItemStack(recipe.result.item);
        const container: ItemStack | undefined = this.container.getItem(6);
        const input = this.container.getItem(7);
        //若菜品不需要容器
        if (!recipe.container) {
            if (container && this.setItem(itemStack, this.container, 8)) {
                ItemUtil.clearItem(this.container, 6);
            }
        //若容器栏容器正确
        } else if (this.isEqualValue(input, recipe.container) && container?.typeId == itemStack.typeId) {
            if (this.setItem(itemStack, this.container, 8)) {
                ItemUtil.clearItem(this.container, 6);
                ItemUtil.clearItem(this.container, 7);
            }
        }
    }
    //完成配方时, 用于根据配方调整容器物品
    private clear(recipe: any, itemStack: ItemStack, container: Container) {
        const output: ItemStack | undefined = container.getItem(6);
        const count: number = recipe.result.count ? recipe.result.count : 1;
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
    //名为setItem实际上执行的是addItem的功能, 不得不说你这命名有一股文盲的美
    private setItem(itemStack: ItemStack, container: Container, index: number) {
        const output = container.getItem(index);
        if (output) {
            if (output.typeId != itemStack.typeId) return false
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

