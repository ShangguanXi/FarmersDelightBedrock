import { ItemStack } from "@minecraft/server";
import { claerItem } from "./itemUtil";

function getValidRecipePreviewIndex(info, recipes) {
    for (const index in recipes) {
        if (info.length == recipes[index].ingredients.length && compare(info, recipes[index].ingredients)) {
            return index;
        }
    }
    return -1;
}

function getValidRecipeoutputIndex(output, container, recipes) {
    for (const index in recipes) {
        if ((container ? isEqualValue(container, recipes[index].container) : true) && output.typeId === recipes[index].result.item) {
            return index;
        }
    }
    return -1;
}

function isEqualValue(have, need) {
    if (!need) return false;
    const value = Object.keys(need)[0];
    switch (value) {
        case 'item':
            if (have.typeId == need.item) {
                return true;
            }
            return false;
        case 'tag':
            if (have.hasTag(need.tag)) {
                return true;
            }
            return false;
    }
}

function isEqual(obj1, obj2) {
    if (obj1 === obj2) return true;
    if (typeof (obj1) !== "object" || typeof (obj2) !== "object" || !obj1 || !obj2) return false;
    if (isEqualValue(obj1, obj2)) return true;
}

function isArray(value) {
    const type = Object.prototype.toString.call(value);
    return type === "[object Array]";
}

function compare(A, B) {
    let flag = true;
    for (let i = 0; i < A.length; i++) {
        const a = A[i];
        let temp = false;
        for (let j = 0; j < B.length; j++) {
            const b = B[j];
            if (isArray(b)) {
                for (let k = 0; k < b.length; k++) {
                    const c = b[k];
                    if (isEqual(a, c)) {
                        temp = true;
                        break;
                    }
                }
            } else {
                if (isEqual(a, b)) {
                    temp = true;
                    break;
                }
            }
        }
        if (!temp) {
            flag = false;
            break;
        }
    }
    return flag;
}

function clear(recipe, itemStack, container) {
    const output = container.getItem(6);
    const count = recipe.result.count ? recipe.result.count : 1;
    if (output ? output.amount + count <= itemStack.maxAmount : true) {
        for (let i = 0; i < 6; i++) {
            const getItem = container.getItem(i)
            if (getItem) {
                claerItem(container, i);
            }
        }
        setItem(itemStack, container, 6);
    }
}

function setItem(itemStack, container, index) {
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

export class RecipeHolder {
    canPreviewRecipe;
    previewIndex;
    outputIndex;
    container;
    recipes;
    itemStack;
    arr = [];
    constructor(container, recipes, previewIndex, outputIndex) {
        this.previewIndex = previewIndex;
        this.outputIndex = outputIndex;
        this.container = container;
        this.recipes = recipes;
        const output = this.container.getItem(6);
        const input = this.container.getItem(7);
        for (let i = 0; i < 6; i++) {
            const itemStack = container.getItem(i);
            if (itemStack) {
                this.arr.push(itemStack);
            }
        }
        const previewRecipe = this.recipes[this.previewIndex];
        const outputRecipe = this.recipes[this.outputIndex];
        if (!compare(this.arr, previewRecipe.ingredients)) {
            this.previewIndex = getValidRecipePreviewIndex(this.arr, this.recipes);
        }
        if (!this.arr.length) {
            this.previewIndex = -1;
        }
        if (output) {
            const count = previewRecipe.result.count ? previewRecipe.result.count : 1;
            if (!isEqualValue(output, outputRecipe.result)) {
                const container = outputRecipe.container ? input : undefined;
                this.outputIndex = getValidRecipeoutputIndex(output, input, this.recipes);
            }
            if (output.amount == output.maxAmount || (output.amount += count) > output.maxAmount) {
                this.canPreviewRecipe = false;
            } else {
                this.canPreviewRecipe = true;
            }
        } else {
            this.canPreviewRecipe = true;
        }
    }
    consume() {
        const output = this.container.getItem(6);
        const recipe = this.recipes[this.previewIndex];
        const itemStack = new ItemStack(recipe.result.item);
        const ingredients = recipe.ingredients;
        if (this.container.emptySlotsCount < this.container.size) {
            if (this.arr.length == ingredients.length) {
                if (compare(this.arr, ingredients)) {
                    clear(recipe, itemStack, this.container, this.arr);
                    if (!recipe.container && !output && setItem(itemStack, this.container, 8)) {
                        claerItem(this.container, 6);
                    }
                }
            }
        }
    }
    output() {
        const recipe = this.recipes[this.outputIndex];
        const itemStack = new ItemStack(recipe.result.item);
        const container = this.container.getItem(6);
        const input = this.container.getItem(7);
        if (!recipe.container) {
            if (container && setItem(itemStack, this.container, 8)) {
                claerItem(this.container, 6);
            }
        } else if (isEqual(input, recipe.container) && container.typeId == itemStack.typeId) {
            if (setItem(itemStack, this.container, 8)) {
                claerItem(this.container, 6);
                claerItem(this.container, 7);
            }
        }
    }
}