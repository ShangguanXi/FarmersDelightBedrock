import { Container, GameMode, ItemDurabilityComponent, ItemStack, ItemType, Player } from "@minecraft/server";


export class ItemUtil {
    public static damageItem(container: Container, index: number, damage: number = 1) {
        const itemStack: ItemStack | undefined = container.getItem(index);
        if (!itemStack) return;
        const durability: ItemDurabilityComponent | undefined = itemStack.getComponent(ItemDurabilityComponent.componentId);
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
    public static replaceItem(player: Player, slot: number, newItemStack: ItemStack) {
        const container = player.getComponent("inventory")?.container;
        if (!container) return;
        const itemStack = container?.getItem(slot)
        if (!itemStack) return;
        container.addItem(newItemStack)
        if (player.getGameMode() == GameMode.creative) return;
        const itemAmount = itemStack.amount;
        itemStack.amount = itemAmount - 1;
        container.setItem(slot, itemStack);
    }
}