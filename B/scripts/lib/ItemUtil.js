import { Block, Entity, GameMode, ItemDurabilityComponent, ItemStack } from "@minecraft/server";
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
    static spawnItem(target, item, number = 1, location = undefined) {
        if (!location) {
            if (item instanceof ItemStack) {
                if (target instanceof Block) {
                    if (RandomUtil.probability(50)) {
                        target.dimension.spawnItem(item, target.center());
                    }
                    else {
                        target.dimension.spawnItem(item, target.bottomCenter());
                    }
                    ;
                }
                ;
                if (target instanceof Entity) {
                    target.dimension.spawnItem(item, target.location);
                }
                ;
            }
            else {
                if (target instanceof Block) {
                    if (RandomUtil.probability(50)) {
                        target.dimension.spawnItem(new ItemStack(item, number), target.center());
                    }
                    else {
                        target.dimension.spawnItem(new ItemStack(item, number), target.bottomCenter());
                    }
                    ;
                }
                if (target instanceof Entity) {
                    target.dimension.spawnItem(new ItemStack(item, number), target.location);
                }
                ;
            }
        }
        else {
            if (item instanceof ItemStack) {
                target.dimension.spawnItem(item, location);
            }
            else {
                target.dimension.spawnItem(new ItemStack(item, number), location);
            }
            ;
        }
        ;
    }
}
//# sourceMappingURL=ItemUtil.js.map