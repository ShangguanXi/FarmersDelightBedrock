const ItemofBlockList = [];
const ItemofKnifeList = [];
const BlockofAxeList = [];
const BlockofPickaxeList = [];
const BlockofKnifeList = [];
const BlockofShovelList = [];
const ItemofShearsList = [];
function createBatchRecipes(entries, tool, sound, isBlockType = false, count = 1) {
    return entries.map(([input, output]) => ({
        ingredients: { item: input },
        result: [{ item: output, count }],
        tool,
        is_block_type: isBlockType,
        sound,
    }));
}
function createStrippingRecipes(entries, tool, sound) {
    return entries.map(([input, output]) => ({
        ingredients: { item: input },
        result: [
            { item: "farmersdelight:tree_bark", count: 1 },
            { item: output, count: 1 },
        ],
        tool,
        is_block_type: true,
        sound,
    }));
}
const DOOR_WOOD_TYPES = [
    "oak", "spruce", "birch", "jungle", "acacia",
    "dark_oak", "mangrove", "cherry", "crimson", "warped", "bamboo", "pale_oak"
];
const doorToPlankRecipes = createBatchRecipes(DOOR_WOOD_TYPES.map(wood => [
    wood === "oak" ? "minecraft:wooden_door" : `minecraft:${wood}_door`,
    `minecraft:${wood}_planks`
]), { tag: "minecraft:is_axe" }, "use.wood");
const signToPlankRecipes = createBatchRecipes(DOOR_WOOD_TYPES.map(wood => [
    `minecraft:${wood}_sign`,
    `minecraft:${wood}_planks`
]), { tag: "minecraft:is_axe" }, "use.wood");
const LOG_WOOD_TYPES = [
    "oak", "spruce", "birch", "jungle", "acacia",
    "dark_oak", "mangrove", "cherry", "pale_oak"
];
const logToStrippedRecipes = createStrippingRecipes(LOG_WOOD_TYPES.map(wood => [
    `minecraft:${wood}_log`,
    `minecraft:stripped_${wood}_log`
]), { tag: "minecraft:is_axe" }, "use.wood");
const stemToStrippedRecipes = createStrippingRecipes([
    ["minecraft:crimson_stem", "minecraft:stripped_crimson_stem"],
    ["minecraft:warped_stem", "minecraft:stripped_warped_stem"],
    ["minecraft:bamboo_block", "minecraft:stripped_bamboo_block"],
    ["minecraft:crimson_hyphae", "minecraft:stripped_crimson_hyphae"],
    ["minecraft:warped_hyphae", "minecraft:stripped_warped_hyphae"],
], { tag: "minecraft:is_axe" }, "use.wood");
const woodToStrippedRecipes = createStrippingRecipes(LOG_WOOD_TYPES.map(wood => [
    `minecraft:${wood}_wood`,
    `minecraft:stripped_${wood}_wood`
]), { tag: "minecraft:is_axe" }, "use.wood");
const trapdoorToPlankRecipes = createBatchRecipes(DOOR_WOOD_TYPES.map(wood => [
    wood === "oak" ? "minecraft:trapdoor" : `minecraft:${wood}_trapdoor`,
    `minecraft:${wood}_planks`
]), { tag: "minecraft:is_axe" }, "use.wood", true);
const flowerToDyeRecipes = [
    { ingredients: { item: "minecraft:allium" }, result: [{ item: "minecraft:magenta_dye", count: 2 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "minecraft:azure_bluet" }, result: [{ item: "minecraft:light_gray_dye", count: 2 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "minecraft:blue_orchid" }, result: [{ item: "minecraft:light_blue_dye", count: 2 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "minecraft:cornflower" }, result: [{ item: "minecraft:blue_dye", count: 2 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "minecraft:dandelion" }, result: [{ item: "minecraft:yellow_dye", count: 2 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "minecraft:ink_sac" }, result: [{ item: "minecraft:black_dye", count: 2 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "minecraft:lily_of_the_valley" }, result: [{ item: "minecraft:white_dye", count: 2 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "minecraft:orange_tulip" }, result: [{ item: "minecraft:orange_dye", count: 2 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "minecraft:oxeye_daisy" }, result: [{ item: "minecraft:light_gray_dye", count: 2 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "minecraft:pink_tulip" }, result: [{ item: "minecraft:pink_dye", count: 2 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "minecraft:poppy" }, result: [{ item: "minecraft:red_dye", count: 2 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "minecraft:red_tulip" }, result: [{ item: "minecraft:red_dye", count: 2 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "minecraft:white_tulip" }, result: [{ item: "minecraft:light_gray_dye", count: 2 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "minecraft:wither_rose" }, result: [{ item: "minecraft:black_dye", count: 2 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "minecraft:torchflower" }, result: [{ item: "minecraft:orange_dye", count: 2 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
];
const meatSlicingRecipes = [
    { ingredients: { item: "minecraft:cake" }, result: [{ item: "farmersdelight:cake_slice", count: 7 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "minecraft:cooked_cod" }, result: [{ item: "farmersdelight:cooked_cod_slice", count: 2 }, { item: "minecraft:bone_meal", count: 1 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "minecraft:cod" }, result: [{ item: "farmersdelight:cod_slice", count: 2 }, { item: "minecraft:bone_meal", count: 1 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "minecraft:cooked_salmon" }, result: [{ item: "farmersdelight:cooked_salmon_slice", count: 2 }, { item: "minecraft:bone_meal", count: 1 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "minecraft:salmon" }, result: [{ item: "farmersdelight:salmon_slice", count: 2 }, { item: "minecraft:bone_meal", count: 1 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "minecraft:porkchop" }, result: [{ item: "farmersdelight:bacon", count: 2 }, { item: "minecraft:bone_meal", count: 1 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "minecraft:beef" }, result: [{ item: "farmersdelight:minced_beef", count: 2 }, { item: "minecraft:bone_meal", count: 1 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "minecraft:chicken" }, result: [{ item: "farmersdelight:chicken_cuts", count: 2 }, { item: "minecraft:bone_meal", count: 1 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "minecraft:mutton" }, result: [{ item: "farmersdelight:mutton_chops", count: 2 }, { item: "minecraft:bone_meal", count: 1 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "minecraft:cooked_mutton" }, result: [{ item: "farmersdelight:cooked_mutton_chops", count: 2 }, { item: "minecraft:bone_meal", count: 1 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "minecraft:cooked_chicken" }, result: [{ item: "farmersdelight:cooked_chicken_cuts", count: 2 }, { item: "minecraft:bone_meal", count: 1 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "farmersdelight:ham" }, result: [{ item: "farmersdelight:porkchop", count: 2 }, { item: "minecraft:bone_meal", count: 1 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
];
const wildCropRecipes = [
    { ingredients: { item: "farmersdelight:wild_cabbages" }, result: [{ item: "farmersdelight:cabbage_seeds", count: 1 }, { item: "minecraft:yellow_dye", count: 2, chance: 0.5 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "farmersdelight:wild_tomatoes" }, result: [{ item: "farmersdelight:tomato_seeds", count: 1 }, { item: "farmersdelight:tomato", count: 1, chance: 0.2 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "farmersdelight:wild_onions" }, result: [{ item: "farmersdelight:onion", count: 1 }, { item: "minecraft:magenta_dye", count: 2 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "farmersdelight:wild_carrots" }, result: [{ item: "minecraft:carrots", count: 1 }, { item: "minecraft:light_gray_dye", count: 2 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "farmersdelight:wild_potatoes" }, result: [{ item: "minecraft:potatoes", count: 1 }, { item: "minecraft:purple_dye", count: 2, chance: 0.5 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "farmersdelight:wild_beetroots" }, result: [{ item: "minecraft:beetroot_seeds", count: 1 }, { item: "minecraft:red_dye", count: 1 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "farmersdelight:wild_rice" }, result: [{ item: "farmersdelight:rice", count: 1 }, { item: "farmersdelight:straw", count: 1, chance: 0.5 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "farmersdelight:brown_mushroom_colony" }, result: [{ item: "minecraft:brown_mushroom", count: 5 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "farmersdelight:red_mushroom_colony" }, result: [{ item: "minecraft:red_mushroom", count: 5 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
];
const bobKnifeRecipes = [
    { ingredients: { item: "better_on_bedrock:dough" }, result: [{ item: "farmersdelight:raw_pasta", count: 1 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "better_on_bedrock:berry_pie" }, result: [{ item: "better_on_bedrock:berry_pie_slice", count: 5 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "better_on_bedrock:grape_pie" }, result: [{ item: "better_on_bedrock:grape_pie_slice", count: 5 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
];
const pickaxeBlockRecipes = [
    { ingredients: { item: "minecraft:amethyst_block" }, result: [{ item: "minecraft:amethyst_shard", count: 4 }], tool: { tag: "minecraft:is_pickaxe" }, is_block_type: true, sound: "use.wood" },
    { ingredients: { item: "minecraft:bricks" }, result: [{ item: "minecraft:brick", count: 4 }], tool: { tag: "minecraft:is_pickaxe" }, is_block_type: true, sound: "use.wood" },
    { ingredients: { item: "minecraft:deepslate" }, result: [{ item: "minecraft:cobbled_deepslate", count: 1 }], tool: { tag: "minecraft:is_pickaxe" }, is_block_type: true, sound: "use.wood" },
    { ingredients: { item: "minecraft:quartz_block" }, result: [{ item: "minecraft:quartz", count: 4 }], tool: { tag: "minecraft:is_pickaxe" }, is_block_type: true, sound: "use.wood" },
    { ingredients: { item: "minecraft:stone" }, result: [{ item: "minecraft:cobblestone", count: 1 }], tool: { tag: "minecraft:is_pickaxe" }, is_block_type: true, sound: "use.wood" },
    { ingredients: { item: "minecraft:nether_brick" }, result: [{ item: "minecraft:netherbrick", count: 4 }], tool: { tag: "minecraft:is_pickaxe" }, is_block_type: true, sound: "use.wood" },
    { ingredients: { item: "better_on_bedrock:cracked_dripstone_bricks" }, result: [{ item: "minecraft:dripstone_block", count: 1 }], tool: { tag: "minecraft:is_pickaxe" }, is_block_type: true, sound: "use.wood" },
    { ingredients: { item: "better_on_bedrock:dripstone_brick_wall" }, result: [{ item: "minecraft:dripstone_block", count: 1 }], tool: { tag: "minecraft:is_pickaxe" }, is_block_type: true, sound: "use.wood" },
    { ingredients: { item: "better_on_bedrock:dripstone_bricks" }, result: [{ item: "minecraft:dripstone_block", count: 1 }], tool: { tag: "minecraft:is_pickaxe" }, is_block_type: true, sound: "use.wood" },
    { ingredients: { item: "better_on_bedrock:polished_dripstone" }, result: [{ item: "minecraft:dripstone_block", count: 1 }], tool: { tag: "minecraft:is_pickaxe" }, is_block_type: true, sound: "use.wood" },
    { ingredients: { item: "better_on_bedrock:polished_dripstone_wall" }, result: [{ item: "minecraft:dripstone_block", count: 1 }], tool: { tag: "minecraft:is_pickaxe" }, is_block_type: true, sound: "use.wood" },
];
const knifeBlockRecipes = [
    { ingredients: { item: "minecraft:pumpkin" }, result: [{ item: "farmersdelight:pumpkin_slice", count: 4 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: true, sound: "use.wood" },
    { ingredients: { item: "minecraft:melon_block" }, result: [{ item: "minecraft:melon_slice", count: 9 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: true, sound: "use.wood" },
];
const shovelBlockRecipes = [
    { ingredients: { item: "minecraft:clay" }, result: [{ item: "minecraft:clay_ball", count: 4 }], tool: { tag: "minecraft:is_shovel" }, is_block_type: true, sound: "use.gravel" },
    { ingredients: { item: "minecraft:gravel" }, result: [{ item: "minecraft:gravel", count: 1 }, { item: "minecraft:flint", count: 1, chance: 0.1 }], tool: { tag: "minecraft:is_shovel" }, is_block_type: true, sound: "use.gravel" },
];
const shearsRecipes = [
    { ingredients: { item: "minecraft:saddle" }, result: [{ item: "minecraft:leather", count: 2 }, { item: "minecraft:iron_nugget", count: 2, chance: 0.5 }], tool: { tag: "minecraft:is_shears" }, is_block_type: false, sound: "use.wood" },
];
export const CuttingBoardRecipes = [
    ...meatSlicingRecipes,
    ...flowerToDyeRecipes,
    ...wildCropRecipes,
    ...bobKnifeRecipes,
    ...shearsRecipes,
    ...doorToPlankRecipes,
    ...signToPlankRecipes,
    { ingredients: { item: "better_on_bedrock:chorus_door" }, result: [{ item: "better_on_bedrock:chorus_planks", count: 1 }], tool: { tag: "minecraft:is_axe" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "better_on_bedrock:voiding_door" }, result: [{ item: "better_on_bedrock:voiding_planks", count: 1 }], tool: { tag: "minecraft:is_axe" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "better_on_bedrock:vacant_door" }, result: [{ item: "better_on_bedrock:dusk_planks", count: 1 }], tool: { tag: "minecraft:is_axe" }, is_block_type: false, sound: "use.wood" },
    ...logToStrippedRecipes,
    ...stemToStrippedRecipes,
    ...woodToStrippedRecipes,
    ...trapdoorToPlankRecipes,
    ...pickaxeBlockRecipes,
    ...knifeBlockRecipes,
    ...shovelBlockRecipes,
    { ingredients: { item: "farmersdelight:cabbage" }, result: [{ item: "farmersdelight:cabbage_leaf", count: 2 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "farmersdelight:kelp_roll" }, result: [{ item: "farmersdelight:kelp_roll_slice", count: 3 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "farmersdelight:rice_panicle" }, result: [{ item: "farmersdelight:straw", count: 1 }, { item: "farmersdelight:rice", count: 1 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "farmersdelight:chocolate_pie" }, result: [{ item: "farmersdelight:chocolate_pie_slice", count: 4 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "farmersdelight:apple_pie" }, result: [{ item: "farmersdelight:apple_pie_slice", count: 4 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "farmersdelight:sweet_berry_cheesecake" }, result: [{ item: "farmersdelight:sweet_berry_cheesecake_slice", count: 4 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "minecraft:pumpkin_pie" }, result: [{ item: "farmersdelight:pumpkin_pie_slice", count: 4 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "farmersdelight:wheat_dough" }, result: [{ item: "farmersdelight:raw_pasta", count: 1 }], tool: { tag: "farmersdelight:is_knife" }, is_block_type: false, sound: "use.wood" },
    { ingredients: { item: "better_on_bedrock:chorus_log" }, result: [{ item: "farmersdelight:tree_bark", count: 1 }, { item: "better_on_bedrock:chorus_log_stripped", count: 1 }], tool: { tag: "minecraft:is_axe" }, is_block_type: true, sound: "use.wood" },
    { ingredients: { item: "better_on_bedrock:voiding_log" }, result: [{ item: "farmersdelight:tree_bark", count: 1 }, { item: "better_on_bedrock:shrublog_stripped", count: 1 }], tool: { tag: "minecraft:is_axe" }, is_block_type: true, sound: "use.wood" },
    { ingredients: { item: "better_on_bedrock:shrublog" }, result: [{ item: "farmersdelight:tree_bark", count: 1 }, { item: "better_on_bedrock:shrublog_stripped", count: 1 }], tool: { tag: "minecraft:is_axe" }, is_block_type: true, sound: "use.wood" },
    { ingredients: { item: "better_on_bedrock:chorus_wood" }, result: [{ item: "farmersdelight:tree_bark", count: 1 }, { item: "better_on_bedrock:chorus_wood_stripped", count: 1 }], tool: { tag: "minecraft:is_axe" }, is_block_type: true, sound: "use.wood" },
    { ingredients: { item: "better_on_bedrock:voiding_wood" }, result: [{ item: "farmersdelight:tree_bark", count: 1 }, { item: "better_on_bedrock:voiding_wood_stripped", count: 1 }], tool: { tag: "minecraft:is_axe" }, is_block_type: true, sound: "use.wood" },
    { ingredients: { item: "better_on_bedrock:vacant_wood" }, result: [{ item: "farmersdelight:tree_bark", count: 1 }, { item: "better_on_bedrock:voiding_log_stripped", count: 1 }], tool: { tag: "minecraft:is_axe" }, is_block_type: true, sound: "use.wood" },
    { ingredients: { item: "better_on_bedrock:chorus_trapdoor" }, result: [{ item: "better_on_bedrock:chorus_planks", count: 1 }], tool: { tag: "minecraft:is_axe" }, is_block_type: true, sound: "use.wood" },
    { ingredients: { item: "better_on_bedrock:voiding_trapdoor" }, result: [{ item: "better_on_bedrock:voiding_planks", count: 1 }], tool: { tag: "minecraft:is_axe" }, is_block_type: true, sound: "use.wood" },
    { ingredients: { item: "better_on_bedrock:vacant_trapdoor" }, result: [{ item: "better_on_bedrock:dusk_planks", count: 1 }], tool: { tag: "minecraft:is_axe" }, is_block_type: true, sound: "use.wood" },
];
export class CuttingBoardRecipeManager {
    constructor(recipes = CuttingBoardRecipes) {
        this.recipes = recipes;
    }
    matchIngredients(item, ingredients) {
        const ingredientList = Array.isArray(ingredients) ? ingredients : [ingredients];
        for (const ingredient of ingredientList) {
            if (ingredient.item && ingredient.item == item.typeId)
                return true;
            if (ingredient.tag && item.hasTag(ingredient.tag))
                return true;
        }
        return false;
    }
    matchTool(toolItem, tool) {
        if (tool.item) {
            return tool.item == toolItem.typeId;
        }
        if (tool.tag) {
            return toolItem.hasTag(tool.tag);
        }
        return false;
    }
    recognizeRecipe(item, tool) {
        for (const recipe of this.recipes) {
            if (this.matchIngredients(item, recipe.ingredients)) {
                if (this.matchTool(tool, recipe.tool)) {
                    return recipe;
                }
                else {
                    console.warn(`物品 "${item.typeId}" 满足配方的 ingredients，但工具 "${tool.typeId}" 不满足配方要求的 tool`);
                }
            }
        }
        console.warn(`物品 "${item.typeId}" 不满足任何配方的 ingredients`);
    }
    getMatchingRecipes(item) {
        return this.recipes.filter(recipe => this.matchIngredients(item, recipe.ingredients));
    }
    getAllRecipes() {
        return this.recipes;
    }
    addRecipe(recipe) {
        this.recipes.push(recipe);
    }
}
export const cuttingBoardRecipeManager = new CuttingBoardRecipeManager();
export { ItemofKnifeList, BlockofAxeList, BlockofKnifeList, ItemofBlockList, BlockofPickaxeList, BlockofShovelList, ItemofShearsList };
