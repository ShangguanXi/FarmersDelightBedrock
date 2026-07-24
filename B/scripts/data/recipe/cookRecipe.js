import { SortableRecipeManager } from "../../lib/RecipeManager";
const vanillaItemList = [
    "minecraft:beef",
    "minecraft:chicken",
    "minecraft:cod",
    "minecraft:brown_egg",
    "minecraft:blue_egg",
    "minecraft:egg",
    "minecraft:beef",
    "minecraft:mutton",
    "minecraft:porkchop",
    "minecraft:potato",
    "minecraft:rabbit",
    "minecraft:salmon",
    "better_on_bedrock:beef_patty_raw",
    "better_on_bedrock:raw_deer_meat",
    "better_on_bedrock:raw_mutton_chops"
];
export { vanillaItemList };
const RECIPES_BY_TAG = new SortableRecipeManager();
const RECIPES_BY_ID = new Map([
    ["minecraft:beef", { result: "minecraft:cooked_beef", time: 200, exp: 0.35 }],
    ["minecraft:porkchop", { result: "minecraft:cooked_porkchop", time: 200, exp: 0.35 }],
    ["minecraft:chicken", { result: "minecraft:cooked_chicken", time: 200, exp: 0.35 }],
    ["minecraft:cod", { result: "minecraft:cooked_cod", time: 200, exp: 0.35 }],
    ["minecraft:mutton", { result: "minecraft:cooked_mutton", time: 200, exp: 0.35 }],
    ["minecraft:potato", { result: "minecraft:baked_potato", time: 200, exp: 0.35 }],
    ["minecraft:rabbit", { result: "minecraft:cooked_rabbit", time: 200, exp: 0.35 }],
    ["minecraft:salmon", { result: "minecraft:cooked_salmon", time: 200, exp: 0.35 }],
    ["farmersdelight:bacon", { result: "farmersdelight:cooked_bacon", time: 200, exp: 0.35 }],
    ["farmersdelight:chicken_cuts", { result: "farmersdelight:cooked_chicken_cuts", time: 200, exp: 0.35 }],
    ["farmersdelight:cod_slice", { result: "farmersdelight:cooked_cod_slice", time: 200, exp: 0.35 }],
    ["farmersdelight:minced_beef", { result: "farmersdelight:beef_patty", time: 200, exp: 0.35 }],
    ["farmersdelight:mutton_chops", { result: "farmersdelight:cooked_mutton_chops", time: 200, exp: 0.35 }],
    ["farmersdelight:salmon_slice", { result: "farmersdelight:cooked_salmon_slice", time: 200, exp: 0.35 }],
    ["#minecraft:egg", { result: "farmersdelight:fried_egg", time: 200, exp: 0.35 }],
]);
for (const [tagOrId, recipe] of [...RECIPES_BY_ID]) {
    if (tagOrId[0] === "#") {
        recipe.ingredientTag = tagOrId.substring(1);
        RECIPES_BY_TAG.addSortableRecipe(recipe);
        RECIPES_BY_ID.delete(tagOrId);
    }
}
export function registerCookable(tagOrId, recipe) {
    if (tagOrId[0] === "#") {
        recipe.ingredientTag = tagOrId.substring(1);
        RECIPES_BY_TAG.addSortableRecipe(recipe);
    }
    else {
        RECIPES_BY_ID.set(tagOrId, recipe);
    }
}
export function isCookable(stack) {
    return RECIPES_BY_ID.has(stack.typeId)
        || RECIPES_BY_TAG.findSortedRecipe(recipe => stack.hasTag(recipe.ingredientTag));
}
export function findCookingRecipe(stack) {
    return RECIPES_BY_ID.get(stack.typeId)
        ?? RECIPES_BY_TAG.findSortedRecipe(recipe => stack.hasTag(recipe.ingredientTag));
}
