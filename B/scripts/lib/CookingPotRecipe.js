import { ItemStack, world } from "@minecraft/server";
import { RecipeHolder } from "./RecipeHolder";
import { takeItem } from "./ItemUtil";
export class CookingPotRecipe extends RecipeHolder {
    constructor(entity, inputSlots, outputSlots, tags, recipeList) {
        super(entity, inputSlots, outputSlots, tags, recipeList);
        this.currentRecipe2 = false;
    }
    update() {
        try {
            const playerNumber = world.getAllPlayers().length;
            if (playerNumber == 0)
                return;
            const heated = this.entity.getDynamicProperty('cookingPot:heated');
            if (!this.container)
                return;
            const container = this.container?.getItem(7);
            const result = this.container?.getItem(6);
            if (result) {
                this.currentRecipe2 = this.getValidRecipe2(result, container);
                if (this.currentRecipe2) {
                    const itemStack = new ItemStack(this.currentRecipe2.result.item, this.currentRecipe2.result.count || 1);
                    if (!this.currentRecipe2.container) {
                        if (result && this.setItem(itemStack, 8)) {
                            takeItem(this.container, 6, 1);
                            this.currentRecipe2 = false;
                        }
                    }
                    else if (container && this.isIngredient(container, this.currentRecipe2.container)) {
                        if (this.setItem(itemStack, 8)) {
                            takeItem(this.container, 6, 1);
                            takeItem(this.container, 7, 1);
                            this.currentRecipe2 = false;
                        }
                    }
                }
            }
            if (heated) {
                const inputs = this.getInputs();
                const recipe = this.getRecipe(inputs);
                if (recipe) {
                    if (!this.currentRecipe || recipe.identifer != this.currentRecipe.identifer) {
                        this.currentTick = 0;
                        this.currentRecipe = recipe;
                    }
                    const amount = recipe.result.amount ?? 1;
                    if (result && (result.amount == result.maxAmount ||
                        !this.isIngredient(result, recipe.result) ||
                        result.amount + amount > result.maxAmount)) {
                        return;
                    }
                    this.currentTick += 1;
                    if (this.currentTick == recipe.time) {
                        this.consume(recipe);
                        this.currentRecipe = false;
                        this.currentTick = -1;
                    }
                }
                else {
                    this.currentRecipe = false;
                    this.currentTick = -1;
                }
            }
            else {
                this.currentRecipe = false;
                this.currentTick = -1;
            }
        }
        catch (error) {
            world.getDimension("overworld").runCommand('reload');
        }
    }
    setItem(itemStack, index) {
        let output = this.container.getItem(index);
        if (output) {
            if (output.typeId != itemStack.typeId)
                return false;
            if (output.amount <= (output.maxAmount - (this.currentRecipe2.result.count || 1))) {
                output.amount = output.amount + (this.currentRecipe2.result.count || 1);
                this.container.setItem(index, output);
                return true;
            }
        }
        else {
            itemStack.amount = this.currentRecipe2.result.count || 1;
            this.container.setItem(index, itemStack);
            return true;
        }
        console.warn(output.amount);
        return false;
    }
    getValidRecipe2(output, container) {
        const recipes = this.getRecipes();
        for (const index in recipes) {
            if (((container && recipes[index].container) ? this.isIngredient(container, recipes[index].container) : true) && output.typeId === recipes[index].result.item) {
                return recipes[index];
            }
        }
        return false;
    }
}
