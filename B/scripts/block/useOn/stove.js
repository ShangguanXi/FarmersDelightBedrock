import BlockEntity from "../../lib/BlockEntity";
import { vanillaItemList } from '../../data/recipe/skilletRecipe'
import { claerItem } from '../../lib/itemUtil';
import { gameMode } from "../../lib/EntityUtil";
import { MolangVariableMap, ItemStack } from "@minecraft/server";

const molang = new MolangVariableMap();

export function stove(player, itemStack, block) {
    const location = block.location;
    const container = player.getComponent('inventory').container;
    const blockEntity = new BlockEntity(
        'farmersdelight:stove',
        player.dimension,
        {
            location: location
        }
    );
    const entity = blockEntity.entity;
    const data = blockEntity.scoreboardObjective;
    const air = player.dimension.getBlock({ x: location.x, y: location.y + 1, z: location.z });
    if (entity && data && air.typeId == 'minecraft:air') {
        const amount = data.getScore('amount');
        if (vanillaItemList.includes(itemStack.typeId) || itemStack.hasTag('can_cooking')) {
            if (amount < 6) {
                data.setScore('amount', amount + 1);
                data.setScore(`${itemStack.typeId}/${amount + 1}`, 30);
                if (gameMode(player)) {
                    claerItem(container, player.selectedSlot);
                }
            }
        } else {
            const arr = [];
            const itemStackScoresData = data.getScores();
            for (const itemStackData of itemStackScoresData) {
                const itemStack = itemStackData.participant.displayName;
                if (itemStack != 'amount') {
                    arr.push(itemStack);
                }
            }
            for (let i = 0; i < arr.length - 1; i++) {
                for (let j = 0; j < arr.length - 1 - i; j++) {
                    const num1 = parseInt(arr[j].split('/')[1]);
                    const num2 = parseInt(arr[j + 1].split('/')[1]);
                    if (num1 > num2) {
                        let temp = arr[j + 1];
                        arr[j + 1] = arr[j];
                        arr[j] = temp;
                    }
                }
            }
            if (arr.length) {
                const itemStackData = arr[amount - 1];
                const itemStack = itemStackData.split('/')[0]
                data.removeParticipant(itemStackData);
                data.setScore('amount', data.getScore('amount') - 1);
                entity.dimension.spawnItem(new ItemStack(itemStack), entity.location);
            }
        }
    }
}