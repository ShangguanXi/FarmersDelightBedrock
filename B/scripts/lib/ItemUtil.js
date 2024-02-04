import { ItemDurabilityComponent } from "@minecraft/server";
export class ItemUtil {
    static damageItem(container, index, damage = 1) {
        const itemStack = container.getItem(index);
        if (!itemStack)
            return;
        const durability = itemStack.getComponent(ItemDurabilityComponent.componentId);
        if (!durability)
            return;
        if (durability.maxDurability > durability.damage) {
            durability.damage += damage;
            container.setItem(index, itemStack);
            return damage;
        }
        else {
            container.setItem(index, undefined);
            return durability.maxDurability;
        }
    }
    static clearItem(container, index, amount = 1) {
        const itemStack = container.getItem(index);
        if (!itemStack)
            return;
        const itemAmount = itemStack.amount;
        if (itemAmount > amount) {
            itemStack.amount = itemAmount - amount;
            container.setItem(index, itemStack);
            return amount;
        }
        else {
            container.setItem(index, undefined);
            return itemAmount;
        }
    }
}
//# sourceMappingURL=ItemUtil.js.map