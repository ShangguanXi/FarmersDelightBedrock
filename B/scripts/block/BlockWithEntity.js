import { world } from "@minecraft/server";
import ObjectUtil from "../lib/ObjectUtil";
const scoreboard = world.scoreboard;
export class BlockWithEntity {
    //替代原SAPI放置方块的方式，返回对应方块实体的实体
    setBlock(args, location, entityId) {
        const entity = args.block.dimension.spawnEntity(entityId, location);
        entity.setDynamicProperty("farmersdelight:blockEntityDataLocation", location);
        entity.setDynamicProperty("farmersdelight:entityId", entity.id);
        return entity;
    }
    //获取方块实体数据
    entityBlockData(args, opt) {
        const block = args.block;
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
        const scoreboardObjective = scoreboard.getObjective(entityBlock.typeId + entityBlock.id) ?? null;
        const blockEntityDataLocation = entityBlock.getDynamicProperty('farmersdelight:blockEntityDataLocation');
        return { block: block, dimension: dimension, entity: entityBlock, scoreboardObjective: scoreboardObjective, blockEntityDataLocation: blockEntityDataLocation };
    }
}
//# sourceMappingURL=BlockWithEntity.js.map