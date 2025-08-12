import { Block, EquipmentSlot, GameMode, ItemDurabilityComponent, ItemStack } from "@minecraft/server";
import { RandomUtil } from "./RandomUtil";
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
    static clearOffhandItem(player, amount = 1) {
        const equip = player.getComponent('minecraft:equippable');
        const itemStack = equip?.getEquipment(EquipmentSlot.Offhand);
        if (!itemStack)
            return;
        const newItemStack = itemStack;
        if (newItemStack.amount > amount) {
            newItemStack.amount = newItemStack.amount - amount;
            if (!equip?.setEquipment(EquipmentSlot.Offhand, newItemStack))
                player.runCommand(`/clear @s ${itemStack.typeId} 0 ${amount}`);
        }
        else {
            equip?.setEquipment(EquipmentSlot.Offhand, undefined);
        }
    }
    static replaceItem(player, slot, replaceItemStack) {
        const container = player.getComponent("inventory")?.container;
        if (!container)
            return;
        const itemStack = container?.getItem(slot);
        if (!itemStack)
            return;
        if (player.getGameMode() == GameMode.Creative)
            return;
        const itemAmount = itemStack.amount;
        const amount = itemAmount - 1;
        if (amount <= 0) {
            container.setItem(slot, undefined);
        }
        else {
            let newItemStack = itemStack;
            newItemStack.amount = amount;
            container.setItem(slot, newItemStack);
        }
        container.addItem(replaceItemStack);
    }
    static spawnItem(target, item, number = 1, location) {
        const dimension = target.dimension;
        const spawnPos = location ?? (target instanceof Block ? (RandomUtil.probability(50) ? target.center() : target.bottomCenter()) : target.location);
        const stack = item instanceof ItemStack ? item : new ItemStack(item, number);
        try {
            return dimension.spawnItem(stack, spawnPos);
        }
        catch (error) {
            return undefined;
        }
    }
}
//# sourceMappingURL=ItemUtil.js.map