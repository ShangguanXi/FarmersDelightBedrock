import ObjectUtil from "../lib/ObjectUtil";
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
            if (ObjectUtil.isEqual(entity.getDynamicProperty('farmersdelight:blockEntityDataLocation'), entity.location) &&
                entity.id == entity.getDynamicProperty("farmersdelight:entityId") &&
                entity.typeId == opt.type) {
                entityBlock = entity;
                break;
            }
            ;
        }
        ;
        if (!entityBlock)
            return undefined;
        const blockEntityDataLocation = entityBlock.getDynamicProperty('farmersdelight:blockEntityDataLocation');
        return { block: block, dimension: dimension, entity: entityBlock, blockEntityDataLocation: blockEntityDataLocation };
    }
}
//# sourceMappingURL=BlockWithEntity.js.map