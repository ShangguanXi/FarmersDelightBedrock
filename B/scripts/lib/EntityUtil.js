import { Direction, EntityComponentTypes, GameMode, } from "@minecraft/server";
export function getEquipment(entity, slot) {
    return entity?.getComponent(EntityComponentTypes.Equippable)?.getEquipment(slot);
}
export function getEquipmentSlot(entity, slot) {
    return entity?.getComponent(EntityComponentTypes.Equippable)?.getEquipmentSlot(slot);
}
export function hasLimitedMaterials(player) {
    return player.getGameMode() != GameMode.Creative;
}
export function horizontalDirectionOf(entity) {
    const rot = entity.getRotation().y;
    if (rot < -135)
        return Direction.North;
    if (rot < -45)
        return Direction.East;
    if (rot < 45)
        return Direction.South;
    if (rot < 135)
        return Direction.West;
    return Direction.North;
}
export function dropsItems(entity, container) {
    if (!container) {
        container = entity.getComponent(EntityComponentTypes.Inventory)?.container;
        if (!container)
            return;
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
