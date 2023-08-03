import { world } from "@minecraft/server";
const scoreboard = world.scoreboard;

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
        case 'farmersdelight:skillet_block':
            const skilletBlock = dimension.spawnEntity('farmersdelight:skillet', location);
            skilletBlock.addTag(JSON.stringify(location));
            skilletBlock.addTag('{"item":"undefined"}');
            scoreboard.addObjective(skilletBlock.id, skilletBlock.id).setScore('amount', 0);
            break;
        case 'farmersdelight:stove':
            const stove = dimension.spawnEntity('farmersdelight:stove', location);
            stove.addTag(JSON.stringify(location));
            scoreboard.addObjective(stove.id, stove.id).setScore('amount', 0);
            break;
    }
}

world.afterEvents.blockPlace.subscribe(place);