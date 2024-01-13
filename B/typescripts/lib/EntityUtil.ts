import { Entity, EntityQueryOptions, GameMode, Player } from "@minecraft/server";


export class EntityUtil {
    public static gameMode(player: Entity) {
        const query: EntityQueryOptions = {
            type: "minecraft:player",
            name: player.nameTag,
            location: player.location,
            gameMode: GameMode.creative
        }
        const entities = player.dimension.getEntities(query);
        return !entities.length;
    }
}