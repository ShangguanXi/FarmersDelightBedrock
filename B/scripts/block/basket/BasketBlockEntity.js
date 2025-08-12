var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { world } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { BlockEntity } from "../../lib/BlockEntity";
export class BasketBlockEntity extends BlockEntity {
    tick(args) {
        const entityBlockData = super.blockEntityData(args.entity);
        if (!entityBlockData)
            return;
        const entity = entityBlockData.entity;
        super.entityContainerLoot(entityBlockData, entity.typeId);
        const location = entity.location;
        const List = entity.dimension.getEntitiesAtBlockLocation(location);
        const block = entityBlockData.block;
        if (!block)
            return;
        const face = block.permutation.getState("minecraft:block_face");
        if (!face)
            return;
        const baseLoc = {
            x: Math.floor(block.location.x),
            y: Math.floor(block.location.y),
            z: Math.floor(block.location.z)
        };
        const offsets = {
            down: { x: 0, y: 1, z: 0 },
            up: { x: 0, y: -1, z: 0 },
            south: { x: 0, y: 0, z: 1 },
            north: { x: 0, y: 0, z: -1 },
            west: { x: -1, y: 0, z: 0 },
            east: { x: 1, y: 0, z: 0 }
        };
        const offset = offsets[face] ?? { x: 0, y: 0, z: 0 };
        const targetLoc = {
            x: baseLoc.x + offset.x,
            y: baseLoc.y + offset.y,
            z: baseLoc.z + offset.z
        };
        const list = entity.dimension.getEntitiesAtBlockLocation(targetLoc);
        for (let i = 0; i < list.length; i++) {
            const e = list[i];
            if (e.typeId != "minecraft:item")
                continue;
            else {
                const itemStack = e.getComponent("minecraft:item")?.itemStack;
                if (!itemStack)
                    continue;
                const container = entity.getComponent("minecraft:inventory")?.container;
                if (!container)
                    continue;
                if (container.firstEmptySlot() == undefined)
                    continue;
                entity.getComponent("minecraft:inventory")?.container.addItem(itemStack);
                e.remove();
            }
        }
    }
}
__decorate([
    methodEventSub(world.afterEvents.dataDrivenEntityTrigger, { eventTypes: ["farmersdelight:basket_tick"] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BasketBlockEntity.prototype, "tick", null);
//# sourceMappingURL=BasketBlockEntity.js.map