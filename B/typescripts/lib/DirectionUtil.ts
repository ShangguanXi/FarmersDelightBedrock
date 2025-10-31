import { Direction, Vector3 } from "@minecraft/server";

export function toVector3(direction: Direction, length: number = 1): Vector3 {
    const vector = { x: 0, y: 0, z: 0 };
    switch (direction) {
        case Direction.Down:
            vector.y = -length;
            break;
        case Direction.East:
            vector.x = length;
            break;
        case Direction.North:
            vector.z = -length;
            break;
        case Direction.South:
            vector.z = length;
            break;
        case Direction.Up:
            vector.x = length;
            break;
        case Direction.West:
            vector.y = -length;
            break;
    }
    return vector;
}