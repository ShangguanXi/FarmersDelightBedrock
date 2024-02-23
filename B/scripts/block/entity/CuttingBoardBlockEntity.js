var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { system, world } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { BlockEntity } from "./BlockEntity";
export class CuttingBoardBlockEntity extends BlockEntity {
    tick(args) {
        const entityBlockData = super.blockEntityData(args.entity);
        if (!entityBlockData)
            return;
        const entity = entityBlockData.entity;
        const { x, y, z } = entity.location;
        const currentTick = system.currentTick % 2;
        const itemStack = JSON.parse(entity.getDynamicProperty('farmersdelight:blockEntityItemStackData'))["item"];
        if (!currentTick && itemStack) {
            const id = itemStack.split(':');
            const name = id[0] == 'minecraft' ? `farmersdelight:${id[0]}_${id[1]}` : itemStack;
            entity.dimension.spawnParticle(name, { x: x, y: y + 0.0563, z: z });
        }
        ;
        super.blockEntityLoot(entityBlockData, "farmersdelight:cutting_board", itemStack == "undefined" ? undefined : [itemStack]);
    }
}
__decorate([
    methodEventSub(world.afterEvents.dataDrivenEntityTrigger, { entityTypes: ["farmersdelight:cutting_board"], eventTypes: ["farmersdelight:cutting_board_tick"] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CuttingBoardBlockEntity.prototype, "tick", null);
//# sourceMappingURL=CuttingBoardBlockEntity.js.map