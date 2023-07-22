
export function claerItem(id, container, index, amount = 1) {
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