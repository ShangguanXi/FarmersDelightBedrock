
export function claerItem( container, index, amount = 1) {
    const itemStack = container.getItem(index);
    const itemAmount = itemStack.amount;
    if (itemAmount > amount) {
        itemStack.amount = itemAmount - amount;
        container.setItem(index, itemStack);
        return amount;
    } else {
        container.setItem(index, undefined);
        return itemAmount;
    }
}

export function damageItem( container, index, damage = 1) {
    const itemStack = container.getItem(index);
    const durability = itemStack.getComponent("minecraft:durability");
    if (durability.maxDurability > durability.damage) {
        durability.damage += damage;
        container.setItem(index, itemStack);
        return damage;
    } else {
        container.setItem(index, undefined);
        return durability.maxDurability;
    }
}