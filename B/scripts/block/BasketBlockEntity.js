var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { EntityComponentTypes, EntityLoadAfterEvent, world, } from "@minecraft/server";
import { subscribeEvent, attachedBlockEntity } from "../lib/EventSubscriber";
import { offsetByDirection } from "../lib/DirectionUtil";
import { dropsItems } from "../lib/EntityUtil";
import { getAttachedBlock } from "../lib/BlockEntity";
let BasketBlockEntity = class BasketBlockEntity {
    static onDiscard(entity) {
        dropsItems(entity);
    }
    static onTick(entity, block) {
        const container = entity.getComponent(EntityComponentTypes.Inventory)?.container;
        if (!container)
            return;
        const face = block.permutation.getState("minecraft:block_face");
        if (!face)
            return;
        const center = offsetByDirection(face, block.bottomCenter());
        const dimension = entity.dimension;
        for (const neighbor of dimension.getEntitiesAtBlockLocation(center)) {
            if (neighbor.typeId !== "minecraft:item")
                continue;
            const stack = neighbor.getComponent(EntityComponentTypes.Item)?.itemStack;
            if (!stack)
                continue;
            const remaining = container.addItem(stack);
            if (!remaining) {
                neighbor.remove();
            }
            else if (remaining.amount < stack.amount) {
                neighbor.remove();
                dimension.spawnItem(remaining, center)?.clearVelocity();
            }
        }
    }
    static onEntityLoad(event) {
        const entity = event.entity;
        if (entity.typeId !== "farmersdelight:basket")
            return;
        const version = entity.getDynamicProperty("farmersdelight:storage_version");
        if (version)
            return;
        entity.setDynamicProperty("farmersdelight:storage_version", 1);
        const block = getAttachedBlock(entity);
        const permutation = block?.permutation;
        switch (permutation?.getState("minecraft:block_face")) {
            case "up":
                block.setPermutation(permutation.withState("minecraft:block_face", "down"));
                break;
            case "down":
                block.setPermutation(permutation.withState("minecraft:block_face", "up"));
                break;
        }
    }
};
__decorate([
    subscribeEvent(world.afterEvents.entityLoad),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EntityLoadAfterEvent]),
    __metadata("design:returntype", void 0)
], BasketBlockEntity, "onEntityLoad", null);
BasketBlockEntity = __decorate([
    attachedBlockEntity({ eventTypes: ["farmersdelight:basket_tick"] })
], BasketBlockEntity);
export { BasketBlockEntity };
