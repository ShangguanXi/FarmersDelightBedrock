import {  Entity, Vector3, system, world } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { BlockEntity } from "./BlockEntity";
import { vanillaBlockList } from "../../data/recipe/cuttingBoardRecipe";


export class CuttingBoardBlockEntity extends BlockEntity {
    @methodEventSub(world.afterEvents.dataDrivenEntityTrigger, { entityTypes: ["farmersdelight:cutting_board"], eventTypes: ["farmersdelight:cutting_board_tick"] })
    tick(args: any) {
        const entityBlockData = super.blockEntityData(args.entity);
        if (!entityBlockData) return;
        const entity: Entity = entityBlockData.entity;
        const { x, y, z }: Vector3 = entity.location;
        const currentTick: number = system.currentTick % 2;
        const itemStack: string | undefined = JSON.parse(entity.getDynamicProperty('farmersdelight:blockEntityItemStackData') as string)["item"];
        if (!currentTick && itemStack) {
            const id = itemStack.split(':');
                const name = id[0] == 'minecraft' ? `farmersdelight:${id[0]}_${id[1]}` : itemStack;
                entity.dimension.spawnParticle(name, { x: x, y: y + 0.0563, z: z });
            
        };
        if(system.currentTick && itemStack){
            if (vanillaBlockList.includes(itemStack)){
                entity.dimension.spawnParticle(itemStack+'_top', { x: x, y: y + 0.1875, z: z });
                entity.dimension.spawnParticle(itemStack+'_south', { x: x, y: y + 0.1875, z: z });
                entity.dimension.spawnParticle(itemStack+'_north', { x: x, y: y + 0.1875, z: z });
                entity.dimension.spawnParticle(itemStack+'_east', { x: x, y: y + 0.1875, z: z });
                entity.dimension.spawnParticle(itemStack+'_west', { x: x, y: y + 0.1875, z: z });
            }
        };
        super.blockEntityLoot(entityBlockData, "farmersdelight:cutting_board", itemStack == "undefined" ? undefined : [itemStack]);
    }
}