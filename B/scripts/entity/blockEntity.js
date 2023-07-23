import { world, MolangVariableMap, ItemStack, system } from "@minecraft/server";

const molang = new MolangVariableMap();

function getMap(entity, value) {
    const map = new Map();
    for (const tag of entity.getTags()) {
        if (JSON.parse(tag)) {
            const json = JSON.parse(tag);
            map.set(value, json[value]);
        } else {
            continue;
        }
    }
    if (map.get(value)) {
        return map
    }
    return undefined;
}
function location(entity) {
    for (const tag of entity.getTags()) {
        if (JSON.parse(tag)) {
            const json = JSON.parse(tag);
            if (json.x) {
                return json
            }
        } else {
            continue;
        }
    }
    return undefined;
}

// function tick(args) {
//     const entity = args.entity;
//     switch (entity.typeId) {
//         case 'farmersdelight:cutting_board':
//             if (entity) {
//                 const itemStack = getMap(entity, 'item')?.get('item');
//                 const blockLocation = location(entity);
//                 if (itemStack) {
//                     const id = itemStack.split(':');
//                     const name = id[0] == 'minecraft' ? `farmersdelight:${id[0]}_${id[1]}` : itemStack;
//                     entity.dimension.spawnParticle(name, { x: blockLocation.x + 0.5, y: blockLocation.y + 0.07, z: blockLocation.z + 0.5 }, molang);
//                     if (entity.dimension.getBlock(blockLocation).typeId !== 'farmersdelight:cutting_board') {
//                         // entity.dimension.spawnItem(new ItemStack(itemStack), entity.location);
//                         entity.triggerEvent('farmersdelight:despawn');
//                     }
//                 }
//                 if (entity.dimension.getBlock(entity.location).typeId !== 'farmersdelight:cutting_board') {
//                     entity.teleport(blockLocation);
//                 }
//             }
//             break;
//     }
// }

// world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(tick, { families: ['farmersdelight_tick_block_entity'] });

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
                        if (itemStack) {
                            const id = itemStack.split(':');
                            const name = id[0] == 'minecraft' ? `farmersdelight:${id[0]}_${id[1]}` : itemStack;
                            entity.dimension.spawnParticle(name, { x: blockLocation.x + 0.5, y: blockLocation.y + 0.07, z: blockLocation.z + 0.5 }, molang);
                            if (entity.dimension.getBlock(blockLocation).typeId !== 'farmersdelight:cutting_board') {
                                entity.dimension.spawnItem(new ItemStack(itemStack), entity.location);
                                entity.triggerEvent('farmersdelight:despawn');
                            }
                        }
                        if (block.typeId !== 'farmersdelight:cutting_board') {
                            entity.teleport(blockLocation);
                        }
                    }
                    break;
            }
        }
    }
})
