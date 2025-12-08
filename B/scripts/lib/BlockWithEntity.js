import { EntityTypes, } from "@minecraft/server";
import { resolveSpec, isSamePos } from "./ObjectUtil";
export function resolveBlockEntityType(block, spec = resolveSpec(block, "farmersdelight:block_entity")) {
    if (spec) {
        const type = EntityTypes.get(spec.toString());
        if (type)
            return type;
    }
    return EntityTypes.get(block.typeId);
}
export function initBlockEntity(block, typeId) {
    const pos = block.bottomCenter();
    const entity = block.dimension.spawnEntity(typeId, pos);
    entity.setDynamicProperties({
        ["farmersdelight:storage_version"]: 1,
        ["farmersdelight:blockEntityDataLocation"]: pos,
    });
    return entity;
}
export function getBlockEntity(block, spec) {
    const id = resolveBlockEntityType(block, spec)?.id;
    if (!id)
        return undefined;
    const pos = block.bottomCenter();
    const candidates = block.dimension.getEntities({ location: pos, type: id });
    for (const candidate of candidates) {
        if (isSamePos(pos, candidate.getDynamicProperty("farmersdelight:blockEntityDataLocation")))
            return candidate;
    }
    return undefined;
}
export class BlockWithEntity {
    setBlock(dimension, location, entityId) {
        const entity = dimension.spawnEntity(entityId, location);
        entity.setDynamicProperty("farmersdelight:blockEntityDataLocation", location);
        entity.setDynamicProperty("farmersdelight:entityId", entity.id);
        return entity;
    }
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
