import { world } from "@minecraft/server";

function spawnEntity(id, dimension, location) {
    dimension.spawnEntity(id, location).addTag(JSON.stringify(location));
}

function place(args) {
    const block = args.block;
    const dimension = args.dimension;
    const location = block.location;
    switch (block.typeId) {
        case 'farmersdelight:cutting_board':
            spawnEntity('farmersdelight:cutting_board', dimension, location);
            break;
    }
}

world.afterEvents.blockPlace.subscribe(place);