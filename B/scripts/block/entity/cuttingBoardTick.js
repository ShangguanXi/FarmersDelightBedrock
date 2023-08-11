import { MolangVariableMap, system, world } from "@minecraft/server";
import { getMap, location, loot } from "../../lib/BlockEntity";

const molang = new MolangVariableMap();

const options = { entityTypes: ['farmersdelight:cutting_board'], eventTypes: ['farmersdelight:cutting_board_tick'] };

function working(args) {
    const entity = args.entity;
    try {
        const dimension = entity.dimension;
        const block = dimension.getBlock(entity.location);
        if (block) {
            const currentTick = system.currentTick % 20;
            const itemStack = getMap(entity, 'item')?.get('item');
            const blockLocation = location(entity);
            const oldBlock = dimension.getBlock(blockLocation);
            if (itemStack) {
                const id = itemStack.split(':');
                const name = id[0] == 'minecraft' ? `farmersdelight:${id[0]}_${id[1]}` : itemStack;
                if (!currentTick % 20) dimension.spawnParticle(name, { x: blockLocation.x, y: blockLocation.y + 0.0563, z: blockLocation.z }, molang);
            }
            loot(itemStack, oldBlock.typeId, entity, blockLocation, 'farmersdelight:cutting_board');
        }
    } catch (e) {
    }
}
world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(working, options);