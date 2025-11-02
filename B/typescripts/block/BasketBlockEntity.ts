import {
    Block,
    Entity,
    EntityComponentTypes,
    EntityLoadAfterEvent,
    Vector3,
    world,
} from "@minecraft/server";
import { subscribeEvent, attachedBlockEntity } from "../lib/EventSubscriber";
import { offsetByDirection } from "../lib/DirectionUtil";
import { dropsItems, discard } from "../lib/EntityUtil";

@attachedBlockEntity({ eventTypes: ["farmersdelight:basket_tick"] })
export class BasketBlockEntity {
    static onDiscard(entity: Entity) {
        dropsItems(entity);
        discard(entity);
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
        const version = entity.getDynamicProperty("farmersdelight:storage_version") as number;
        if (version) return;
        entity.setDynamicProperty("farmersdelight:storage_version", 1);
        const pos = entity.getDynamicProperty("farmersdelight:blockEntityDataLocation");
        if (!pos) return;
        const block = entity.dimension.getBlock(pos as Vector3);
        if (!block) return;
        const permutation = block.permutation;
        switch (permutation.getState("minecraft:block_face")) {
            case "up":
                block.setPermutation(permutation.withState("minecraft:block_face", "down"));
                break;
            case "down":
                block.setPermutation(permutation.withState("minecraft:block_face", "up"));
                break;
        }
    }
}

void BasketBlockEntity;