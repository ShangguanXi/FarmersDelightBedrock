import {
    Block,
    BlockCustomComponent,
    Entity,
    EntityDataDrivenTriggerEventOptions, ItemCustomComponent,
    system,
    world,
} from "@minecraft/server";
import { getAttachedBlock } from "./BlockEntity";
import { getBlockEntityType } from "./BlockWithEntity";

export type EventSignal<E, T> = {
    subscribe(callback: (event: E) => any, option?: T): any;
}

export function subscribeEvent<E, T>(event: EventSignal<E, T>, filter?: T) {
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
    return function <T extends {
        onDiscard: (entity: Entity) => undefined | "DO NOT DISCARD"
        onTick?: (entity: Entity, block: Block) => void
    }>(constructor: T) {
        world.afterEvents.dataDrivenEntityTrigger.subscribe((event) => {
            const entity = event.entity;
            const block = getAttachedBlock(entity, true);
            if (!block) return;
            if (getBlockEntityType(block)?.id === entity.typeId) {
                constructor.onTick?.(entity, block);
            } else if (constructor.onDiscard(entity) !== "DO NOT DISCARD") { // 不用boolean是为了防手贱
                system.run(() => entity.remove());
            }
        }, filter);
        return constructor;
    };
}

export function blockComponent(name: string) {
    return function <T extends new () => BlockCustomComponent>(constructor: T) {
        system.beforeEvents.startup.subscribe((event) => {
            event.blockComponentRegistry.registerCustomComponent(name, new constructor());
        });
        return constructor;
    };
}

export function itemComponent(name: string) {
    return function <T extends new () => ItemCustomComponent>(constructor: T) {
        system.beforeEvents.startup.subscribe((event) => {
            event.itemComponentRegistry.registerCustomComponent(name, new constructor());
        });
        return constructor;
    };
}