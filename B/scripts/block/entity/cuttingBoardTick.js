import { MolangVariableMap, system, world } from "@minecraft/server";
import BlockEntity from "../../lib/BlockEntity";

const molang = new MolangVariableMap();

const options = { entityTypes: ['farmersdelight:cutting_board'], eventTypes: ['farmersdelight:cutting_board_tick'] };

function working(args) {
    const entity = args.entity;
    try {
        const blockEntity = new BlockEntity(entity);
        if (blockEntity.block) {
            const currentTick = system.currentTick % 2;
            const itemStack = JSON.parse(blockEntity.getBlockEntityData('farmersdelight:blockEntityItemStackData'))['item'];
            const blockLocation = blockEntity.blockEntityDataLocation;
            if (itemStack) {
                const id = itemStack.split(':');
                const name = id[0] == 'minecraft' ? `farmersdelight:${id[0]}_${id[1]}` : itemStack;
                if (!currentTick % 2) blockEntity.dimension.spawnParticle(name, { x: blockLocation.x, y: blockLocation.y + 0.0563, z: blockLocation.z }, molang);
            }
            blockEntity.blockEntityLoot([itemStack], 'farmersdelight:cutting_board', 1);
        }
    } catch (e) {
    }
}
world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(working, options);