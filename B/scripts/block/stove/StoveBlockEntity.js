var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { DataDrivenEntityTriggerAfterEvent, ItemStack, system, world } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { BlockEntity } from "../../lib/BlockEntity";
import { ItemUtil } from "../../lib/ItemUtil";
import { heatConductors, heatSources } from "../../data/heatBlocks";
const xOffset = 0.3;
const yOffset = 0.2;
const stoveOffsets = [
    {
        x: xOffset,
        y: yOffset
    },
    {
        x: 0,
        y: yOffset
    },
    {
        x: -xOffset,
        y: yOffset
    },
    {
        x: xOffset,
        y: -yOffset
    },
    {
        x: 0,
        y: -yOffset
    },
    {
        x: -xOffset,
        y: -yOffset
    }
];
export class StoveBlockEntity extends BlockEntity {
    static getRotatedOffsets(direction) {
        switch (direction) {
            case "south":
                return stoveOffsets.map(offset => ({ x: -offset.x, y: -offset.y }));
            case "east":
                return stoveOffsets.map(offset => ({ x: -offset.y, y: offset.x }));
            case "west":
                return stoveOffsets.map(offset => ({ x: offset.y, y: -offset.x }));
            case "north":
            default:
                return stoveOffsets;
        }
    }
    tick(args) {
        const entityBlockData = super.blockEntityData(args.entity);
        if (!entityBlockData)
            return;
        const block = entityBlockData.block;
        const entity = entityBlockData.entity;
        super.entityContainerLoot(entityBlockData, entity.typeId);
        const { x, y, z } = entity.location;
        const dimension = entity.dimension;
        const stoveContainer = entity?.getComponent("inventory")?.container;
        if (!stoveContainer)
            return;
        const state = block.permutation.getState("minecraft:cardinal_direction");
        const work = block.permutation.getState('farmersdelight:is_working');
        const rotatedOffsets = StoveBlockEntity.getRotatedOffsets(state);
        const emptySlotsCount = stoveContainer?.emptySlotsCount;
        for (let i = 0; i < 6; i++) {
            const itemStack = stoveContainer.getItem(i);
            if (itemStack != undefined) {
                const itemId = itemStack.typeId;
                const name = itemId.split(':');
                const time = entity.getDynamicProperty(`farmersdelight:item_${i}_time`);
                const maxTime = entity.getDynamicProperty(`farmersdelight:item_${i}_max_time`);
                const particleName = name[0] == 'minecraft' ? `farmersdelight:${name[0]}_stove_${name[1]}` : `${name[0]}:stove_${name[1]}`;
                entity.dimension.spawnParticle(particleName, { x: x + rotatedOffsets[i].x, y: y + 1.02, z: z + rotatedOffsets[i].y });
                if (time % 20 == 0 && work) {
                    entity.dimension.spawnParticle("farmersdelight:stove_smoke_particle", { x: x + rotatedOffsets[i].x, y: y + 1.02, z: z + rotatedOffsets[i].y });
                }
                if (time < maxTime && work) {
                    entity.setDynamicProperty(`farmersdelight:item_${i}_time`, time + 1);
                }
                if (time >= maxTime && work) {
                    if (name[0] == 'minecraft')
                        entity.runCommand(`loot spawn ${x} ${y + 1.4} ${z} loot "minecraft/cook/${itemId.split(":")[1]}"`);
                    else {
                        const cookable = (new ItemStack(itemId)).getComponent("farmersdelight:cookable")?.customComponentParameters.params;
                        dimension.spawnItem(new ItemStack(cookable.result, 1), { x, y: y + 1.4, z });
                    }
                    entity.setDynamicProperty(`farmersdelight:item_${i}_time`, 0);
                    entity.setDynamicProperty(`farmersdelight:item_${i}_max_time`, 0);
                    ItemUtil.clearItem(stoveContainer, i);
                }
            }
            if (emptySlotsCount != 6 && (system.currentTick % 20 == 0) && work) {
                dimension.playSound("block.campfire.crackle", { x, y, z });
            }
        }
    }
    static heatCheck(block) {
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
}
__decorate([
    methodEventSub(world.afterEvents.dataDrivenEntityTrigger, { eventTypes: ["farmersdelight:stove_tick"] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DataDrivenEntityTriggerAfterEvent]),
    __metadata("design:returntype", void 0)
], StoveBlockEntity.prototype, "tick", null);
//# sourceMappingURL=StoveBlockEntity.js.map