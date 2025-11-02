import {
    Container,
    Direction,
    Entity,
    EntityComponentTypes,
    EntityQueryOptions,
    GameMode,
    Player, system,
} from "@minecraft/server";

// 返回实体水平朝向（JE LivingEntity#getDirecion)
export function horizontalDirectionOf(entity: Entity): Direction {
    const rot = entity.getRotation().y;
    if (rot < -135) return Direction.North;
    if (rot < -45) return Direction.East;
    if (rot < 45) return Direction.South;
    if (rot < 135) return Direction.West;
    return Direction.North;
}

export function dropsItems(
    entity: Entity,
    container?: Container
) {
    if (!container) {
        container = entity.getComponent(EntityComponentTypes.Inventory)?.container
        if (!container) return;
    }
    const { dimension, location } = entity;
    for (let i = 0, size = container.size; i < size; ++i) {
        const stack = container.getItem(i);
        if (stack) {
            dimension.spawnItem(stack, location);
        }
    }
    container.clearAll();
}

export function discard(entity: Entity) {
    system.run(() => entity.remove());
}

export class EntityUtil {
    //检测传入的玩家是否为非创造模式
    public static gameMode(player: Entity) {
        const query: EntityQueryOptions = {
            type: "minecraft:player",
            name: player.nameTag,
            location: player.location,
            gameMode: GameMode.Creative
        }
        const entities = player.dimension.getEntities(query);
        return !entities.length;
    }
    //获取玩家二维朝向
    public static cardinalDirection(player: Entity|Player, yOffset: number = 0) {
        const rot = player.getRotation();
        let rotY = rot.y + yOffset;
        if (rotY > 180) rotY -= 360;
        if (-45 <= rotY && rotY < 45) {
            return Direction.North;
        }
        else if (45 <= rotY && rotY < 135) {
            return Direction.East;
        }
        else if (-135 <= rotY && rotY < -45) {
            return Direction.West;
        }
        else if (135 <= rotY || rotY < -135) {
            return Direction.South;
        }
    }
}