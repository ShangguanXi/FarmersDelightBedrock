import { ItemStack } from "@minecraft/server";
import { SortableRecipe, SortableRecipeManager } from "../../lib/RecipeManager";

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
    //better_on_bedrock
    "better_on_bedrock:beef_patty_raw",
    "better_on_bedrock:raw_deer_meat",
    "better_on_bedrock:raw_mutton_chops"

];

export { vanillaItemList };

export interface CookingRecipe {
    /** 产物赋命名空间标识符 */
    result: string;
    /** 产物数量 */
    count?: number;
    /** 烧炼时间（刻） */
    time: number;
    /** 经验值（暂未使用） */
    exp?: number;
}

export interface TaggedCookingRecipe extends CookingRecipe, SortableRecipe {
    /** 原料包含的标签 */
    readonly ingredientTag: string;
}

const RECIPES_BY_TAG: SortableRecipeManager<TaggedCookingRecipe> = new SortableRecipeManager();
const RECIPES_BY_ID: Map<string, CookingRecipe> = new Map([
    ["minecraft:beef", { result: "minecraft:cooked_beef", time: 200, exp: 0.35 }],
    ["minecraft:porkchop", { result: "minecraft:cooked_porkchop", time: 200, exp: 0.35 }],
    ["minecraft:chicken", { result: "minecraft:cooked_chicken", time: 200, exp: 0.35 }],

    ["#minecraft:egg", { result: "farmersdelight:fried_egg", time: 200, exp: 0.35 }],
]);

export function registerCookable(tagOrId: string, recipe: CookingRecipe) {
    if (tagOrId[0] === "#") {
        (recipe as any).ingredientTag = tagOrId.substring(1);
        RECIPES_BY_TAG.addSortableRecipe(recipe as TaggedCookingRecipe)
    } else {
        RECIPES_BY_ID.set(tagOrId, recipe);
    }
}

export function isCookable(stack: ItemStack): boolean {
    return RECIPES_BY_ID.has(stack.typeId)
        || RECIPES_BY_TAG.findSortedRecipe(recipe => stack.hasTag(recipe.ingredientTag)) as unknown as boolean;
}

export function findCookingRecipe(stack: ItemStack): CookingRecipe | undefined {
    return  RECIPES_BY_ID.get(stack.typeId)
        ?? RECIPES_BY_TAG.findSortedRecipe(recipe => stack.hasTag(recipe.ingredientTag));
}


