import {
    BlockComponentPlayerInteractEvent,
    BlockCustomComponent,
    Dimension,
    StartupEvent,
    system,
    Vector3,
} from "@minecraft/server";
import { subscribeEvent } from "../../lib/EventSubscriber";
import { spawnLootAtBlock } from "../../lib/LootUtil";

/**
 * @deprecated
 */
class RiceRollMedleyComponent implements BlockCustomComponent {
    constructor() {
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
    }

    onPlayerInteract(args: BlockComponentPlayerInteractEvent): void {
        const block = args.block;
        const location = args.block.location;
        if (block.typeId=="farmersdelight:rice_roll_medley_block"){
            if(Number(block.permutation.getState("farmersdelight:food_block_stage"))<=2){
                spawnLootAtBlock(block, "farmersdelight/food_block/kelp_roll_slice");
            }
            if(Number(block.permutation.getState("farmersdelight:food_block_stage"))>2&&Number(block.permutation.getState("farmersdelight:food_block_stage"))<=5){
                spawnLootAtBlock(block, "farmersdelight/food_block/salmon_roll");
            }
            if(Number(block.permutation.getState("farmersdelight:food_block_stage"))>5&&Number(block.permutation.getState("farmersdelight:food_block_stage"))<=7){
                spawnLootAtBlock(block, "farmersdelight/food_block/cod_roll");
            }
            if(Number(block.permutation.getState("farmersdelight:food_block_stage"))==8){
                spawnLootAtBlock(block, "farmersdelight/food_block/rice_roll_medley_block_over");
                block.dimension.setBlockType({ x: location.x, y: location.y, z: location.z }, "minecraft:air")
            }
            if(Number(block.permutation.getState("farmersdelight:food_block_stage"))<8){
                block.setPermutation(block.permutation.withState("farmersdelight:food_block_stage", Number(block.permutation.getState("farmersdelight:food_block_stage")) + 1));
            }
            
        }
    }
}
export class RiceRollMedleyComponentRegister{
    @subscribeEvent(system.beforeEvents.startup)
    register(args:StartupEvent){
        args.blockComponentRegistry.registerCustomComponent('farmersdelight:rice_roll_medley', new RiceRollMedleyComponent());
    }
  
}
