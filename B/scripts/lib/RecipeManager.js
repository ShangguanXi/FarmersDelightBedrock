export class SortableRecipeManager {
    constructor() {
        this.recipes = [];
        this.dirty = true;
    }
    addSortableRecipe(recipe) {
        this.dirty = true;
        this.recipes.push(recipe);
    }
    findSortedRecipe(predicate) {
        if (this.dirty) {
            this.recipes.sort((left, right) => (right.priority ?? 0) - (left.priority ?? 0));
            this.dirty = false;
        }
        for (const recipe of this.recipes) {
            if (predicate(recipe))
                return recipe;
        }
        return undefined;
    }
}
