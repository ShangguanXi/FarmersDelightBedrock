import { Direction, Vector3 } from "@minecraft/server";

export function offsetByDirection(
    direction: Direction | string,
    vector: Vector3 = { x: 0, y: 0, z: 0 },
    length: number = 1
): Vector3 {
    switch (direction) {
        case Direction.Down:
        case "down":
            vector.y -= length;
            break;
        case Direction.East:
        case "east":
            vector.x += length;
            break;
        case Direction.North:
        case "north":
            vector.z -= length;
            break;
        case Direction.South:
        case "south":
            vector.z += length;
            break;
        case Direction.Up:
        case "up":
            vector.y += length;
            break;
        case Direction.West:
        case "west":
            vector.x -=length;
            break;
    }
    return vector;
}

export function oppositeOf(direction: Direction): Direction {
    switch (direction) {
        case Direction.Down:
            return Direction.Up;
        case Direction.East:
            return Direction.West;
        case Direction.North:
            return Direction.South;
        case Direction.Up:
            return Direction.Down;
        case Direction.West:
            return Direction.East;
        case Direction.South:
        default:
            return Direction.North;
    }
}