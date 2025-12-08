import { system, world, } from "@minecraft/server";
import { getAttachedBlock } from "./BlockEntity";
import { resolveBlockEntityType } from "./BlockWithEntity";
export function subscribeEvent(event, filter) {
    return (target, property, descriptor) => {
        const callback = descriptor.value;
        if (!callback)
            throw new Error(`@subscribeEvent can only be applied to methods`);
        if (filter === undefined) {
            event.subscribe(callback);
        }
        else {
            event.subscribe(callback, filter);
        }
    };
}
export function attachedBlockEntity(filter) {
    return function (constructor) {
        world.afterEvents.dataDrivenEntityTrigger.subscribe((event) => {
            const entity = event.entity;
            const block = getAttachedBlock(entity, true);
            if (!block)
                return;
            if (resolveBlockEntityType(block)?.id === entity.typeId) {
                constructor.onTick?.(entity, block);
            }
            else if (constructor.onDiscard(entity) !== "DO NOT DISCARD") {
                system.run(() => entity.remove());
            }
        }, filter);
        return constructor;
    };
}
export function blockComponent(name) {
    return function (constructor) {
        system.beforeEvents.startup.subscribe((event) => event.blockComponentRegistry.registerCustomComponent(name, new constructor()));
        return constructor;
    };
}
export function itemComponent(name) {
    return function (constructor) {
        system.beforeEvents.startup.subscribe((event) => event.itemComponentRegistry.registerCustomComponent(name, new constructor()));
        return constructor;
    };
}
