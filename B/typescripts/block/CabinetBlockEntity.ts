import {
    DataDrivenEntityTriggerAfterEvent,
    Entity,
    PlayerInteractWithEntityAfterEvent,
    world,
} from "@minecraft/server";
import { subscribeEvent, attachedBlockEntity } from "../lib/EventSubscriber";
import { discard, dropsItems } from "../lib/EntityUtil";
import { locateBlock } from "../lib/BlockEntity";

@attachedBlockEntity({ eventTypes: ["farmersdelight:cabinet_tick"] })
export class CabinetBlockEntity {
    static onDiscard(entity: Entity) {
        dropsItems(entity);
        discard(entity);
    }

    @subscribeEvent(world.afterEvents.playerInteractWithEntity)
    onInteract(event: PlayerInteractWithEntityAfterEvent) {
        const entity = event.target;
        const block = locateBlock(entity);
        if (!block || !block.hasTag('farmersdelight:cabinet')) return;
        const player = event.player;
        entity.dimension.playSound('block.barrel.open', entity.location);
        block.setPermutation(block.permutation.withState('farmersdelight:cabinet_is_open', true));
        entity.setDynamicProperty('farmersdelight:player_open', player.nameTag);
        entity.triggerEvent('farmersdelight:cabinet_interact');
        player.setDynamicProperty('farmersdelight:is_checking_cabinet', true);
    }

    @subscribeEvent(world.afterEvents.dataDrivenEntityTrigger, { eventTypes: ["farmersdelight:cabinet_try_close"] })
    tryClose(event: DataDrivenEntityTriggerAfterEvent) {
        const entity = event.entity;
        const block = locateBlock(entity);
        if (!block) return;
        const dimension = entity.dimension;
        const players = dimension.getPlayers({name: entity.getDynamicProperty('farmersdelight:player_open') as string});
        if (players.length != 1) return;
        const player = players[0]
        if (!player.getDynamicProperty('farmersdelight:is_checking_cabinet')) return
        player.setDynamicProperty('farmersdelight:is_checking_cabinet', false);
        dimension.playSound('block.barrel.close', entity.location);
        block.setPermutation(block.permutation.withState('farmersdelight:cabinet_is_open', false));
        entity.setDynamicProperty('farmersdelight:player_open', undefined);
        entity.triggerEvent('farmersdelight:cabinet_close');
    }
}

void CabinetBlockEntity;