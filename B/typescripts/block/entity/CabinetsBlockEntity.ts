import { Entity, Vector3, system, world } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { BlockEntity } from "./BlockEntity";


export class CabinetsBlockEntity extends BlockEntity {
    @methodEventSub(world.afterEvents.dataDrivenEntityTriggerEvent, { eventTypes: ["farmersdelight:cabinet_tick"] })
    tick(args: any) {
        const entityBlockData = super.blockEntityData(args.entity);
        if (!entityBlockData) return;
        const entity: Entity = entityBlockData.entity;
        super.entityContainerLoot(entityBlockData, entity.typeId);
    }
    @methodEventSub(world.afterEvents.playerInteractWithEntity)
    onInteract(args: any) {
        const entityBlockData = super.blockEntityData(args.target);
        if (!entityBlockData || !entityBlockData.block.hasTag('farmersdelight:cabinet')) return;
        const entity: Entity = entityBlockData.entity;
        const block = entityBlockData.block;
        block.setPermutation(block.permutation.withState('farmersdelight:cabinet_is_open', true));
        entity.triggerEvent('farmersdelight:cabinet_interact');
    }
    @methodEventSub(world.afterEvents.dataDrivenEntityTriggerEvent, { eventTypes: ["farmersdelight:cabinet_close"] })
    onClose(args: any) {
        const entityBlockData = super.blockEntityData(args.entity);
        if (!entityBlockData) return;
        const block = entityBlockData.block;
        block.setPermutation(block.permutation.withState('farmersdelight:cabinet_is_open', false));
    }
}