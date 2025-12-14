import {
    Block,
    Container,
    ContainerSlot,
    EnchantmentType,
    Entity,
    EntityComponentTypes,
    EquipmentSlot,
    ItemComponentTypes,
    ItemStack,
    Vector3,
} from "@minecraft/server";

export function enchantmentLevelOf(stack: ItemStack | undefined, enchantment: string | EnchantmentType): number {
    const instance = stack?.getComponent(ItemComponentTypes.Enchantable)?.getEnchantment(enchantment);
    return instance ? instance.level : 0;
}

export function isEnchanted(stack: ItemStack | undefined, enchantment: string | EnchantmentType): boolean | undefined {
    return stack?.getComponent(ItemComponentTypes.Enchantable)?.hasEnchantment(enchantment);
}

type SlotLike = {
    setItem: (stack?: ItemStack) => void;
}

function hurtItemInSlotImpl(stack: ItemStack | undefined, amount: number, consumable: boolean, avoidable: boolean, slot: SlotLike) {
    const durability = stack?.getComponent(ItemComponentTypes.Durability);
    if (durability) {
        // 即将到来 if (durability.unbreakable) return;
        let damage = 0;
        if (avoidable) {
            const chance = durability.getDamageChance(Math.min(enchantmentLevelOf(stack, "unbreaking"), 3));
            while (amount-- > 0) {
                if (Math.random() < chance) {
                    ++damage;
                }
            }
            if (!damage) return;
            damage += durability.damage;
        } else {
            damage = durability.damage + amount;
        }
        if (durability.maxDurability < damage) {
            slot.setItem(undefined);
        } else {
            durability.damage = damage;
            slot.setItem(stack);
        }
    } else if (consumable && stack) {
        slot.setItem(undefined);
    }
}

/**
 * @deprecated 应直接调用{@link hurtItemInSlot}
 */
export function hurtItem(container: Container, index: number, amount: number = 1) {
    hurtItemInSlot(container.getSlot(index), undefined, amount);
}

export function hurtEquippedItem(
    entity: Entity,
    stack?: ItemStack,
    amount: number = 1,
    consumable: boolean = false,
    avoidable: boolean = true,
    slot: EquipmentSlot = EquipmentSlot.Mainhand,
) {
    hurtItemInSlotImpl(stack, amount, consumable, avoidable, {
        setItem(result) {
            entity.getComponent(EntityComponentTypes.Equippable)?.setEquipment(slot, result);
        },
    });
}

export function hurtItemInSlot(
    slot: ContainerSlot,
    stack?: ItemStack,
    amount: number = 1,
    consumable: boolean = false,
    avoidable: boolean = true,
) {
    hurtItemInSlotImpl(stack ?? slot.getItem(), amount, consumable, avoidable, slot);
}

/**
 * @param slot 物品所在槽位
 * @param desired 取出的物品数量
 * @param check 是否在访问物品数量前检测有无物品
 * @return 仍需取出的物品量
 */
export function takeItemInSlot(slot: ContainerSlot, desired: number = 1, check: boolean = true): number {
    if (check && !slot.hasItem()) return desired;
    const remaining = slot.amount;
    if (remaining > desired) {
        slot.amount = remaining - desired;
        return 0;
    }
    slot.setItem(undefined);
    return desired - remaining;
}

/**
 * @param entity 目标实体
 * @param slot 物品所在槽位
 * @param desired 取出的物品数量
 * @param check 是否在访问物品数量前检测有无物品
 * @return 仍需取出的物品量
 */
export function takeEquippedItem(
    entity: Entity,
    slot: EquipmentSlot = EquipmentSlot.Mainhand,
    desired: number = 1,
    check: boolean = true,
): number {
    const proxy = entity.getComponent(EntityComponentTypes.Equippable)?.getEquipmentSlot(slot);
    return proxy ? takeItemInSlot(proxy, desired, check) : desired;
}

/**
 * @param container 物品所在容器
 * @param slot 物品所在槽位
 * @param desired 取出的物品数量
 * @param check 是否在访问物品数量前检测有无物品
 * @return 仍需取出的物品量
 */
export function takeItem(
    container: Container,
    slot: number,
    desired: number = 1,
    check: boolean = true,
): number {
    const proxy = container.getSlot(slot);
    return proxy ? takeItemInSlot(proxy, desired, check) : desired;
}

/**
 * @return 仍需给予玩家的物品
 */
export function convertItemInSlot(slot: ContainerSlot, result: ItemStack, check = true): ItemStack | undefined {
    if (check && !slot.hasItem()) return undefined;
    const remaining = slot.amount - 1;
    if (remaining) {
        slot.amount = remaining;
        return result;
    }
    slot.setItem(result);
    return undefined;
}

/**
 * @return 仍需给予玩家的物品
 */
export function giveItem(entity: Entity, stack: ItemStack | undefined, container?: Container): ItemStack | undefined {
    if (!container) {
        container = entity.getComponent(EntityComponentTypes.Inventory)?.container;
        if (!container) return stack;
    }
    if (stack) {
        stack = container.addItem(stack);
        if (stack) {
            entity.dimension.spawnItem(stack, entity.location);
        }
    }
    return undefined;
}

export function spawnStack(
    stack: ItemStack,
    source: Block | Entity,
    pos: Vector3 = source instanceof Entity
        ? source.location
        : Math.random() < 0.5
            ? source.center()
            : source.bottomCenter(),
): Entity | undefined {
    try {
        return source.dimension.spawnItem(stack, pos);
    } catch {
        return undefined;
    }
}
