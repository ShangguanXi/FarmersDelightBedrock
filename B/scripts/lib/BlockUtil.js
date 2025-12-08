import { BlockVolume, world } from "@minecraft/server";
export function volumeAround({ x, y, z }, offsetX, offsetY, offsetZ) {
    return new BlockVolume({
        x: x - offsetX,
        y: y - offsetY,
        z: z - offsetZ,
    }, {
        x: x + offsetX,
        y: y + offsetY,
        z: z + offsetZ,
    });
}
export function makeUniqueId(block) {
    return `${block.dimension.id}@${block.x}@${block.y}@${block.z}`;
}
export function removeBlock(block) {
    block?.setType(block.isWaterlogged ? "minecraft:water" : "minecraft:air");
}
export function destroyBlock(block, tool) {
    const loot = world.getLootTableManager().generateLootFromBlock(block, tool);
    if (loot) {
        const dimension = block.dimension;
        const pos = block.bottomCenter();
        for (const stack of loot) {
            dimension.spawnItem(stack, pos);
        }
    }
    removeBlock(block);
}
