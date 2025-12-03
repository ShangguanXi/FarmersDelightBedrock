import { Block } from "@minecraft/server";

export const HEAT_SOURCES: Set<string> = new Set([
    "minecraft:fire",
    "minecraft:campfire",
    "minecraft:soul_fire",
    "minecraft:soul_campfire",
    "minecraft:flowing_lava",
    "minecraft:lava",
]);

export const HEAT_CONDUCTORS: Set<string> = new Set([
    "minecraft:hopper",
]);

export function isHeated(block: Block): boolean {
    const support = block.below();
    if (!support) return false;
    if (HEAT_SOURCES.has(support.typeId) || support.hasTag("farmersdelight:heat_source")) return true;
    if (HEAT_CONDUCTORS.has(support.typeId) || support.hasTag("farmersdelight:heat_conductors")) {
        const distal = support.below();
        if (distal && (HEAT_SOURCES.has(distal.typeId) || distal.hasTag("farmersdelight:heat_source"))) return true;
    }
    return false;
}
