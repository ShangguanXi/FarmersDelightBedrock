import { GameMode, ItemDurabilityComponent } from "@minecraft/server";
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
    static replaceItem(player, slot, newItemStack) {
        const container = player.getComponent("inventory")?.container;
        if (!container)
            return;
        const itemStack = container?.getItem(slot);
        if (!itemStack)
            return;
        container.addItem(newItemStack);
        if (player.getGameMode() == GameMode.creative)
            return;
        const itemAmount = itemStack.amount;
        itemStack.amount = itemAmount - 1;
        container.setItem(slot, itemStack);
    }
}
//# sourceMappingURL=ItemUtil.js.map