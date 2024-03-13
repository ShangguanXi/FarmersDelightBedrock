import { Block, BlockPermutation, BlockVolume, Dimension, Vector, Vector3, system } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { organicCompostDetectList } from "../data/organicCompostDetect";



export class OrganicCompost {
    @methodEventSub(system.afterEvents.scriptEventReceive, { namespaces: ["farmersdelight"] })
    blockTick(args: any) {
        let transChance: number = 0.1;
        let hasWater: boolean = false;
        const compostBlock: Block = args.sourceBlock;
        if (compostBlock?.typeId !== "farmersdelight:organic_compost") return;
        const currentProcess: number  = compostBlock.permutation.getState("farmersdelight:process") as number ?? 0;
        const { x, y, z }: Vector3 = compostBlock.location;
        const dimension: Dimension = compostBlock.dimension;
        const fromLocation: Vector3 = { x: x - 1, y: y - 1, z: z - 1 };
        const toLocation: Vector3 = { x: x + 1, y: y + 1, z: z + 1 };
        const detectLocs = new BlockVolume(fromLocation, toLocation ).getBlockLocationIterator();
        for (const location of detectLocs) {
            const block: Block | undefined = dimension.getBlock(location);
            if (!block) continue;
            if (organicCompostDetectList.includes(block.typeId)) {
                transChance += 0.02;
            }
            else if (block.hasTag('compost_activators')) {
                transChance += 0.02;
            }
            else if (block.typeId == 'minecraft:water') {
                hasWater = true;
            }
        };
        if (hasWater) transChance += 0.1;
        if (Math.random() < transChance) {
            if (currentProcess < 7) {
                compostBlock.setPermutation(compostBlock.permutation.withState('farmersdelight:process', currentProcess + 1));
            }
            else {
                compostBlock.setPermutation(BlockPermutation.resolve('farmersdelight:rich_soil'));
            }
        }
    }
}