import { CustomComponentParameters, Vector3 } from "@minecraft/server";

type CustomComponentInstance = {
    customComponentParameters: CustomComponentParameters
}

type CustomComponentHolder = {
    getComponent: (name: string) => CustomComponentInstance | undefined
}

export function resolveSpec<T>(holder: CustomComponentHolder | undefined, name: string): T | undefined {
    return holder?.getComponent(name)?.customComponentParameters?.params as T | undefined;
}

export function isSamePos(required: Vector3, supplied: any): boolean {
    return supplied && required.x === supplied.x && required.y === supplied.y && required.z === supplied.z;
}