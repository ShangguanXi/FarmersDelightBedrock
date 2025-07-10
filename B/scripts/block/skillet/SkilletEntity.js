var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ItemStack, system, world } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { BlockEntity } from "../../lib/BlockEntity";
import { heatConductors, heatSources } from "../../data/heatBlocks";
const skilletV2 = [];
for (let i = 0; i < 5; i++) {
    const json = {};
    json.x = (Math.random() * 2 - 1) * 0.15 * 0.5;
    json.z = (Math.random() * 2 - 1) * 0.15 * 0.5;
    skilletV2.push(json);
}
//检查热源
function heatCheck(block) {
    const blockBelow = block.below();
    if (heatSources.includes(blockBelow?.typeId) || blockBelow?.hasTag('farmersdelight:heat_source'))
        return true;
    if (heatConductors.includes(blockBelow?.typeId) || blockBelow?.hasTag('farmersdelight:heat_conductors')) {
        const blockBelow2 = block.below(2);
        if (heatSources.includes(blockBelow2?.typeId) || blockBelow2?.hasTag('farmersdelight:heat_source'))
            return true;
    }
    return false;
}
export class SkilletEntity extends BlockEntity {
    tick(args) {
        const entityBlockData = super.blockEntityData(args.entity);
        if (!entityBlockData)
            return;
        const entity = entityBlockData.entity;
        const { x, y, z } = entity.location;
        const itemId = entity.getDynamicProperty("farmersdelight:item");
        let totalAmount = entity.getDynamicProperty("farmersdelight:amount");
        let canAddAmount = entity.getDynamicProperty("farmersdelight:canAdd");
        super.blockEntityLoot(entityBlockData, "farmersdelight:skillet_block", itemId == "undefined" ? undefined : [itemId], totalAmount);
        const name = itemId.split(':');
        const dimension = entity.dimension;
        const particleName = name[0] == 'minecraft' ? `farmersdelight:${name[0]}_skillet_${name[1]}` : `${name[0]}:skillet_${name[1]}`;
        const count = entity.getDynamicProperty("farmersdelight:amount") || 0;
        let particleCount = count > 48 ? 5 : (count > 32 ? 4 : (count > 16 ? 3 : (count > 1 ? 2 : count == 1 ? 1 : 0)));
        for (let index = 0; index < particleCount; index++) {
            dimension.spawnParticle(particleName, { x: x + skilletV2[index].x, y: y + 0.07 + 0.03 * (index + 1), z: z + skilletV2[index].z });
        }
        // 烹饪
        if (!heatCheck(entityBlockData.block))
            return;
        const cookDataProperty = entity.getDynamicProperty("farmersdelight:cookData") || "{}";
        if (cookDataProperty == "{}")
            return;
        let cookData = JSON.parse(cookDataProperty);
        if (cookData.datas.length == 0)
            return;
        if (system.currentTick % 80 == 0)
            entity.dimension.playSound("block.farmersdelight.skillet.sizzle", entity.location);
        if (system.currentTick % 4 == 0) {
            const random = Math.floor(Math.random() * 10);
            entity.dimension.spawnParticle(`farmersdelight:skillet_steam_${random}`, { x: x, y: y + 0.25, z: z });
        }
        ;
        for (let i = cookData.datas.length - 1; i >= 0; i--) {
            if (cookData.datas[i].time > 0) {
                cookData.datas[i].time -= 1;
            }
            if (cookData.datas[i].time == 0) {
                const name = itemId.split(':');
                if (name[0] == 'minecraft') {
                    for (let a = 0; a <= cookData.datas[i].count; a++) {
                        entity.runCommand(`loot spawn ${x} ${y + 0.4} ${z} loot "minecraft/cook/${itemId.split(":")[1]}"`);
                    }
                }
                else {
                    const cookable = (new ItemStack(itemId)).getComponent("farmersdelight:cookable")?.customComponentParameters.params;
                    dimension.spawnItem(new ItemStack(cookable.result, cookData.datas[i].count), { x, y: y + 0.4, z });
                }
                entity.setDynamicProperty("farmersdelight:amount", totalAmount - cookData.datas[i].count);
                entity.setDynamicProperty("farmersdelight:canAdd", canAddAmount + cookData.datas[i].count);
                cookData.datas.splice(i, 1);
            }
        }
        if (cookData.datas.length == 0)
            entity.setDynamicProperty("farmersdelight:item", "undefined");
        entity.setDynamicProperty("farmersdelight:cookData", JSON.stringify(cookData));
    }
}
__decorate([
    methodEventSub(world.afterEvents.dataDrivenEntityTrigger, { entityTypes: ["farmersdelight:skillet"], eventTypes: ["farmersdelight:skillet_tick"] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SkilletEntity.prototype, "tick", null);
//# sourceMappingURL=SkilletEntity.js.map