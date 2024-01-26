export class RecipeHolder {
    constructor(container, length, recipes, index) {
        this.itemStackData = [];
        this.container = container;
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
    compare(info, ingredients) {
        const infoCopy = [...info];
        const ingredientsCopy = JSON.parse(JSON.stringify(ingredients));
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
                }
                else {
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
    getValidRecipeIndex(info, recipes) {
        for (const index in recipes) {
            const recipe = recipes[index].ingredients;
            if (info.length == recipe.length && this.compare(info, recipe)) {
                return parseInt(index);
            }
        }
        return -1;
    }
    isEqualValue(have, need) {
        if (!need || !have)
            return false;
        switch (Object.keys(need)[0]) {
            case 'item':
                return have.typeId == need.item;
            case 'tag':
                return have.hasTag(need.tag);
        }
        return false;
    }
}
//# sourceMappingURL=RecipeHolder.js.map