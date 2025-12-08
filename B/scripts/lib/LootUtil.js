export function spawnLoot(dimension, { x, y, z }, table) {
    return dimension.runCommand(`loot spawn ${x} ${y} ${z} loot "${table}"`);
}
export function spawnLootAtBlock(block, table) {
    return spawnLoot(block.dimension, block.center(), table);
}
