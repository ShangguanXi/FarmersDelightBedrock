import { Block, Dimension, Entity, EntityQueryOptions, ScoreboardObjective, Vector3, world } from "@minecraft/server";
import ObjectUtil from "../lib/ObjectUtil";

const scoreboard = world.scoreboard;
export class BlockWithEntity {
    //名为setblock实际上是放置对应方块实体的实体，若成功则返回放置的实体
    public setBlock(dimension: Dimension, location: Vector3, entityId: string): Entity {
        const entity: Entity = dimension.spawnEntity(entityId, location);
        entity.setDynamicProperty("farmersdelight:blockEntityDataLocation", location);
        entity.setDynamicProperty("farmersdelight:entityId", entity.id);
        return entity
    }
    //获取方块实体数据
    public entityBlockData(block: Block, opt: EntityQueryOptions) {
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

interface BlockEntityData{
    readonly entity: Entity,
    readonly dimension: Dimension, 
    readonly blockEntityDataLocation: Vector3, 
    readonly block: Block, 
    readonly scoreboardObjective: ScoreboardObjective | null
}