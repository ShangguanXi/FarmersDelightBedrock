import { Block, BlockPermutation, Dimension, Direction, ItemStack, Vector3, system, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";

export class TatamiBlock {
    @methodEventSub(world.beforeEvents.playerPlaceBlock)
    placeBlock(args: any) {
        const block: Block = args.block;
        const item: ItemStack = args.itemStack;
        if (block.typeId != "farmersdelight:tatami") return;
        if (item.typeId != "farmersdelight:tatami") return;
        if (block.permutation.getState('farmersdelight:connection') != "none") return;
        let { x, y, z }: Vector3 = block.location;
        const dimension = args.dimension as Dimension;
        const face = args.face;
        system.run(() => {
            let thisPerm = BlockPermutation.resolve('farmersdelight:tatami');
            let neighborPerm = block.permutation;
            switch (face) {
                case Direction.North:
                    thisPerm = thisPerm.withState('farmersdelight:connection', 'south');
                    neighborPerm = neighborPerm.withState('farmersdelight:connection', 'north');
                    z -= 1;
                    break;
                case Direction.South:
                    thisPerm = thisPerm.withState('farmersdelight:connection', 'north');
                    neighborPerm = neighborPerm.withState('farmersdelight:connection', 'south');
                    z += 1;
                    break;
                case Direction.East:
                    thisPerm = thisPerm.withState('farmersdelight:connection', 'west');
                    neighborPerm = neighborPerm.withState('farmersdelight:connection', 'east');
                    x += 1;
                    break;
                case Direction.West:
                    thisPerm = thisPerm.withState('farmersdelight:connection', 'east');
                    neighborPerm = neighborPerm.withState('farmersdelight:connection', 'west');
                    x -= 1;
                    break;
                case Direction.Up:
                    thisPerm = thisPerm.withState('farmersdelight:connection', 'down');
                    neighborPerm = neighborPerm.withState('farmersdelight:connection', 'up');
                    y += 1;
                    break;
                case Direction.Down:
                    thisPerm = thisPerm.withState('farmersdelight:connection', 'up');
                    neighborPerm = neighborPerm.withState('farmersdelight:connection', 'down');
                    y -= 1;
                    break;
                default:
                    break;
            };
            if (dimension.getEntitiesAtBlockLocation({ x, y, z }).length != 0) return;
            if (dimension.getBlock({ x, y, z })?.typeId != 'farmersdelight:tatami') return;
            block.setPermutation(neighborPerm);
            dimension.getBlock({ x, y, z })?.setPermutation(thisPerm);
        })
    }
}