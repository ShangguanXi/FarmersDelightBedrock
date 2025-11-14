import { system, world } from "@minecraft/server";
import { getAttachedBlock } from "./BlockEntity";
import { getBlockEntityType } from "./BlockWithEntity";
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
            const block = getAttachedBlock(entity);
            if (!block)
                return;
            if (getBlockEntityType(block)?.id === entity.typeId) {
                constructor.onTick?.(entity, block);
            }
            else if (constructor.onDiscard(entity) !== "DO NOT DISCARD") { // 不用boolean是为了防手贱
                system.run(() => entity.remove());
            }
        }, filter);
    };
}
