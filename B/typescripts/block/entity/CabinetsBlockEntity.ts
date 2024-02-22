import { Entity, PlayerInteractWithEntityAfterEvent, world } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { BlockEntity } from "./BlockEntity";


export class CabinetsBlockEntity extends BlockEntity {
    @methodEventSub(world.afterEvents.dataDrivenEntityTrigger, { eventTypes: ["farmersdelight:cabinet_tick"] })
    tick(args: any) {
        const entityBlockData = super.blockEntityData(args.entity);
        if (!entityBlockData) return;
        const entity: Entity = entityBlockData.entity;
        super.entityContainerLoot(entityBlockData, entity.typeId);
    }
    @methodEventSub(world.afterEvents.playerInteractWithEntity)
    onInteract(args: PlayerInteractWithEntityAfterEvent) {
        const entityBlockData = super.blockEntityData(args.target);
        if (!entityBlockData || !entityBlockData.block.hasTag('farmersdelight:cabinet')) return;
        const entity: Entity = entityBlockData.entity;
        const block = entityBlockData.block;
        const player = args.player;
        world.playSound('block.barrel.open', entity.location);
        block.setPermutation(block.permutation.withState('farmersdelight:cabinet_is_open', true));
        entity.setDynamicProperty('farmersdelight:player_open', args.player.nameTag);
        entity.triggerEvent('farmersdelight:cabinet_interact');
        player.setDynamicProperty('farmersdelight:is_checking_cabinet', true);
    }
    @methodEventSub(world.afterEvents.dataDrivenEntityTrigger, { eventTypes: ["farmersdelight:cabinet_try_close"] })
    tryClose(args: any) {
        const entityBlockData = super.blockEntityData(args.entity);
        if (!entityBlockData) return;
        const block = entityBlockData.block;
        const entity = entityBlockData.entity;
        const dimension = entityBlockData.dimension;
        const players = dimension.getEntities({type: 'minecraft:player', name: entity.getDynamicProperty('farmersdelight:player_open') as string});
        if (players.length != 1) return;
        const player = players[0]
        if (!player.getDynamicProperty('farmersdelight:is_checking_cabinet')) return
        player.setDynamicProperty('farmersdelight:is_checking_cabinet', false);
        world.playSound('block.barrel.close', entity.location);
        block.setPermutation(block.permutation.withState('farmersdelight:cabinet_is_open', false));
        entity.setDynamicProperty('farmersdelight:player_open', undefined);
        entity.triggerEvent('farmersdelight:cabinet_close');
    }
}