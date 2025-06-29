import { Block, PlayerPlaceBlockAfterEvent, Vector3, world } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { BlockWithEntity } from "../BlockWithEntity";

export class Cabinets extends BlockWithEntity {
    @methodEventSub(world.afterEvents.playerPlaceBlock)
    placeBlock(args: PlayerPlaceBlockAfterEvent) {
        const block: Block = args.block;
        const cabinet = block.getComponent("farmersdelight:cabinet")
        if (!cabinet) return;
        const { x, y, z }: Vector3 = block.location;
        const entity = super.setBlock(args.block.dimension, { x: x + 0.5, y: y, z: z + 0.5 }, cabinet.customComponentParameters.params as string);
        entity.nameTag = `tile.${entity.typeId}.name`;
    }
}