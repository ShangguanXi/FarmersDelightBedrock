export class RecipeHolder {
    constructor(container, length, recipes, index) {
        this.container = container;
        this.itemStackData = [];
        this.recipes = recipes;
        this.index = index;
        for (let slot = 0; slot < length; slot++) {
            const itemStack = this.container.getItem(slot);
            if (itemStack) {
                this.itemStackData.push(itemStack);
            }
        }
        if (!this.itemStackData.length)
            this.index = -1;
        if (!this.compare(this.itemStackData, recipes[index].ingredients)) {
            this.index = this.getValidRecipeIndex(this.itemStackData, this.recipes);
        }
    }
    compare(A, B) {
        if (!A.length)
            return false;
        let flag = false;
        flag = A.every((a) => {
            return B.some((b) => {
                if (Array.isArray(b)) {
                    return b.some((c) => this.isEqual(a, c));
                }
                else {
                    return this.isEqual(a, b);
                }
            });
        });
        return flag;
    }
    getValidRecipeIndex(info, recipes) {
        for (const index in recipes) {
            if (this.compare(info, recipes[index].ingredients)) {
                return parseInt(index);
            }
        }
        return -1;
    }
    isArray(value) {
        const type = Object.prototype.toString.call(value);
        return type === "[object Array]";
    }
    isEqualValue(have, need) {
        if (!need)
            return false;
        const value = Object.keys(need)[0];
        switch (value) {
            case 'item':
                return have.typeId == need.item;
            case 'tag':
                return have.hasTag(need.tag);
        }
    }
    isEqual(obj1, obj2) {
        if (obj1 === obj2)
            return true;
        if (typeof (obj1) !== "object" || typeof (obj2) !== "object" || !obj1 || !obj2)
            return false;
        if (this.isEqualValue(obj1, obj2))
            return true;
    }
}
//# sourceMappingURL=RecipeHolder.js.map