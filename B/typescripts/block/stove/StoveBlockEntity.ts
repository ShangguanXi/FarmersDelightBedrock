import { Block, DataDrivenEntityTriggerAfterEvent, Entity, ItemStack, ScoreboardObjective, ScoreboardScoreInfo, Vector3, system, world } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { BlockEntity } from "../../lib/BlockEntity";
import { ItemUtil } from "../../lib/ItemUtil";
import { heatConductors, heatSources } from "../../data/heatBlocks";
import { CookRecipeManager } from "../../data/recipe/cookRecipe";

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
    }
    , {
        x: -xOffset,
        y: -yOffset
    }
];

export class StoveBlockEntity extends BlockEntity {

    static getRotatedOffsets(direction: string): { x: number, y: number }[] {
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
    @methodEventSub(world.afterEvents.dataDrivenEntityTrigger, { eventTypes: ["farmersdelight:stove_tick"] })
    tick(args: DataDrivenEntityTriggerAfterEvent) {
        const entityBlockData = super.blockEntityData(args.entity);
        if (!entityBlockData) return;
        const block: Block = entityBlockData.block;
        const entity: Entity = entityBlockData.entity;
        super.entityContainerLoot(entityBlockData, entity.typeId)
        const { x, y, z }: Vector3 = entity.location;
        const dimension = entity.dimension
        const stoveContainer = entity?.getComponent("inventory")?.container
        if (!stoveContainer) return
        const state = block.permutation.getState("minecraft:cardinal_direction")
        const work = block.permutation.getState('farmersdelight:is_working');
        const rotatedOffsets = StoveBlockEntity.getRotatedOffsets(state as string);

        const emptySlotsCount = stoveContainer?.emptySlotsCount
        for (let i = 0; i < 6; i++) {
            const itemStack = stoveContainer.getItem(i)
            if (itemStack != undefined) {
                const itemId = itemStack.typeId
                const name: string[] = itemId.split(':');
                const time = entity.getDynamicProperty(`farmersdelight:item_${i}_time`) as number;
                const maxTime = entity.getDynamicProperty(`farmersdelight:item_${i}_max_time`) as number;
                const particleName: string = name[0] == 'minecraft' ? `farmersdelight:${name[0]}_stove_${name[1]}` : `${name[0]}:stove_${name[1]}`;
                entity.dimension.spawnParticle(particleName, { x: x + rotatedOffsets[i].x, y: y + 1.02, z: z + rotatedOffsets[i].y });
                if (time % 20 == 0 && work) {
                    entity.dimension.spawnParticle("farmersdelight:stove_smoke_particle", { x: x + rotatedOffsets[i].x, y: y + 1.02, z: z + rotatedOffsets[i].y });
                }
                if (time < maxTime && work) {
                    entity.setDynamicProperty(`farmersdelight:item_${i}_time`, time + 1)
                }
                if (time >= maxTime && work) {
                    const result = CookRecipeManager.getCookResult(itemStack)?.result ?? "minecraft:air"
                    dimension.spawnItem(new ItemStack(result, 1), { x, y: y + 1.4, z })
                    entity.setDynamicProperty(`farmersdelight:item_${i}_time`, 0);
                    entity.setDynamicProperty(`farmersdelight:item_${i}_max_time`, 0);
                    ItemUtil.clearItem(stoveContainer, i)
                }
            }
            if (emptySlotsCount != 6 && (system.currentTick % 20 == 0) && work) {
                dimension.playSound("block.campfire.crackle", { x, y, z })
            }
        }
    }
    static heatCheck(block: Block) {
        const blockBelow = block.below()
        if (heatSources.includes(blockBelow?.typeId as string) || blockBelow?.hasTag('farmersdelight:heat_source')) return true
        if (heatConductors.includes(blockBelow?.typeId as string) || blockBelow?.hasTag('farmersdelight:heat_conductors')) {
            const blockBelow2 = block.below(2)
            if (heatSources.includes(blockBelow2?.typeId as string) || blockBelow2?.hasTag('farmersdelight:heat_source')) return true
        }
        return false
    }
}