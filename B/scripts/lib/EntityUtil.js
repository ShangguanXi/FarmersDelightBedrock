import { GameMode } from "@minecraft/server";
export class EntityUtil {
    //检测传入的玩家是否为非创造模式
    static gameMode(player) {
        const query = {
            type: "minecraft:player",
            name: player.nameTag,
            location: player.location,
            gameMode: GameMode.creative
        };
        const entities = player.dimension.getEntities(query);
        return !entities.length;
    }
}
//# sourceMappingURL=EntityUtil.js.map