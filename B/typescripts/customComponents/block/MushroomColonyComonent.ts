import { BlockComponentPlayerInteractEvent, BlockComponentRandomTickEvent,BlockComponentPlayerDestroyEvent, BlockCustomComponent, Dimension, Vector3, WorldInitializeBeforeEvent, world, EntityInventoryComponent, ItemStack } from "@minecraft/server";
import { RandomUtil } from "../../lib/RandomUtil";
import { ItemUtil } from "../../lib/ItemUtil";
import { methodEventSub } from "../../lib/eventHelper";
import { EntityUtil } from "../../lib/EntityUtil";
function spawnLoot(path: string, dimenion: Dimension, location: Vector3) {
    return dimenion.runCommand(`loot spawn ${location.x} ${location.y} ${location.z} loot "${path}"`)
}
class MushroomColonyComonent implements BlockCustomComponent {
    constructor() {
        this.onRandomTick = this.onRandomTick.bind(this);
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
    }
    onPlayerInteract(args: BlockComponentPlayerInteractEvent): void {
        const player = args.player;
        const face = args.face;
        const container = player?.getComponent("inventory")?.container;
        const block = args.block;
        const dimension = args.dimension;
        if (!player) return;
        if (!container) return;
        const growth = block.permutation.getState('farmersdelight:growth') as number;
        const selectedSlot = container?.getSlot(player.selectedSlotIndex)
        try {
            const itemId = selectedSlot?.typeId;
            if (itemId=="minecraft:bone_meal"){
                if (growth<4&&growth>0&&RandomUtil.probability(70)){
                    block.setPermutation(block.permutation.withState('farmersdelight:growth', growth + 1));
                }
                if(growth==0&&RandomUtil.probability(70)){
                    if (block.typeId=="farmersdelight:brown_mushroom_colony"){
                        world.structureManager.place("farmersdelight:brown_mushroom_tree",dimension,{ x: block.location.x-3, y: block.location.y, z: block.location.z-3 })
                    };
                    if (block.typeId=="farmersdelight:red_mushroom_colony"){
                        world.structureManager.place("farmersdelight:red_mushroom_tree",dimension,{ x: block.location.x-2, y: block.location.y, z: block.location.z-2 })
                    };
                }
                dimension.spawnParticle("minecraft:crop_growth_emitter",block.center())
                dimension.playSound("item.bone_meal.use",block.center())
                ItemUtil.clearItem(container,player.selectedSlotIndex)
            }
            if(itemId=="minecraft:shears"&&growth>0){
                block.setPermutation(block.permutation.withState('farmersdelight:growth', growth - 1));
                if (block.typeId=="farmersdelight:brown_mushroom_colony"){
                    spawnLoot("farmersdelight/crops/farmersdelight_brown_mushroom_colony0",dimension,{ x: block.location.x+0.5, y: block.location.y+0.5, z: block.location.z+0.5 })
                };
                if (block.typeId=="farmersdelight:red_mushroom_colony"){
                    spawnLoot("farmersdelight/crops/farmersdelight_red_mushroom_colony0",dimension,block.center())
                };
                ItemUtil.damageItem(container,player.selectedSlotIndex)
                dimension.playSound("mob.sheep.shear",block.center())
            }
           
           

        }
        catch (error) {

        }

    }
    onPlayerDestroy(args: BlockComponentPlayerDestroyEvent): void {
        const brokenPerm = args.destroyedBlockPermutation;
        const blockId = brokenPerm.type.id;
        const player = args.player;
        const container = player?.getComponent("inventory")?.container;
        if (!player) return
        if (!container) return;
        const selectedSlot = container?.getSlot(player.selectedSlotIndex)
        if ((blockId != 'farmersdelight:brown_mushroom_colony' && blockId != 'farmersdelight:red_mushroom_colony') || !EntityUtil.gameMode(player)) return
        const growth = brokenPerm.getState('farmersdelight:growth') as number;
        try {
            const itemId = selectedSlot?.typeId;
            const {x, y, z} = args.block.location
            if (growth == 4 && itemId == 'minecraft:shears'){
                player.dimension.spawnItem(new ItemStack(`${blockId}_item`), {x:x + 0.5, y, z:z + 0.5});
                const invComp = player.getComponent(EntityInventoryComponent.componentId);
                const container = invComp?.container
                if (!container) return
                ItemUtil.damageItem(container, player.selectedSlotIndex)
            }
            else{
                spawnLoot(`farmersdelight/crops/farmersdelight_${blockId.split(':')[1]}${growth}`, player.dimension, {x:x + 0.5, y, z:z + 0.5})
            }
        }catch{

        }

       
    }
    onRandomTick(args: BlockComponentRandomTickEvent): void {
        const block = args.block;
        const growth = block.permutation.getState('farmersdelight:growth') as number;
        if (growth<4){
            block.setPermutation(block.permutation.withState('farmersdelight:growth', growth + 1));
        }

    }

}
export class MushroomColonyComonentRegister{
    @methodEventSub(world.beforeEvents.worldInitialize)
    register(args:WorldInitializeBeforeEvent){
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:mushroom_colony', new MushroomColonyComonent());
    }
  
}
