import BlockEntity from "../../lib/BlockEntity";
import { farmersdelightBlockList, vanillaItemList } from '../../data/recipe/cuttingBoardRecipe'
import { claerItem, damageItem } from '../../lib/itemUtil';
import { MolangVariableMap, ItemStack } from "@minecraft/server";
import { gameMode } from "../../lib/EntityUtil";

const molang = new MolangVariableMap();

export function cuttingBoard(player, itemStack, block) {
    const location = block.location;
    const container = player.getComponent('inventory').container;
    const blockEntity = new BlockEntity(
        null,
        block,
        {
            type: 'farmersdelight:cutting_board',
            location: location
        }
    );
    const entity = blockEntity.entity;
    const data = JSON.parse(blockEntity.getBlockEntityData('farmersdelight:blockEntityItemStackData'))['item'];
    const V3 = { x: location.x + 0.5, y: location.y, z: location.z + 0.5 };
    if (data != 'undefined' && !itemStack.hasTag('farmersdelight:is_knife')) {
        entity.dimension.spawnItem(new ItemStack(data), entity.location);
        blockEntity.clearEntity();
        const cuttingBoard = player.dimension.spawnEntity('farmersdelight:cutting_board', V3);
        cuttingBoard.setDynamicProperty('farmersdelight:blockEntityDataLocation', V3);
        cuttingBoard.setDynamicProperty('farmersdelight:blockEntityItemStackData', '{"item":"undefined"}');
    }
    if (farmersdelightBlockList.includes(itemStack.typeId) || vanillaItemList.includes(itemStack.typeId) || itemStack.hasTag('farmersdelight:can_cut') || itemStack.hasTag('farmersdelight:is_knife')) {
        if (data != 'undefined') {
            if (itemStack.hasTag('farmersdelight:is_knife')) {
                const id = data.split(':')[1];
                player.runCommandAsync(`loot spawn ${location.x} ${location.y} ${location.z} loot "farmersdelight/cutting_board/farmersdelight_${id}"`);
                blockEntity.clearEntity();
                const cuttingBoard = player.dimension.spawnEntity('farmersdelight:cutting_board', V3);
                cuttingBoard.setDynamicProperty('farmersdelight:blockEntityDataLocation', V3);
                cuttingBoard.setDynamicProperty('farmersdelight:blockEntityItemStackData', '{"item":"undefined"}');
                if (gameMode(player)) {
                    damageItem(container, player.selectedSlot);
                }
            }
        } else if (!itemStack.hasTag('farmersdelight:is_knife')) {
            const id = itemStack.typeId.split(':');
            const name = id[0] == 'minecraft' ? `farmersdelight:${id[0]}_${id[1]}` : itemStack.typeId;
            entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', `{"item":"${itemStack.typeId}"}`);
            if (gameMode(player)) {
                claerItem(container, player.selectedSlot);
            }
            entity.dimension.spawnParticle(name, { x: location.x + 0.5, y: location.y + 0.0563, z: location.z + 0.5 }, molang);
        }
    }
}