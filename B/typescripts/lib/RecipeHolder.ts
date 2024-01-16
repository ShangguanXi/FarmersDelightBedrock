import { Container, ItemStack } from "@minecraft/server";

export class RecipeHolder {
    public readonly container: Container;
    public readonly itemStackData: Array<ItemStack>;
    public readonly recipes: any[];
    public index: number;
    constructor(container: Container, length: number, recipes: any[], index: number) {
        this.container = container;
        this.itemStackData = [];
        this.recipes = recipes;
        this.index = index;
        for (let slot = 0; slot < length; slot++) {
            const itemStack: ItemStack | undefined = this.container.getItem(slot);
            if (itemStack) {
                this.itemStackData.push(itemStack);
            }
        }
        if (!this.itemStackData.length) this.index = -1;
        if (!this.compare(this.itemStackData, recipes[index].ingredients)) {
            this.index = this.getValidRecipeIndex(this.itemStackData, this.recipes);
        }
    }
    compare(A: any[], B: any[]): boolean {
        if (!A.length) return false;
        let flag: boolean = false;
        flag = A.every((a: any) => {
            return B.some((b: any) => {
                if (Array.isArray(b)) {
                    return b.some((c: any) => this.isEqual(a, c));
                } else {
                    return this.isEqual(a, b);
                }
            })
        })
        return flag;
    }
    getValidRecipeIndex(info: any[], recipes: any) {
        for (const index in recipes) {
            if (this.compare(info, recipes[index].ingredients)) {
                return parseInt(index);
            }
        }
        return -1;
    }
    isArray(value: any) {
        const type = Object.prototype.toString.call(value);
        return type === "[object Array]";
    }

    isEqualValue(have: ItemStack, need: any) {
        if (!need) return false;
        const value = Object.keys(need)[0];
        switch (value) {
            case 'item':
                return have.typeId == need.item;
            case 'tag':
                return have.hasTag(need.tag)
        }
    }

    isEqual(obj1: any, obj2: any) {
        if (obj1 === obj2) return true;
        if (typeof (obj1) !== "object" || typeof (obj2) !== "object" || !obj1 || !obj2) return false;
        if (this.isEqualValue(obj1, obj2)) return true;
    }
}