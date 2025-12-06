import { BlockStateSuperset as VanillaBlockStates } from "@minecraft/vanilla-data";

type FarmersDelightBlockStates = {
    ["farmersdelight:age"]: number;
    ["farmersdelight:cabinet_is_open"]: boolean;
    ["farmersdelight:can_grow"]: boolean;
    ["farmersdelight:connection"]: string;
    ["farmersdelight:food_block_stage"]: number;
    ["farmersdelight:growth"]: number;
    ["farmersdelight:is_working"]: boolean;
    ["farmersdelight:moisturized_amount"]: number;
    ["farmersdelight:process"]: number;
    ["farmersdelight:stage"]: number;
    ["farmersdelight:upper"]: boolean;
};

export type KnownBlockStates = VanillaBlockStates & FarmersDelightBlockStates;

export type KnownTypedBlockStateKeys<T> = keyof {
    [K in keyof KnownBlockStates as KnownBlockStates[K] extends T ? K : never]: never
};

declare module "@minecraft/server" {
    export interface BlockPermutation {
        getState<T extends keyof KnownBlockStates>(name: T): KnownBlockStates[T] | undefined;

        withState<T extends keyof KnownBlockStates>(name: T, value: KnownBlockStates[T]): BlockPermutation;
    }
}