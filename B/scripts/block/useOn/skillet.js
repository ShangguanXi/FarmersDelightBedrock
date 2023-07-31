import BlockEntity from "../../lib/BlockEntity";
import { farmersdelightBlockList, vanillaItemList } from '../../data/recipe/cuttingBoardRecipe'
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
        
        if (itemStack.typeId == 'minecraft:beef') {
            const maxAmount = itemStack.maxAmount;
            const removeAmount = maxAmount - inventory.amount;
            if (inventory.item == 'undefined') {
                entity.removeTag(`{"nbt":${JSON.stringify(inventory)}}`);
                const amount = itemStack.amount;
                inventory.item = itemStack.typeId;
                inventory.amount = amount;
                inventory.inventory.push(`{"number":${amount},"cookTime":30}`);
                entity.addTag(`{"nbt":${JSON.stringify(inventory)}}`);
                claerItem(container, player.selectedSlot, amount);
            } else if (removeAmount) {
                entity.removeTag(`{"nbt":${JSON.stringify(inventory)}}`);
                const amount = itemStack.amount;
                if (amount >= removeAmount) {
                    inventory.amount = maxAmount;
                    inventory.inventory.push(`{"number":${removeAmount},"cookTime":30}`);
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
            for (let i = 0; i < inventory.amount; i++) {
                entity.dimension.spawnItem(new ItemStack(inventory.item), entity.location);
            }
            entity.removeTag(`{"nbt":${JSON.stringify(inventory)}}`);
            entity.addTag('{"nbt":{"item":"undefined","amount":0,"inventory":[]}}');
        }
    } else {
        entity.addTag('{"nbt":{"item":"undefined","amount":0,"inventory":[]}}');
    }
}