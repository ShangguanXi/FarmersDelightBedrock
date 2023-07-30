import { world } from "@minecraft/server";

function spawnEntity(id, dimension, location) {
    const entity = dimension.spawnEntity(id, location);
    entity.addTag(JSON.stringify(location));
    return entity
}

function place(args) {
    const block = args.block;
    const dimension = args.dimension;
    const location = block.location;
    switch (block.typeId) {
        case 'farmersdelight:cutting_board':
            spawnEntity('farmersdelight:cutting_board', dimension, location);
            break;
        case 'farmersdelight:skillet':
            const entity = dimension.spawnEntity('farmersdelight:skillet', location);
            entity.addTag(JSON.stringify(location));
            entity.addTag('{"nbt":{"item":"undefined","amount":0,"inventory":[]}}');
            // spawnEntity('farmersdelight:skillet', dimension, location).addTag('{"nbt":{"item":"undefined","amount":0,"inventory":[]}}');
            break;
    }
}

world.afterEvents.blockPlace.subscribe(place);