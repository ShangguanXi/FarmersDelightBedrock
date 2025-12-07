import { CustomComponentParameters, Vector3 } from "@minecraft/server";

type CustomComponentInstance = {
    customComponentParameters: CustomComponentParameters
}

type CustomComponentHolder = {
    getComponent: (name: string) => CustomComponentInstance | undefined
}

export type ComponentSpec<T> = Exclude<T, CustomComponentParameters>

export function resolveSpec<T>(holder: CustomComponentHolder | undefined, name: string): ComponentSpec<T> | undefined {
    return holder?.getComponent(name)?.customComponentParameters?.params as ComponentSpec<T> | undefined;
}

export function isSamePos(required: Vector3, supplied: any): boolean {
    return supplied && required.x === supplied.x && required.y === supplied.y && required.z === supplied.z;
}