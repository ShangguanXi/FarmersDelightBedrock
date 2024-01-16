import { world } from "@minecraft/server";
import ObjectUtil from "../lib/ObjectUtil";
const scoreboard = world.scoreboard;
export class BlockWithEntity {
    setBlock(args, location, entityId) {
        const entity = args.block.dimension.spawnEntity(entityId, location);
        entity.setDynamicProperty("farmersdelight:blockEntityDataLocation", location);
        entity.setDynamicProperty("farmersdelight:entityId", entity.id);
        return entity;
    }
    entityBlockData(args, opt) {
        const block = args.block;
        const dimension = block.dimension;
        const worldEntities = dimension.getEntities(opt);
        let entityBlock = undefined;
        for (const entity of worldEntities) {
            if (ObjectUtil.isEqual(entity.getDynamicProperty('farmersdelight:blockEntityDataLocation'), entity.location) && entity.id == entity.getDynamicProperty("farmersdelight:entityId")) {
                entityBlock = entity;
                break;
            }
        }
        if (!entityBlock)
            return undefined;
        const scoreboardObjective = scoreboard.getObjective(entityBlock.typeId + entityBlock.id) ?? null;
        const blockEntityDataLocation = entityBlock.getDynamicProperty('farmersdelight:blockEntityDataLocation');
        return { block: block, dimension: dimension, entity: entityBlock, scoreboardObjective: scoreboardObjective, blockEntityDataLocation: blockEntityDataLocation };
    }
}
//# sourceMappingURL=BlockWithEntity.js.map