import { Block, PlayerPlaceBlockAfterEvent, Vector3, world } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { BlockWithEntity } from "../../lib/BlockWithEntity";

export class Basket extends BlockWithEntity {
    @methodEventSub(world.afterEvents.playerPlaceBlock)
    placeBlock(args: PlayerPlaceBlockAfterEvent) {
        const block: Block = args.block;
        if (block.typeId!="farmersdelight:basket") return;
        const { x, y, z }: Vector3 = block.location;
        const entity = super.setBlock(args.block.dimension, { x: x + 0.5, y: y, z: z + 0.5 }, block.typeId);
        entity.nameTag = `tile.${entity.typeId}.name`;
    }
    @methodEventSub(world.afterEvents.playerPlaceBlock)
    setState(args: PlayerPlaceBlockAfterEvent) {
        const block: Block = args.block;
        if (block.typeId!="farmersdelight:basket") return;
        const state = block.permutation.getState("minecraft:block_face")
        if (state == "down") block.setPermutation(block.permutation.withState("minecraft:block_face","up"))
        if (state == "up") block.setPermutation(block.permutation.withState("minecraft:block_face","down"))

    }
}