import { Direction } from "@minecraft/server";
export function toVector3(direction, length = 1) {
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
