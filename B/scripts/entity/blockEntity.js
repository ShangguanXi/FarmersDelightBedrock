import { world, MolangVariableMap, system } from "@minecraft/server";
import { loot, location, getMap } from "../lib/BlockEntity";

const molang = new MolangVariableMap();

system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        const worldEntities = player.dimension.getEntities({ families: ['farmersdelight_tick_block_entity'] });
        for (const entity of worldEntities) {
            switch (entity.typeId) {
                case 'farmersdelight:cutting_board':
                    const block = entity.dimension.getBlock(entity.location);
                    if (block) {
                        const itemStack = getMap(entity, 'item')?.get('item');
                        const blockLocation = location(entity);
                        const oldBlock = entity.dimension.getBlock(blockLocation);
                        if (itemStack) {
                            const id = itemStack.split(':');
                            const name = id[0] == 'minecraft' ? `farmersdelight:${id[0]}_${id[1]}` : itemStack;
                            entity.dimension.spawnParticle(name, { x: blockLocation.x + 0.5, y: blockLocation.y + 0.07, z: blockLocation.z + 0.5 }, molang);
                        }
                        loot(itemStack, oldBlock.typeId, entity);
                        if (block.typeId !== 'farmersdelight:cutting_board') {
                            entity.teleport(blockLocation);
                        }
                    }
                    break;
            }
        }
    }
})
