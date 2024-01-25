import { Block, BlockPermutation, Dimension, Direction, ItemStack, Vector3, system, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";

export class TatamiBlock {
    @methodEventSub(world.beforeEvents.playerPlaceBlock)
    placeBlock(args: any) {
        const block: Block = args.block;
        const itemStack: ItemStack = args.itemStack;
        if (!(itemStack?.typeId == "farmersdelight:tatami" && block.typeId == "farmersdelight:tatami" && block.permutation.getState('farmersdelight:connection') == "none")) return;
        let { x, y, z }: Vector3 = block.location;
        const dimension: Dimension = block.dimension;
        const face: Direction = args.face;
        system.run(() => {
            const blockPermutation: BlockPermutation = BlockPermutation.resolve('farmersdelight:tatami');
            const permutation: BlockPermutation = block.permutation;
            let thisPerm: string = 'south';
            let neighborPerm: string = 'north';
            switch (face) {
                case Direction.North:
                    thisPerm = 'south';
                    neighborPerm = 'north';
                    z -= 1;
                    break;
                case Direction.South:
                    thisPerm = 'north';
                    neighborPerm = 'south';
                    z += 1;
                    break;
                case Direction.East:
                    thisPerm = 'west';
                    neighborPerm = 'east';
                    x += 1;
                    break;
                case Direction.West:
                    thisPerm = 'east';
                    neighborPerm = 'west';
                    x -= 1;
                    break;
                case Direction.Up:
                    thisPerm = 'down';
                    neighborPerm = 'up';
                    y += 1;
                    break;
                case Direction.Down:
                    thisPerm = 'up';
                    neighborPerm = 'down';
                    y -= 1;
                    break;
                default:
                    break;
            };
            if (dimension.getEntitiesAtBlockLocation({ x, y, z }).length != 0 && dimension.getBlock({ x, y, z })?.typeId != 'farmersdelight:tatami') return;
            block.setPermutation(permutation.withState('farmersdelight:connection', neighborPerm));
            dimension.getBlock({ x, y, z })?.setPermutation(blockPermutation.withState("farmersdelight:connection", thisPerm));
        })
    }
}