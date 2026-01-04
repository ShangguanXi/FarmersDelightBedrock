import { Entity, EntityComponentTypes, EquipmentSlot, ItemComponentTypes, } from "@minecraft/server";
export function enchantmentLevelOf(stack, enchantment) {
    const instance = stack?.getComponent(ItemComponentTypes.Enchantable)?.getEnchantment(enchantment);
    return instance ? instance.level : 0;
}
export function isEnchanted(stack, enchantment) {
    return stack?.getComponent(ItemComponentTypes.Enchantable)?.hasEnchantment(enchantment);
}
function hurtItemInSlotImpl(stack, amount, consumable, avoidable, slot) {
    const durability = stack?.getComponent(ItemComponentTypes.Durability);
    if (durability) {
        let damage = 0;
        if (avoidable) {
            const chance = durability.getDamageChance(Math.min(enchantmentLevelOf(stack, "unbreaking"), 3));
            while (amount-- > 0) {
                if (Math.random() < chance) {
                    ++damage;
                }
            }
            if (!damage)
                return;
            damage += durability.damage;
        }
        else {
            damage = durability.damage + amount;
        }
        if (durability.maxDurability < damage) {
            slot.setItem(undefined);
        }
        else {
            durability.damage = damage;
            slot.setItem(stack);
        }
    }
    else if (consumable && stack) {
        slot.setItem(undefined);
    }
}
export function hurtItem(container, index, amount = 1) {
    hurtItemInSlot(container.getSlot(index), undefined, amount);
}
export function hurtEquippedItem(entity, stack, amount = 1, consumable = false, avoidable = true, slot = EquipmentSlot.Mainhand) {
    hurtItemInSlotImpl(stack, amount, consumable, avoidable, {
        setItem(result) {
            entity.getComponent(EntityComponentTypes.Equippable)?.setEquipment(slot, result);
        },
    });
}
export function hurtItemInSlot(slot, stack, amount = 1, consumable = false, avoidable = true) {
    hurtItemInSlotImpl(stack ?? slot.getItem(), amount, consumable, avoidable, slot);
}
export function takeItemInSlot(slot, desired = 1, check = true) {
    if (check && !slot.hasItem())
        return desired;
    const remaining = slot.amount;
    if (remaining > desired) {
        slot.amount = remaining - desired;
        return 0;
    }
    slot.setItem(undefined);
    return desired - remaining;
}
export function takeEquippedItem(entity, slot = EquipmentSlot.Mainhand, desired = 1, check = true) {
    const proxy = entity.getComponent(EntityComponentTypes.Equippable)?.getEquipmentSlot(slot);
    return proxy ? takeItemInSlot(proxy, desired, check) : desired;
}
export function takeItem(container, slot, desired = 1, check = true) {
    const proxy = container.getSlot(slot);
    return proxy ? takeItemInSlot(proxy, desired, check) : desired;
}
export function convertItemInSlot(slot, result, check = true) {
    if (check && !slot.hasItem())
        return undefined;
    const remaining = slot.amount - 1;
    if (remaining) {
        slot.amount = remaining;
        return result;
    }
    slot.setItem(result);
    return undefined;
}
export function giveItem(entity, stack, container) {
    if (!container) {
        container = entity.getComponent(EntityComponentTypes.Inventory)?.container;
        if (!container)
            return stack;
    }
    if (stack) {
        stack = container.addItem(stack);
        if (stack) {
            entity.dimension.spawnItem(stack, entity.location);
        }
    }
    return undefined;
}
export function spawnStack(stack, source, pos = source instanceof Entity
    ? source.location
    : Math.random() < 0.5
        ? source.center()
        : source.bottomCenter()) {
    try {
        return source.dimension.spawnItem(stack, pos);
    }
    catch {
        return undefined;
    }
}
