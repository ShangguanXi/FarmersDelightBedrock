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
export const cookRecipeMap = new Map([
    ["minecraft:beef", { result: "minecraft:cooked_beef", time: 200, exp: 0.35 }],
    ["minecraft:porkchop", { result: "minecraft:cooked_porkchop", time: 200, exp: 0.35 }],
    ["minecraft:chicken", { result: "minecraft:cooked_chicken", time: 200, exp: 0.35 }],
    ["#minecraft:egg", { result: "farmersdelight:fried_egg", time: 200, exp: 0.35 }],
]);
export class CookRecipeManager {
    static findRecipeForItem(itemStack) {
        const id = itemStack.typeId;
        const directRecipe = cookRecipeMap.get(id);
        if (directRecipe)
            return directRecipe;
        for (const [key, data] of cookRecipeMap.entries()) {
            const tag = key.substring(1);
            if (key.startsWith("#") && itemStack.hasTag(tag)) {
                return data;
            }
        }
        return undefined;
    }
    static isCookable(item) {
        return !!this.findRecipeForItem(item);
    }
    static getCookResult(item) {
        return this.findRecipeForItem(item) ?? undefined;
    }
}
