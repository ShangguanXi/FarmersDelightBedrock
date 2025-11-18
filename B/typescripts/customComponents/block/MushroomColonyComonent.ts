import {
    BlockComponentPlayerBreakEvent,
    BlockComponentPlayerInteractEvent,
    BlockComponentRandomTickEvent,
    BlockCustomComponent,
    Dimension,
    EntityInventoryComponent,
    ItemStack,
    StartupEvent,
    system,
    Vector3,
    world,
} from "@minecraft/server";
import { RandomUtil } from "../../lib/RandomUtil";
import { ItemUtil } from "../../lib/ItemUtil";
import { EntityUtil } from "../../lib/EntityUtil";
import { subscribeEvent } from "../../lib/EventSubscriber";

function spawnLoot(path: string, dimenion: Dimension, location: Vector3) {
    return dimenion.runCommand(`loot spawn ${location.x} ${location.y} ${location.z} loot "${path}"`)
}
class MushroomColonyComonent implements BlockCustomComponent {
    constructor() {
        this.onRandomTick = this.onRandomTick.bind(this);
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
        this.onPlayerBreak = this.onPlayerBreak.bind(this);
    }
    onPlayerInteract(args: BlockComponentPlayerInteractEvent): void {
        const player = args.player;
        const face = args.face;
        const inventory = player?.getComponent("inventory") as EntityInventoryComponent;
        const container = inventory?.container;
        const block = args.block;
        const dimension = args.dimension;
        if (!player) return;
        if (!container) return;
        const growth = block.permutation.getState('farmersdelight:growth') as number;
        const selectedSlot = container?.getSlot(player.selectedSlotIndex)
        if (!selectedSlot.getItem()) return
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
    onPlayerBreak(args: BlockComponentPlayerBreakEvent): void {
        const brokenPerm = args.brokenBlockPermutation;
        const blockId = brokenPerm.type.id;
        const player = args.player;
        const inventory = player?.getComponent("inventory") as EntityInventoryComponent;
        const container = inventory?.container;
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
                const invComp = player.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent
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
        const belowBlock = block.below()
        if (belowBlock?.typeId!="farmersdelight:organic_compost") return
        const process = belowBlock.permutation.getState("farmersdelight:process") as number
        if (process < 7){
            belowBlock.setPermutation(belowBlock.permutation.withState('farmersdelight:process', process + 1));
        }

    }

}
export class MushroomColonyComonentRegister{
    @subscribeEvent(system.beforeEvents.startup)
    register(args:StartupEvent){
        args.blockComponentRegistry.registerCustomComponent('farmersdelight:mushroom_colony', new MushroomColonyComonent());
    }
  
}
