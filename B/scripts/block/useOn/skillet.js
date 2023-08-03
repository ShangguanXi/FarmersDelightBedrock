import BlockEntity from "../../lib/BlockEntity";
import { vanillaItemList } from '../../data/recipe/skilletRecipe'
import { claerItem } from '../../lib/itemUtil';
import { MolangVariableMap, ItemStack, world } from "@minecraft/server";

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
    const data = blockEntity.scoreboardObjective;
    const map = blockEntity.getDataMap('item');
    if (entity && data && map) {
        if (vanillaItemList.includes(itemStack.typeId) || itemStack.hasTag('can_cooking')) {
            const itemAmount = itemStack.amount;
            if (map.get('item') === 'undefined') {
                entity.removeTag('{"item":"undefined"}');
                entity.addTag(`{"item":"${itemStack.typeId}"}`);
                data.setScore('amount', itemAmount);
                data.setScore(`${itemAmount}G`, 30);
                claerItem(container, player.selectedSlot, itemAmount);
            } else {
                const maxAmount = itemStack.maxAmount;
                const amount = data.getScore('amount');
                const removeAmount = maxAmount - amount;
                if (itemAmount <= removeAmount) {
                    data.setScore('amount', amount + itemAmount);
                    data.setScore(`${amount}G`, 30);
                    claerItem(container, player.selectedSlot, itemAmount);
                } else {
                    data.setScore('amount', amount + removeAmount);
                    data.setScore(`${removeAmount}G`, 30);
                    claerItem(container, player.selectedSlot, removeAmount);
                }
            }
        }
    } else {
        entity.addTag('{"item":"undefined"}');
    }
}