import { Block, Entity, EntityQueryOptions, ScoreboardObjective, Vector3, world } from "@minecraft/server";
import ObjectUtil from "../lib/ObjectUtil";

const scoreboard = world.scoreboard;
export class BlockWithEntity {
    //替代原SAPI放置方块的方式，返回对应方块实体的实体
    public setBlock(args: any, location: Vector3, entityId: string): Entity {
        const entity: Entity = args.block.dimension.spawnEntity(entityId, location);
        entity.setDynamicProperty("farmersdelight:blockEntityDataLocation", location);
        entity.setDynamicProperty("farmersdelight:entityId", entity.id);
        return entity
    }
    //获取方块实体数据
    public entityBlockData(args: any, opt: EntityQueryOptions) {
        const block: Block = args.block;
        const dimension = block.dimension;
        const entities = dimension.getEntitiesAtBlockLocation(opt.location as Vector3);
        let entityBlock: Entity | undefined = undefined;
        for (const entity of entities) {
            if (
                ObjectUtil.isEqual(entity.getDynamicProperty('farmersdelight:blockEntityDataLocation'), entity.location) && 
                entity.id == entity.getDynamicProperty("farmersdelight:entityId") &&
                entity.typeId == opt.type
                ) {
                entityBlock = entity;
                break;
            };
        };
        if (!entityBlock) return undefined;
        const scoreboardObjective: ScoreboardObjective | null = scoreboard.getObjective(entityBlock.typeId + entityBlock.id) ?? null;
        const blockEntityDataLocation: Vector3 = entityBlock.getDynamicProperty('farmersdelight:blockEntityDataLocation') as Vector3;
        return { block: block, dimension: dimension, entity: entityBlock, scoreboardObjective: scoreboardObjective, blockEntityDataLocation: blockEntityDataLocation };
    }
} 