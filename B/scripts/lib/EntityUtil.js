export function gameMode(player) {
    const query = {
        type: 'minecraft:player',
        name: player.nameTag,
        location: player.location,
        gameMode: 'creative'
    }
    const entities = player.dimension.getEntities(query);
    if (!entities.length) {
        return true;
    }
    return false;
}