import { ItemStack, ItemCustomComponent } from "@minecraft/server";
import { itemComponent } from "../../lib/EventSubscriber";
import { resolveSpec } from "../../lib/ObjectUtil";

/**
 * 原版和农夫乐事自带的桶装、瓶装物品作为厨锅原料被消耗时返还的容器（Java 版的 craftRemainder）。
 */
const BUILTIN_REMAINDERS: Record<string, string> = {
    "minecraft:water_bucket": "minecraft:bucket",
    "minecraft:milk_bucket": "minecraft:bucket",
    "minecraft:lava_bucket": "minecraft:bucket",
    "minecraft:powder_snow_bucket": "minecraft:bucket",
    "minecraft:honey_bottle": "minecraft:glass_bottle",
    "minecraft:potion": "minecraft:glass_bottle",
    "minecraft:dragon_breath": "minecraft:glass_bottle",
    "farmersdelight:milk_bottle": "minecraft:glass_bottle",
};

/**
 * 取物品作为厨锅原料被消耗后返还的容器：先看物品上的 farmersdelight:remainder 组件，再看内置表。
 */
export function getRemainder(stack: ItemStack): string | undefined {
    const spec = resolveSpec<string>(stack, "farmersdelight:remainder");
    if (typeof spec === "string") return spec;
    return BUILTIN_REMAINDERS[stack.typeId];
}

/**
 * 返还容器组件：附属物品声明自己作为厨锅原料被消耗后返还什么，例如
 * "farmersdelight:remainder": "minecraft:bucket"
 */
@itemComponent("farmersdelight:remainder")
export class RemainderComponent implements ItemCustomComponent {}
