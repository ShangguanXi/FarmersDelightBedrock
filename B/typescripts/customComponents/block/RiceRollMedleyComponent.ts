import { BlockCustomComponent, BlockComponentPlayerInteractEvent, WorldInitializeBeforeEvent, world, Dimension, Vector3 } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
function spawnLoot(path: string, dimenion: Dimension, location: Vector3) {
    return dimenion.runCommand(`loot spawn ${location.x} ${location.y} ${location.z} loot "${path}"`)
}
class RiceRollMedleyComponent implements BlockCustomComponent {
    constructor() {
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
    }

    onPlayerInteract(args: BlockComponentPlayerInteractEvent): void {
        const block = args.block;
        const location = args.block.location;
        if (block.typeId=="farmersdelight:rice_roll_medley_block"){
            if(Number(block.permutation.getState("farmersdelight:food_block_stage"))<=2){
                spawnLoot("farmersdelight/food_block/kelp_roll_slice", block.dimension, { x: location.x + 0.5, y: location.y + 1, z: location.z + 0.5 });
            }
            if(Number(block.permutation.getState("farmersdelight:food_block_stage"))>2&&Number(block.permutation.getState("farmersdelight:food_block_stage"))<=5){
                spawnLoot( "farmersdelight/food_block/salmon_roll", block.dimension, { x: location.x + 0.5, y: location.y + 1, z: location.z + 0.5 });
            }
            if(Number(block.permutation.getState("farmersdelight:food_block_stage"))>5&&Number(block.permutation.getState("farmersdelight:food_block_stage"))<=7){
                spawnLoot( "farmersdelight/food_block/cod_roll", block.dimension, { x: location.x + 0.5, y: location.y + 1, z: location.z + 0.5 });
            }
            if(Number(block.permutation.getState("farmersdelight:food_block_stage"))==8){
                spawnLoot("farmersdelight/food_block/rice_roll_medley_block_over", block.dimension, { x: location.x + 0.5, y: location.y + 1, z: location.z + 0.5 });
                block.dimension.setBlockType({ x: location.x, y: location.y, z: location.z }, "minecraft:air")
            }
            if(Number(block.permutation.getState("farmersdelight:food_block_stage"))<8){
                block.setPermutation(block.permutation.withState("farmersdelight:food_block_stage", Number(block.permutation.getState("farmersdelight:food_block_stage")) + 1));
            }
            
        }
    }
}
export class RiceRollMedleyComponentRegister{
    @methodEventSub(world.beforeEvents.worldInitialize)
    register(args:WorldInitializeBeforeEvent){
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:rice_roll_medley', new RiceRollMedleyComponent());
    }
  
}
