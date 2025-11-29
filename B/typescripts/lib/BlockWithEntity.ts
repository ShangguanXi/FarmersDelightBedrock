import {
    Block,
    Dimension,
    Entity,
    EntityQueryOptions,
    EntityType,
    EntityTypes,
    Vector3,
} from "@minecraft/server";
import { resolveSpec, isSamePos } from "./ObjectUtil";

export function getBlockEntityType(
    block: Block,
    params: unknown = resolveSpec(block, "farmersdelight:block_entity"),
): EntityType | undefined {
    if (params) {
        const type = EntityTypes.get(params.toString())
        if (type) return type;
    }
    return EntityTypes.get(block.typeId);
}

export function initBlockEntity(block: Block, typeId: string): Entity {
    const pos = block.bottomCenter();
    const impl = block.dimension.spawnEntity(typeId, pos);
    impl.setDynamicProperty("farmersdelight:blockEntityDataLocation", pos);
    impl.setDynamicProperty("farmersdelight:entityId", impl.id);
    impl.setDynamicProperty("farmersdelight:storage_version", 1);
    return impl;
}

export function getBlockEntity(block: Block, typeId: string): Entity | undefined {
    const pos = block.bottomCenter();
    const candidates = block.dimension.getEntities({ location: pos, type: typeId });
    for (const candidate of candidates) {
        if (candidate.id !== candidate.getDynamicProperty("farmersdelight:entityId")) continue;
        if (isSamePos(pos, candidate.getDynamicProperty("farmersdelight:blockEntityDataLocation"))) {
            return candidate;
        }
    }
    return undefined;
}

export class BlockWithEntity {
    //名为setblock实际上是放置对应方块实体的实体，若成功则返回放置的实体
    public setBlock(dimension: Dimension, location: Vector3, entityId: string): Entity {
        const entity: Entity = dimension.spawnEntity(entityId, location);
        entity.setDynamicProperty("farmersdelight:blockEntityDataLocation", location);
        entity.setDynamicProperty("farmersdelight:entityId", entity.id);
        return entity;
    }

    //获取方块实体数据
    public entityBlockData(block: Block, opt: EntityQueryOptions) {
        const dimension = block.dimension;
        const entities = dimension.getEntitiesAtBlockLocation(opt.location as Vector3);
        let entityBlock: Entity | undefined = undefined;
        for (const entity of entities) {
            if (
                isSamePos(entity.location, entity.getDynamicProperty("farmersdelight:blockEntityDataLocation")) &&
                entity.id == entity.getDynamicProperty("farmersdelight:entityId") &&
                entity.typeId == opt.type
            ) {
                entityBlock = entity;
                break;
            }
        }
        if (!entityBlock) return undefined;
        const blockEntityDataLocation: Vector3 = entityBlock.getDynamicProperty("farmersdelight:blockEntityDataLocation") as Vector3;
        return {
            block: block,
            dimension: dimension,
            entity: entityBlock,
            blockEntityDataLocation: blockEntityDataLocation,
        };
    }
}
