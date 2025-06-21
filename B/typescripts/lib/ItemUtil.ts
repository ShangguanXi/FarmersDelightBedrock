import { Block, Container, Entity, EntityInventoryComponent, EquipmentSlot, GameMode, ItemDurabilityComponent, ItemStack, ItemType, Player, Vector3 } from "@minecraft/server";
import { RandomUtil } from "./RandomUtil";


export class ItemUtil {
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
    public static spawnItem(target: Block | Entity, item: string | ItemStack, number: number = 1, location: Vector3 | undefined = undefined) {
        if (!location) {
            if (item instanceof ItemStack) {
                if (target instanceof Block) {
                    if (RandomUtil.probability(50)) {
                        target.dimension.spawnItem(item, target.center());
                    }
                    else {
                        target.dimension.spawnItem(item, target.bottomCenter());
                    };

                };
                if (target instanceof Entity) {
                    target.dimension.spawnItem(item, target.location);
                };
            }
            else {
                if (target instanceof Block) {
                    if (RandomUtil.probability(50)) {
                        target.dimension.spawnItem(new ItemStack(item, number), target.center());
                    }
                    else {
                        target.dimension.spawnItem(new ItemStack(item, number), target.bottomCenter());
                    };
                }
                if (target instanceof Entity) {
                    target.dimension.spawnItem(new ItemStack(item, number), target.location);
                };
            }
        }
        else {
            if (item instanceof ItemStack) {
                target.dimension.spawnItem(item, location);
            }
            else {
                target.dimension.spawnItem(new ItemStack(item, number), location);
            };
        };

    }
}