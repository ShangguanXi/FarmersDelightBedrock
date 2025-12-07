import {
    Block, ContainerSlot,
    Entity, EntityComponentTypes,
    ItemStack,
    Vector3,
} from "@minecraft/server";
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

function getRotatedOffsets(direction?: string): { x: number, y: number }[] {
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

function getRecipeRequiredTime(slot: ContainerSlot): number {
    const stack = slot.getItem();
    if (!stack) return 0;
    const recipe = findCookingRecipe(stack);
    return recipe ? recipe.time : 0;
}

@attachedBlockEntity({ eventTypes: ["farmersdelight:stove_tick"] })
export class BasketBlockEntity {
    static onDiscard(entity: Entity): undefined {
        dropsItems(entity);
    }

    static onTick(entity: Entity, block: Block) {
        const container = entity?.getComponent(EntityComponentTypes.Inventory)?.container;
        if (!container) return;
        const extinguished = !block.permutation.getState("farmersdelight:is_working");
        const rotatedOffsets = getRotatedOffsets(block.permutation.getState("minecraft:cardinal_direction"));
        const { x, y, z }: Vector3 = block.bottomCenter();
        const dimension = entity.dimension;
        for (let i = 0; i < 6; ++i) {
            const slot = container.getSlot(i);
            if (!slot.hasItem()) continue;
            const itemId = slot.typeId;
            const name: string[] = itemId.split(":");
            const particle: string = name[0] == "minecraft" ? `farmersdelight:minecraft_stove_${name[1]}` : `${name[0]}:stove_${name[1]}`;
            dimension.spawnParticle(particle, {
                x: x + rotatedOffsets[i].x,
                y: y + 1.02,
                z: z + rotatedOffsets[i].y,
            });
            if (extinguished) continue;
            const time = entity.getDynamicProperty(`farmersdelight:item_${i}_time`) as number ?? 0;
            if (time % 20 == 0) {
                dimension.spawnParticle("farmersdelight:stove_smoke_particle", {
                    x: x + rotatedOffsets[i].x,
                    y: y + 1.02,
                    z: z + rotatedOffsets[i].y,
                });
            }
            if (time < (entity.getDynamicProperty(`farmersdelight:item_${i}_max_time`) as number ?? getRecipeRequiredTime(slot))) {
                entity.setDynamicProperty(`farmersdelight:item_${i}_time`, time + 1);
            } else {
                let stack = slot.getItem();
                if (!stack) continue;
                const recipe = findCookingRecipe(stack);
                if (recipe) {
                    const count = recipe.count ?? 1;
                    stack = new ItemStack(recipe.result, count > 0 ? count * slot.amount : slot.amount);
                }
                dimension.spawnItem(stack, { x, y: y + 1.0, z })?.clearVelocity();
                slot.setItem(undefined);
                entity.setDynamicProperties({
                    [`farmersdelight:item_${i}_time`]: undefined,
                    [`farmersdelight:item_${i}_max_time`]: undefined,
                });
            }
        }
        if (!extinguished && Math.random() < 0.1) {
            dimension.playSound("block.campfire.crackle", { x, y: y + 0.5, z });
        }
    }
}