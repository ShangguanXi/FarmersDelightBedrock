import { BlockPermutation, Container, Dimension, Direction, EntityInventoryComponent, ItemStack, PlayerBreakBlockAfterEvent, PlayerInteractWithBlockBeforeEvent, Vector3, system, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { EntityUtil } from "../lib/EntityUtil";
import { ItemUtil } from "../lib/ItemUtil";

export class Colonies {
    @methodEventSub(world.beforeEvents.playerInteractWithBlock)
    tryPlaceBlock(args: PlayerInteractWithBlockBeforeEvent) {
        const itemStack = args.itemStack;
        const block = args.block;
        if (
            !itemStack ||
            (itemStack.typeId != 'farmersdelight:brown_mushroom_colony_item' && itemStack.typeId != 'farmersdelight:red_mushroom_colony_item') ||
            args.blockFace != Direction.Up ||
            (block.typeId != 'minecraft:mycelium' && block.typeId != 'farmersdelight:rich_soil')
        ) return
        const player = args.player;
        args.cancel = true
        system.run(() => {
            const main = block.above();
            const mainPerm = BlockPermutation.resolve(itemStack.typeId.split('_item')[0], { 'farmersdelight:growth': 4 });
            main?.setPermutation(mainPerm);
            if (EntityUtil.gameMode(player)) ItemUtil.clearItem(player.getComponent('inventory')?.container as Container, player.selectedSlotIndex);
        })
    }
    @methodEventSub(world.afterEvents.playerBreakBlock)
    break(args: PlayerBreakBlockAfterEvent){
        const brokenPerm = args.brokenBlockPermutation;
        const blockId = brokenPerm.type.id;
        const player = args.player;
        if ((blockId != 'farmersdelight:brown_mushroom_colony' && blockId != 'farmersdelight:red_mushroom_colony') || !EntityUtil.gameMode(player)) return
        const growth = brokenPerm.getState('farmersdelight:growth') as number;
        const item = args.itemStackBeforeBreak;
        const {x, y, z} = args.block.location
        if (growth == 4 && item?.typeId == 'minecraft:shears'){
            player.dimension.spawnItem(new ItemStack(`${blockId}_item`), {x:x + 0.5, y, z:z + 0.5});
            const invComp = player.getComponent(EntityInventoryComponent.componentId);
            const container = invComp?.container
            if (!container) return
            ItemUtil.damageItem(container, player.selectedSlotIndex)
        }
        else{
            spawnLoot(`farmersdelight/crops/farmersdelight_${blockId.split(':')[1]}${growth}`, player.dimension, {x:x + 0.5, y, z:z + 0.5})
        }
    }
}

function spawnLoot(path: string, dimenion: Dimension, location: Vector3) {
    return dimenion.runCommand(`loot spawn ${location.x} ${location.y} ${location.z} loot "${path}"`)
}