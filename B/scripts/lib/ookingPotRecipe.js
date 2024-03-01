import { RecipeHolder } from "./ecipeHolder";
import { heatConductors, heatSources } from "../data/heatBlocks";
export class CookingPotRecipeHolder extends RecipeHolder {
    constructor(entity, inputSlots, outputSlots, tags, recipeList) {
        super(entity, inputSlots, outputSlots, tags, recipeList);
    }
    update() {
        const block = this.entity.dimension.getBlock(this.entity.location);
        const heated = heatCheck(block);
    }
}
function heatCheck(block) {
    const blockBelow = block.below();
    if (heatSources.includes(blockBelow?.typeId) || blockBelow?.hasTag('farmersdelight:heat_source'))
        return true;
    if (heatConductors.includes(blockBelow?.typeId) || blockBelow?.hasTag('farmersdelight:heat_conductors')) {
        const blockBelow2 = block.below(2);
        if (heatSources.includes(blockBelow2?.typeId) || blockBelow2?.hasTag('farmersdelight:heat_source'))
            return true;
    }
    return false;
}
//# sourceMappingURL=ookingPotRecipe.js.map