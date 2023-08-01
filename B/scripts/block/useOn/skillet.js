import BlockEntity from "../../lib/BlockEntity";
import { vanillaItemList } from '../../data/recipe/skilletRecipe'
import { claerItem } from '../../lib/itemUtil';
import { MolangVariableMap, ItemStack } from "@minecraft/server";

const molang = new MolangVariableMap();

export function skillet(player, itemStack, block) {
    const location = block.location;
    const container = player.getComponent('inventory').container;
    const blockEntity = new BlockEntity(
        'farmersdelight:skillet',
        player.dimension,
        {
            location: location
        }
    );
    const entity = blockEntity.entity;
    const map = blockEntity.getDataMap('nbt');
    if (entity && map) {
        const inventory = map.get('nbt');
        if (vanillaItemList.includes(itemStack.typeId) || itemStack.hasTag('can_cooking')) {
            const maxAmount = itemStack.maxAmount;
            const removeAmount = maxAmount - inventory.amount;
            if (inventory.item == 'undefined') {
                const amount = itemStack.amount;
                inventory.item = itemStack.typeId;
                inventory.amount = amount;
                inventory.inventory.push(`{"number":${amount},"cookTime":30}`);
                entity.addTag(`{"nbt":${JSON.stringify(inventory)}}`);
                // if (entity.removeTag('{"nbt":{"item":"undefined","amount":0,"inventory":[]}}')) {
                //     entity.addTag(`{"nbt":{"item":"${itemStack.typeId}","amount":${amount},"inventory":[{"number":${amount},"cookTime":30}]}}`);
                // }
                claerItem(container, player.selectedSlot, amount);
                // if (entity.hasTag(`{"nbt":${JSON.stringify(inventory)}}`)) {
                //     console.warn(1);
                // }
                // if (entity.hasTag(`{"nbt":{"item":"${itemStack.typeId}","amount":${amount},"inventory":[{"number":${amount},"cookTime":30}]}}`)) {
                //     console.warn(2);
                // }
                console.warn(`{"nbt":${JSON.stringify(inventory)}}`);
            } else if (removeAmount) {
                entity.removeTag(`{"nbt":${JSON.stringify(inventory)}}`);
                const amount = itemStack.amount;
                if (amount >= removeAmount) {
                    inventory.amount = maxAmount;
                    inventory.inventory.push(`{"number":${removeAmount},"cookTime":30}`);
                    entity.addTag(`{"nbt":${JSON.stringify(inventory)}}`);
                    entity.addTag(`{"nbt":${JSON.stringify(inventory)}}`);
                    claerItem(container, player.selectedSlot, removeAmount);
                } else {
                    inventory.amount += amount;
                    inventory.inventory.push(`{"number":${amount},"cookTime":30}`);
                    entity.addTag(`{"nbt":${JSON.stringify(inventory)}}`);
                    claerItem(container, player.selectedSlot, amount);
                }
            }
        }
        if (inventory.item && itemStack.typeId != inventory.item) {
            entity.removeTag(`{"nbt":${JSON.stringify(inventory)}}`);
            for (let i = 0; i < inventory.amount; i++) {
                entity.dimension.spawnItem(new ItemStack(inventory.item), entity.location);
            }
            entity.addTag('{"nbt":{"item":"undefined","amount":0,"inventory":[]}}');
        }
        console.warn(JSON.stringify(inventory));
    }
}