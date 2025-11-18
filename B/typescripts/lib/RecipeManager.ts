export type SortableRecipe = {
    priority?: number;
}

export class SortableRecipeManager<T extends SortableRecipe> {
    private recipes: T[] = [];
    private dirty: boolean = true;
    addSortableRecipe(recipe: T): void {
        this.dirty = true;
        this.recipes.push(recipe);
    }
    findSortedRecipe(predicate: (recipe:  T) => boolean): T | undefined {
        if (this.dirty) {
            this.recipes.sort(
                (left, right) =>  (right.priority ?? 0) - (left.priority ?? 0)
            );
            this.dirty = false;
        }
        for (const recipe of this.recipes) {
            if (predicate(recipe)) return recipe;
        }
        return undefined;
    }
}