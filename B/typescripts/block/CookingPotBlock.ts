import { Block, Entity, Vector3, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { BlockWithEntity } from "./BlockWithEntity";
import { CookingPotBlockEntity } from "./entity/CookingPotBlockEntity";


export class CookingPotBlock extends BlockWithEntity {
    @methodEventSub(world.afterEvents.playerPlaceBlock)
    placeBlock(args: any) {
        const block: Block = args.block;
        if (block.typeId != "farmersdelight:cooking_pot") return;
        const { x, y, z }: Vector3 = block.location;
        const entity: Entity = super.setBlock(args, { x: x + 0.5, y: y, z: z + 0.5 }, "farmersdelight:cooking_pot");
        entity.nameTag = "farmersdelight厨锅";
    }
}