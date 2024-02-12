import { Container, ItemStack } from "@minecraft/server";

export class RecipeHolder {
    public readonly container: Container;
    public readonly itemStackData: Array<ItemStack> = [];
    public readonly recipes: any[];
    public index: number;
    //配方管理器初始化
    constructor(container: Container, length: number, recipes: any[], index: number) {
        //实体容器
        this.container = container;
        //配方表
        this.recipes = recipes;
        //索引ID
        this.index = index;
        //length为容器格子数
        for (let slot = 0; slot < length; slot++) {
            const itemStack: ItemStack | undefined = this.container.getItem(slot);
            if (itemStack) {
                this.itemStackData.push(itemStack);
            }
        }
        if (!this.itemStackData.length) this.index = -1;
        //若是当前索引指向配方与原料不符, 则重新索引配方
        if (!this.compare(this.itemStackData, recipes[index].ingredients)) {
            this.index = this.getValidRecipeIndex(this.itemStackData, this.recipes);
        }
    }
    public compare(info: any[], ingredients: any[]): boolean {
        const infoCopy = [...info];
        const ingredientsCopy = JSON.parse(JSON.stringify(ingredients));
        // a: Itemstack
        let flag = infoCopy.every((a, i) => {
            let found = false;
            for (let j = 0; j < ingredientsCopy.length; j++) {
                let b = ingredientsCopy[j];
                if (Array.isArray(b)) {
                    let index = b.findIndex(c => this.isEqualValue(a, c));
                    if (index !== -1) {
                        b.splice(index, 1);
                        found = true;
                        break;
                    }
                } else {
                    if (this.isEqualValue(a, b)) {
                        ingredientsCopy.splice(j, 1);
                        found = true;
                        break;
                    }
                }
            }
            if (found) {
                infoCopy.splice(i, 1);
                i--;
            }
            return found;
        });
        return flag;
    }
    //根据原料索引配方
    public getValidRecipeIndex(info: any[], recipes: any) {
        for (const index in recipes) {
            const recipe = recipes[index].ingredients;
            if (info.length == recipe.length && this.compare(info, recipe)) {
                return parseInt(index);
            }
        }
        return -1;
    }
    public isEqualValue(have: ItemStack | undefined, need: any): boolean {
        if (!need || !have) return false;
        switch (Object.keys(need)[0]) {
            case 'item':
                return have.typeId == need.item;
            case 'tag':
                return have.hasTag(need.tag);
        }
        return false;
    }
}