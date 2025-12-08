var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { DataDrivenEntityTriggerAfterEvent, PlayerInteractWithEntityAfterEvent, world, } from "@minecraft/server";
import { subscribeEvent, attachedBlockEntity } from "../lib/EventSubscriber";
import { dropsItems } from "../lib/EntityUtil";
import { getAttachedBlock } from "../lib/BlockEntity";
let CabinetBlockEntity = class CabinetBlockEntity {
    static onDiscard(entity) {
        dropsItems(entity);
    }
    static onInteract(event) {
        const entity = event.target;
        const block = getAttachedBlock(entity);
        if (!block || !block.hasTag('farmersdelight:cabinet'))
            return;
        const player = event.player;
        entity.dimension.playSound('block.barrel.open', entity.location);
        block.setPermutation(block.permutation.withState('farmersdelight:cabinet_is_open', true));
        entity.setDynamicProperty('farmersdelight:player_open', player.nameTag);
        entity.triggerEvent('farmersdelight:cabinet_interact');
        player.setDynamicProperty('farmersdelight:is_checking_cabinet', true);
    }
    static tryClose(event) {
        const entity = event.entity;
        const block = getAttachedBlock(entity);
        if (!block)
            return;
        const dimension = entity.dimension;
        const players = dimension.getPlayers({ name: entity.getDynamicProperty('farmersdelight:player_open') });
        if (players.length != 1)
            return;
        const player = players[0];
        if (!player.getDynamicProperty('farmersdelight:is_checking_cabinet'))
            return;
        player.setDynamicProperty('farmersdelight:is_checking_cabinet', false);
        dimension.playSound('block.barrel.close', entity.location);
        block.setPermutation(block.permutation.withState('farmersdelight:cabinet_is_open', false));
        entity.setDynamicProperty('farmersdelight:player_open', undefined);
        entity.triggerEvent('farmersdelight:cabinet_close');
    }
};
__decorate([
    subscribeEvent(world.afterEvents.playerInteractWithEntity),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerInteractWithEntityAfterEvent]),
    __metadata("design:returntype", void 0)
], CabinetBlockEntity, "onInteract", null);
__decorate([
    subscribeEvent(world.afterEvents.dataDrivenEntityTrigger, { eventTypes: ["farmersdelight:cabinet_try_close"] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DataDrivenEntityTriggerAfterEvent]),
    __metadata("design:returntype", void 0)
], CabinetBlockEntity, "tryClose", null);
CabinetBlockEntity = __decorate([
    attachedBlockEntity({ eventTypes: ["farmersdelight:cabinet_tick"] })
], CabinetBlockEntity);
export { CabinetBlockEntity };
