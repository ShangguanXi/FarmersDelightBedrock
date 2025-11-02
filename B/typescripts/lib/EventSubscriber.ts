import { Block, Entity, EntityDataDrivenTriggerEventOptions, world } from "@minecraft/server";
import { getAttachedBlock } from "./BlockEntity";
import { getBlockEntityType } from "./BlockWithEntity";

export interface EventSignal<E, T> {
    subscribe(callback: (event: E) => any, option?: T): any;
}

export function subscribeEvent<E, T>(event: EventSignal<E, T>, filter?: T)  {
    return (target: Object, property: string | symbol, descriptor: TypedPropertyDescriptor<(event: E) => any>) => {
        const callback = descriptor.value;
        if (!callback) throw new Error(`@subscribeEvent can only be applied to methods`);
        if (filter === undefined) {
            event.subscribe(callback);
        } else {
            event.subscribe(callback, filter);
        }
    };
}

export function attachedBlockEntity(filter: EntityDataDrivenTriggerEventOptions) {
    return function(constructor: {
        onTick?: (entity: Entity, block: Block) => void
        onDiscard: (entity: Entity) => void
    }) {
        world.afterEvents.dataDrivenEntityTrigger.subscribe((event) => {
            const entity = event.entity;
            const block = getAttachedBlock(entity);
            if (!block) return;
            if (getBlockEntityType(block)?.id === entity.typeId) {
                constructor.onTick?.(entity, block);
            } else {
                constructor.onDiscard(entity);
            }
        }, filter)
    };
}