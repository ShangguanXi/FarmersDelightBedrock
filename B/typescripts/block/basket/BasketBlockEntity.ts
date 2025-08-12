import { Entity, PlayerInteractWithEntityAfterEvent, world } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { BlockEntity } from "../../lib/BlockEntity";


export class BasketBlockEntity extends BlockEntity {
    @methodEventSub(world.afterEvents.dataDrivenEntityTrigger, { eventTypes: ["farmersdelight:basket_tick"] })
    tick(args: any) {
        const entityBlockData = super.blockEntityData(args.entity);
        if (!entityBlockData) return;
        const entity: Entity = entityBlockData.entity;
        super.entityContainerLoot(entityBlockData, entity.typeId);
        const location = entity.location
        const List = entity.dimension.getEntitiesAtBlockLocation(location)
        const block = entityBlockData.block
        if (!block) return;
        const face = block.permutation.getState("minecraft:block_face");
        if (!face) return;
        const baseLoc = {
            x: Math.floor(block.location.x),
            y: Math.floor(block.location.y),
            z: Math.floor(block.location.z)
        };
        const offsets:{ [key: string]: { x: number; y: number; z: number } }= {
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
            if (e.typeId!= "minecraft:item") continue
            else{
                const itemStack = e.getComponent("minecraft:item")?.itemStack
                if (!itemStack) continue
                const container = entity.getComponent("minecraft:inventory")?.container
                if (!container) continue
                if (container.firstEmptySlot()==undefined) continue
                entity.getComponent("minecraft:inventory")?.container.addItem(itemStack)
                e.remove()
            }

        }
    }

}