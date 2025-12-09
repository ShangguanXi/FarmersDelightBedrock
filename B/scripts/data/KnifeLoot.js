import { EntityComponentTypes, ItemStack, } from "@minecraft/server";
import { enchantmentLevelOf } from "../lib/ItemUtil";
import { spawnLootAtBlock } from "../lib/LootUtil";
export function blockLoot(table) {
    return (_, __) => table;
}
export function entityLoot(item) {
    return (_, __) => new ItemStack(item);
}
export function dispatchOnFire(raw, cooked) {
    return (_, victim) => victim.getComponent(EntityComponentTypes.OnFire)?.onFireTicksRemaining
        ? new ItemStack(cooked)
        : new ItemStack(raw);
}
const STRAW_FROM_GRASS = blockLoot("farmersdelight/straw_from_grass");
const STRAW_FROM_WHEAT = (_, state) => state.getState("growth") === 7 ? "farmersdelight/straw" : undefined;
const STRAW_FROM_FD_WHEAT = (_, state) => state.getState("farmersdelight:growth") === 7 ? "farmersdelight/straw" : undefined;
const STRAW_FROM_RICE = (_, state) => state.getState("farmersdelight:growth") === 3 ? "farmersdelight/straw" : undefined;
const LOOT_LEATHER = entityLoot("minecraft:leather");
const LOOT_STRING = entityLoot("minecraft:string");
const LOOT_HAM_BY_CHANCE = (stack, victim) => {
    if (Math.floor(Math.random() * 10) < 5 + enchantmentLevelOf(stack, "looting")) {
        return victim.getComponent(EntityComponentTypes.OnFire)?.onFireTicksRemaining
            ? new ItemStack("farmersdelight:smoked_ham")
            : new ItemStack("farmersdelight:ham");
    }
    return undefined;
};
export const ENTITY_LOOT_WITH_KNIFE = new Map([
    ["minecraft:pig", LOOT_HAM_BY_CHANCE],
    ["minecraft:chicken", entityLoot("minecraft:feather")],
    ["minecraft:hoglin", dispatchOnFire("farmersdelight:ham", "farmersdelight:smoked_ham")],
    ["minecraft:cow", LOOT_LEATHER],
    ["minecraft:mooshroom", LOOT_LEATHER],
    ["minecraft:donkey", LOOT_LEATHER],
    ["minecraft:horse", LOOT_LEATHER],
    ["minecraft:mule", LOOT_LEATHER],
    ["minecraft:llama", LOOT_LEATHER],
    ["minecraft:trader_llama", LOOT_LEATHER],
    ["minecraft:shulker", LOOT_LEATHER],
    ["minecraft:rabbit", entityLoot("minecraft:rabbit_hide")],
    ["minecraft:spider", entityLoot("minecraft:shulker_shell")],
    ["minecraft:cave_spider", LOOT_STRING],
]);
export const BLOCK_LOOT_WITH_KNIFE = new Map([
    ["minecraft:tallgrass", STRAW_FROM_GRASS],
    ["minecraft:short_grass", STRAW_FROM_GRASS],
    ["minecraft:fern", STRAW_FROM_GRASS],
    ["minecraft:wheat", STRAW_FROM_WHEAT],
    ["farmersdelight:rich_soil_wheat", STRAW_FROM_WHEAT],
    ["farmersdelight:rice_block_upper", STRAW_FROM_RICE],
    ["farmersdelight:sandy_shrub", blockLoot("farmersdelight/straw_from_sandy_shrub")],
]);
export const DROPS_CAKE_SLICE = new Set([
    "minecraft:cake",
    "minecraft:candle_cake",
    "minecraft:white_candle_cake",
    "minecraft:orange_candle_cake",
    "minecraft:magenta_candle_cake",
    "minecraft:light_blue_candle_cake",
    "minecraft:yellow_candle_cake",
    "minecraft:lime_candle_cake",
    "minecraft:pink_candle_cake",
    "minecraft:gray_candle_cake",
    "minecraft:light_gray_candle_cake",
    "minecraft:cyan_candle_cake",
    "minecraft:purple_candle_cake",
    "minecraft:blue_candle_cake",
    "minecraft:brown_candle_cake",
    "minecraft:green_candle_cake",
    "minecraft:red_candle_cake",
    "minecraft:black_candle_cake",
]);
export function spawnKnifeLoot(block, permutation, tool) {
    const blockId = permutation.type.id;
    const loot = BLOCK_LOOT_WITH_KNIFE.get(blockId)?.(tool, permutation);
    if (loot) {
        spawnLootAtBlock(block, loot);
    }
    else if (DROPS_CAKE_SLICE.has(blockId)) {
        block.dimension.spawnItem(new ItemStack("farmersdelight:cake_slice", blockId === "minecraft:cake" ? 7 - (permutation.getState("bite_counter") ?? 0) : 7), block.center());
    }
}
