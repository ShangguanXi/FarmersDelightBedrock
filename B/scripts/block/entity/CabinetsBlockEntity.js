var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { PlayerInteractWithEntityAfterEvent, world } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { BlockEntity } from "./BlockEntity";
export class CabinetsBlockEntity extends BlockEntity {
    tick(args) {
        const entityBlockData = super.blockEntityData(args.entity);
        if (!entityBlockData)
            return;
        const entity = entityBlockData.entity;
        super.entityContainerLoot(entityBlockData, entity.typeId);
    }
    onInteract(args) {
        const entityBlockData = super.blockEntityData(args.target);
        if (!entityBlockData || !entityBlockData.block.hasTag('farmersdelight:cabinet'))
            return;
        const entity = entityBlockData.entity;
        const block = entityBlockData.block;
        const player = args.player;
        world.playSound('block.barrel.open', entity.location);
        block.setPermutation(block.permutation.withState('farmersdelight:cabinet_is_open', true));
        entity.setDynamicProperty('farmersdelight:player_open', args.player.nameTag);
        entity.triggerEvent('farmersdelight:cabinet_interact');
        player.setDynamicProperty('farmersdelight:is_checking_cabinet', true);
    }
    tryClose(args) {
        const entityBlockData = super.blockEntityData(args.entity);
        if (!entityBlockData)
            return;
        const block = entityBlockData.block;
        const entity = entityBlockData.entity;
        const dimension = entityBlockData.dimension;
        const players = dimension.getEntities({ type: 'minecraft:player', name: entity.getDynamicProperty('farmersdelight:player_open') });
        if (players.length != 1)
            return;
        const player = players[0];
        if (!player.getDynamicProperty('farmersdelight:is_checking_cabinet'))
            return;
        player.setDynamicProperty('farmersdelight:is_checking_cabinet', false);
        world.playSound('block.barrel.close', entity.location);
        block.setPermutation(block.permutation.withState('farmersdelight:cabinet_is_open', false));
        entity.setDynamicProperty('farmersdelight:player_open', undefined);
        entity.triggerEvent('farmersdelight:cabinet_close');
    }
}
__decorate([
    methodEventSub(world.afterEvents.dataDrivenEntityTrigger, { eventTypes: ["farmersdelight:cabinet_tick"] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CabinetsBlockEntity.prototype, "tick", null);
__decorate([
    methodEventSub(world.afterEvents.playerInteractWithEntity),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerInteractWithEntityAfterEvent]),
    __metadata("design:returntype", void 0)
], CabinetsBlockEntity.prototype, "onInteract", null);
__decorate([
    methodEventSub(world.afterEvents.dataDrivenEntityTrigger, { eventTypes: ["farmersdelight:cabinet_try_close"] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CabinetsBlockEntity.prototype, "tryClose", null);
//# sourceMappingURL=CabinetsBlockEntity.js.map