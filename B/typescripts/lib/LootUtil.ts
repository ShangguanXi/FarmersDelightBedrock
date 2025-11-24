import { Block, Dimension, Vector3 } from "@minecraft/server";

export function spawnLoot(dimension: Dimension, { x, y, z }: Vector3, table: string) {
    return dimension.runCommand(`loot spawn ${x} ${y} ${z} loot "${table}"`);
}

export function spawnLootAtBlock(block: Block, table: string) {
    return spawnLoot(block.dimension, block.center(), table);
}