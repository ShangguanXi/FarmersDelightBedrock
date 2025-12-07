import {
    Block,
    Entity,
    EntityComponentTypes,
    EntityLoadAfterEvent,
    world,
} from "@minecraft/server";
import { subscribeEvent, attachedBlockEntity } from "../lib/EventSubscriber";
import { offsetByDirection } from "../lib/DirectionUtil";
import { dropsItems } from "../lib/EntityUtil";
import { getAttachedBlock } from "../lib/BlockEntity";
import { DynamicProperties } from "../lib/DynamicProperties";

@attachedBlockEntity({ eventTypes: ["farmersdelight:basket_tick"] })
export class BasketBlockEntity {
    static onDiscard(entity: Entity): undefined {
        dropsItems(entity);
    }

    static onTick(entity: Entity, block: Block) {
        const container = entity.getComponent(EntityComponentTypes.Inventory)?.container;
        if (!container) return;
        const face = block.permutation.getState("minecraft:block_face");
        if (!face) return;
        const center = offsetByDirection(face, block.bottomCenter());
        const dimension = entity.dimension;
        for (const neighbor of dimension.getEntitiesAtBlockLocation(center)) {
            if (neighbor.typeId !== "minecraft:item") continue;
            const stack = neighbor.getComponent(EntityComponentTypes.Item)?.itemStack;
            if (!stack) continue;
            const remaining = container.addItem(stack);
            if (!remaining) {
                neighbor.remove();
            } else if (remaining.amount < stack.amount) {
                neighbor.remove();
                dimension.spawnItem(remaining, center)?.clearVelocity();
            }
        }
    }

    @subscribeEvent(world.afterEvents.entityLoad)
    static onEntityLoad(event: EntityLoadAfterEvent) {
        const entity = event.entity;
        if (entity.typeId !== "farmersdelight:basket") return;
        const version = entity.getDynamicProperty(DynamicProperties.STORAGE_VERSION) as number;
        if (version) return;
        entity.setDynamicProperty(DynamicProperties.STORAGE_VERSION, 1);
        const block = getAttachedBlock(entity);
        const permutation = block?.permutation;
        switch (permutation?.getState("minecraft:block_face")) {
            case "up":
                block!!.setPermutation(permutation.withState("minecraft:block_face", "down"));
                break;
            case "down":
                block!!.setPermutation(permutation.withState("minecraft:block_face", "up"));
                break;
        }
    }
}