import {
    Block,
    Container, ContainerSlot,
    EnchantmentType,
    Entity,
    EntityComponentTypes,
    EntityInventoryComponent,
    EquipmentSlot,
    GameMode,
    ItemComponentTypes,
    ItemDurabilityComponent,
    ItemStack,
    Player,
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

function hurtItemInSlotImpl(stack: ItemStack | undefined, amount: number, avoidable: boolean, slot: SlotLike) {
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
    } else if (stack) {
        slot.setItem(undefined);
    }
}

export function hurtEquippedItem(
    entity: Entity,
    stack?: ItemStack,
    amount: number = 1,
    avoidable: boolean = true,
    slot: EquipmentSlot = EquipmentSlot.Mainhand,
) {
    hurtItemInSlotImpl(stack, amount, avoidable, {
        setItem(result) {
            entity.getComponent(EntityComponentTypes.Equippable)?.setEquipment(slot, result);
        },
    });
}

export function hurtItemInSlot(slot: ContainerSlot, stack?: ItemStack, amount: number = 1, avoidable: boolean = true) {
    hurtItemInSlotImpl(stack ?? slot.getItem(), amount, avoidable, slot);
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
    const $slot = entity.getComponent(EntityComponentTypes.Equippable)?.getEquipmentSlot(slot);
    return $slot ? takeItemInSlot($slot, desired, check) : desired;
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

export class ItemUtil {
    /**
     * @deprecated
     */
    public static damageItem(container: Container, index: number, damage: number = 1) {
        const itemStack: ItemStack | undefined = container.getItem(index);
        if (!itemStack) return;
        const durability: ItemDurabilityComponent | undefined = itemStack.getComponent(ItemDurabilityComponent.componentId) as ItemDurabilityComponent;
        if (!durability) return;
        if (durability.maxDurability > durability.damage) {
            durability.damage += damage;
            container.setItem(index, itemStack);
            return damage;
        } else {
            container.setItem(index, undefined);
            return durability.maxDurability;
        }
    }
    public static clearItem(container: Container, index: number, amount: number = 1) {
        const itemStack: ItemStack | undefined = container.getItem(index);
        if (!itemStack) return;
        const itemAmount: number = itemStack.amount;
        if (itemAmount > amount) {
            itemStack.amount = itemAmount - amount;
            container.setItem(index, itemStack);
            return amount;
        } else {
            container.setItem(index, undefined);
            return itemAmount;
        }
    }
    public static clearOffhandItem(player: Player, amount: number = 1) {
        const equip = player.getComponent('minecraft:equippable')
        const itemStack = equip?.getEquipment(EquipmentSlot.Offhand)
        if (!itemStack) return;
        const newItemStack = itemStack
        if (newItemStack.amount > amount) {
            newItemStack.amount = newItemStack.amount - amount;
            if (!equip?.setEquipment(EquipmentSlot.Offhand, newItemStack))
                player.runCommand(`/clear @s ${itemStack.typeId} 0 ${amount}`)
        } else {
            equip?.setEquipment(EquipmentSlot.Offhand, undefined)
        }
    }
    public static replaceItem(player: Player, slot: number, replaceItemStack: ItemStack) {
        const container = (player.getComponent("inventory") as EntityInventoryComponent)?.container;
        if (!container) return;
        const itemStack = container?.getItem(slot)
        if (!itemStack) return;
        if (player.getGameMode() == GameMode.Creative) return;
        const itemAmount = itemStack.amount;
        const amount = itemAmount - 1;

        if (amount <= 0) {
            container.setItem(slot, undefined);
        }
        else {
            let newItemStack = itemStack
            newItemStack.amount = amount
            container.setItem(slot, newItemStack);
        }
        container.addItem(replaceItemStack)

    }
}