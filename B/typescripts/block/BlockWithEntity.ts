import { Block, Entity, EntityQueryOptions, ScoreboardObjective, Vector3, world } from "@minecraft/server";
import ObjectUtil from "../lib/ObjectUtil";

const scoreboard = world.scoreboard;
export class BlockWithEntity {
    public setBlock(args: any, location: Vector3, entityId: string): Entity {
        const entity: Entity = args.block.dimension.spawnEntity(entityId, location);
        entity.setDynamicProperty("farmersdelight:blockEntityDataLocation", location);
        entity.setDynamicProperty("farmersdelight:entityId", entity.id);
        return entity
    }
    public entityBlockData(args: any, opt: EntityQueryOptions) {
        const block: Block = args.block;
        const dimension = block.dimension;
        const worldEntities = dimension.getEntities(opt);
        let entityBlock: Entity | undefined = undefined;
        for (const entity of worldEntities) {
            if (ObjectUtil.isEqual(entity.getDynamicProperty('farmersdelight:blockEntityDataLocation'), entity.location) && entity.id == entity.getDynamicProperty("farmersdelight:entityId")) {
                entityBlock = entity;
                break;
            }
        }
        if (!entityBlock) return undefined;
        const scoreboardObjective: ScoreboardObjective | null = scoreboard.getObjective(entityBlock.id) ?? null;
        const blockEntityDataLocation: Vector3 = entityBlock.getDynamicProperty('farmersdelight:blockEntityDataLocation') as Vector3;
        return { block: block, dimension: dimension, entity: entityBlock, scoreboardObjective: scoreboardObjective, blockEntityDataLocation: blockEntityDataLocation };
    }
} 