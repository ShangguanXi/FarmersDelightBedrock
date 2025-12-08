import {
    Container,
    ContainerSlot,
    Direction,
    Entity,
    EntityAttributeComponent,
    EntityComponentTypeMap,
    EntityComponentTypes,
    EquipmentSlot,
    GameMode,
    ItemStack,
    Player,
} from "@minecraft/server";

export function getEquipment(entity: Entity | undefined, slot: EquipmentSlot): ItemStack | undefined {
    return entity?.getComponent(EntityComponentTypes.Equippable)?.getEquipment(slot);
}

export function getEquipmentSlot(entity: Entity | undefined, slot: EquipmentSlot): ContainerSlot | undefined {
    return entity?.getComponent(EntityComponentTypes.Equippable)?.getEquipmentSlot(slot);
}

/**
 * 玩家是否材料有限（JE LivingEntity#hasInfiniteMaterials取反)
 */
export function hasLimitedMaterials(player: Player): boolean {
    return player.getGameMode() != GameMode.Creative;
}

/**
 * 返回实体水平朝向（JE LivingEntity#getDirecion)
 */
export function horizontalDirectionOf(entity: Entity): Direction {
    const rot = entity.getRotation().y;
    if (rot < -135) return Direction.North;
    if (rot < -45) return Direction.East;
    if (rot < 45) return Direction.South;
    if (rot < 135) return Direction.West;
    return Direction.North;
}

export function dropsItems(
    entity: Entity,
    container?: Container
) {
    if (!container) {
        container = entity.getComponent(EntityComponentTypes.Inventory)?.container
        if (!container) return;
    }
    const { dimension, location } = entity;
    for (let i = 0, size = container.size; i < size; ++i) {
        const stack = container.getItem(i);
        if (stack) {
            dimension.spawnItem(stack, location);
        }
    }
    container.clearAll();
}

type EntityAttributeComponentKeys = {
    [K in keyof EntityComponentTypeMap]: EntityComponentTypeMap[K] extends EntityAttributeComponent ? K : never
}[keyof EntityComponentTypeMap];

export function increaseAttribute(entity: Entity, attribute: EntityAttributeComponentKeys, delta: number) {
    const component = entity.getComponent(attribute);
    if (component) {
        const value = component.currentValue + delta, max = component.effectiveMax;
        component.setCurrentValue(value > max ? max : value);
    }
}
