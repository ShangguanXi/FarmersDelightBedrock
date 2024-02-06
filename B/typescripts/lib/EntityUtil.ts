import { Entity, EntityQueryOptions, GameMode, Player } from "@minecraft/server";


export class EntityUtil {
    //检测传入的玩家是否为非创造模式
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