import {
    Block,
    Entity,
    ItemStack,
    Vector3,
} from "@minecraft/server";
import { takeItem } from "../../lib/ItemUtil";
import { findCookingRecipe } from "../../data/recipe/cookRecipe";
import { attachedBlockEntity } from "../../lib/EventSubscriber";
import { dropsItems } from "../../lib/EntityUtil";

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

function getRotatedOffsets(direction: string): { x: number, y: number }[] {
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

@attachedBlockEntity({ eventTypes: ["farmersdelight:stove_tick"] })
export class BasketBlockEntity {
    static onDiscard(entity: Entity): undefined {
        dropsItems(entity);
    }

    static onTick(entity: Entity, block: Block) {
        const { x, y, z }: Vector3 = block.bottomCenter();
        const dimension = entity.dimension
        const stoveContainer = entity?.getComponent("inventory")?.container
        if (!stoveContainer) return
        const state = block.permutation.getState("minecraft:cardinal_direction")
        const work = block.permutation.getState('farmersdelight:is_working');
        const rotatedOffsets = getRotatedOffsets(state as string);

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
                    const recipe = findCookingRecipe(itemStack);
                    if (recipe) {
                        const count = recipe.count ?? 1;
                        dimension.spawnItem(new ItemStack(recipe.result, count > 0 ? count : 1), { x, y: y + 1.4, z })
                    }
                    entity.setDynamicProperty(`farmersdelight:item_${i}_time`, 0);
                    entity.setDynamicProperty(`farmersdelight:item_${i}_max_time`, 0);
                    takeItem(stoveContainer, i, 1);
                }
            }
        }
        if (work && Math.random() < 0.1) {
            dimension.playSound("block.campfire.crackle", { x, y: y + 0.5, z });
        }
    }
}