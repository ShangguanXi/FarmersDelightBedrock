import { Block, BlockVolume, ItemStack, Vector3, world } from "@minecraft/server";

export function volumeAround({ x, y, z }: Vector3, offsetX: number, offsetY: number, offsetZ: number) {
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

export function removeBlock(block?: Block) {
    block?.setType(block.isWaterlogged ? "minecraft:water" : "minecraft:air");
}

export function destroyBlock(block: Block, tool?: ItemStack) {
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