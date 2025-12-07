import {
    Block,
    Dimension,
    Entity,
    EntityQueryOptions,
    EntityType,
    EntityTypes,
    Vector3,
} from "@minecraft/server";
import { resolveSpec, isSamePos, ComponentSpec } from "./ObjectUtil";
import { DynamicProperties } from "./DynamicProperties";

export function resolveBlockEntityType<T>(
    block: Block,
    spec: ComponentSpec<T> | undefined = resolveSpec<T>(block, "farmersdelight:block_entity"),
): EntityType | undefined {
    if (spec) {
        const type = EntityTypes.get(spec.toString());
        if (type) return type;
    }
    return EntityTypes.get(block.typeId);
}

export function initBlockEntity(block: Block, typeId: string): Entity {
    const pos = block.bottomCenter();
    const entity = block.dimension.spawnEntity(typeId, pos);
    entity.setDynamicProperties({
        [DynamicProperties.STORAGE_VERSION]: 1,
        [DynamicProperties.BLOCK_LOCATION]: pos,
    });
    return entity;
}

export function getBlockEntity<T>(block: Block, spec: ComponentSpec<T>): Entity | undefined {
    const id = resolveBlockEntityType(block, spec)?.id;
    if (!id) return undefined;
    const pos = block.bottomCenter();
    const candidates = block.dimension.getEntities({ location: pos, type: id });
    for (const candidate of candidates) {
        if (isSamePos(pos, candidate.getDynamicProperty(DynamicProperties.BLOCK_LOCATION))) return candidate;
    }
    return undefined;
}

/**
 * @deprecated
 */
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
