import BlockEntity from "../../lib/BlockEntity";
import { farmersdelightBlockList, vanillaItemList } from '../../data/recipe/cuttingBoardRecipe'
import { claerItem } from '../../lib/itemUtil';


export function cuttingBoard(player, itemStack, block) {
    const location = block.location;
    const container = player.getComponent('inventory').container;
    const blockEntity = new BlockEntity(
        'farmersdelight:cutting_board',
        player.dimension,
        {
            location: location
        }
    );
    const entity = blockEntity.getEntity();
    const map = blockEntity.getDataMap('item');
    if (farmersdelightBlockList.includes(itemStack.typeId) || vanillaItemList.includes(itemStack.typeId) || itemStack.hasTag('farmersdelight:can_cut') || itemStack.typeId == 'farmersdelight:diamond_knife') {
        if (map) {
            if (itemStack.typeId === 'farmersdelight:diamond_knife') {
                const id = map.get('item').split(':')[1];
                player.runCommandAsync(`loot spawn ${location.x} ${location.y} ${location.z} loot "item/${id}"`);
                entity.triggerEvent('farmersdelight:despawn');
                player.dimension.spawnEntity('farmersdelight:cutting_board', location).addTag(JSON.stringify(location));
            }
        } else if(itemStack.typeId !== 'farmersdelight:diamond_knife'){
            entity.addTag(`{"item":"${itemStack.typeId}"}`);
            claerItem(itemStack.typeId, container, player.selectedSlot);
        }
    }
}