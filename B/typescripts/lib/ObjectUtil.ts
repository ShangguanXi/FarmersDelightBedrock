import { Vector3 } from "@minecraft/server";

export function isSamePos(required: Vector3, supplied: any): boolean {
    return supplied && required.x === supplied.x && required.y === supplied.y && required.z === supplied.z;
}