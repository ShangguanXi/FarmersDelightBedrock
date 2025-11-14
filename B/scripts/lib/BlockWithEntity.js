import { EntityTypes, } from "@minecraft/server";
import { isSamePos } from "./ObjectUtil";
export function getBlockEntityType(block, params = block.getComponent("farmersdelight:block_entity")?.customComponentParameters?.params) {
    if (params) {
        const type = EntityTypes.get(params.toString());
        if (type)
            return type;
    }
    return EntityTypes.get(block.typeId);
}
export function initBlockEntity(block, typeId) {
    const pos = block.bottomCenter();
    const impl = block.dimension.spawnEntity(typeId, pos);
    impl.setDynamicProperty("farmersdelight:blockEntityDataLocation", pos);
    impl.setDynamicProperty("farmersdelight:entityId", impl.id);
    impl.setDynamicProperty("farmersdelight:storage_version", 1);
    return impl;
}
export function getBlockEntity(block, typeId) {
    const pos = block.bottomCenter();
    const candidates = block.dimension.getEntities({ location: pos, type: typeId });
    for (const candidate of candidates) {
        if (candidate.id !== candidate.getDynamicProperty("farmersdelight:entityId"))
            continue;
        if (isSamePos(pos, candidate.getDynamicProperty("farmersdelight:blockEntityDataLocation"))) {
            return candidate;
        }
    }
    return undefined;
}
export class BlockWithEntity {
    //名为setblock实际上是放置对应方块实体的实体，若成功则返回放置的实体
    setBlock(dimension, location, entityId) {
        const entity = dimension.spawnEntity(entityId, location);
        entity.setDynamicProperty("farmersdelight:blockEntityDataLocation", location);
        entity.setDynamicProperty("farmersdelight:entityId", entity.id);
        return entity;
    }
    //获取方块实体数据
    entityBlockData(block, opt) {
        const dimension = block.dimension;
        const entities = dimension.getEntitiesAtBlockLocation(opt.location);
        let entityBlock = undefined;
        for (const entity of entities) {
            if (isSamePos(entity.location, entity.getDynamicProperty("farmersdelight:blockEntityDataLocation")) &&
                entity.id == entity.getDynamicProperty("farmersdelight:entityId") &&
                entity.typeId == opt.type) {
                entityBlock = entity;
                break;
            }
        }
        if (!entityBlock)
            return undefined;
        const blockEntityDataLocation = entityBlock.getDynamicProperty("farmersdelight:blockEntityDataLocation");
        return {
            block: block,
            dimension: dimension,
            entity: entityBlock,
            blockEntityDataLocation: blockEntityDataLocation,
        };
    }
}
