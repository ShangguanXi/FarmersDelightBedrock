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
    const invItemStack = map.get('item');
    if (entity && data && map) {
        if (vanillaItemList.includes(itemStack.typeId) || itemStack.hasTag('can_cooking')) {
            const itemAmount = itemStack.amount;
            if (invItemStack == 'undefined') {
                entity.removeTag('{"item":"undefined"}');
                entity.addTag(`{"item":"${itemStack.typeId}"}`);
                data.setScore('amount', itemAmount);
                data.setScore(`${itemAmount}G`, 30);
                claerItem(container, player.selectedSlot, itemAmount);
            } else if (itemStack.typeId == invItemStack) {
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
        if (itemStack.typeId != invItemStack && invItemStack != 'undefined') {
            for (const itemStackData of data.getScores()) {
                const displayName = itemStackData.participant.displayName;
                if (displayName != 'amount') {
                    const num = parseInt(displayName.split('G')[0]);
                    data.removeParticipant(displayName);
                    data.setScore('amount', data.getScore('amount') - num);
                    for (let i = 0; i < num; i++) {
                        entity.dimension.spawnItem(new ItemStack(invItemStack), entity.location);
                    }
                    break;
                }
            }

        }
    } else {
        entity.addTag('{"item":"undefined"}');
    }
}