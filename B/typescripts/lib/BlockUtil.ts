import { BlockVolume, Vector3 } from "@minecraft/server";

export function volumeAround({ x, y, z }: Vector3, offsetX: number, offsetY: number, offsetZ: number) {
    return new BlockVolume({
        x: x - offsetX,
        y: y - offsetY,
        z: z - offsetZ,
    }, {
        x: x + offsetX,
        y: y + offsetY,
        z: z + offsetZ,
    });
}