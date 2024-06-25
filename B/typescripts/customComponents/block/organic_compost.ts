import { BlockCustomComponent, BlockComponentRandomTickEvent, world, WorldInitializeBeforeEvent, BlockPermutation, BlockVolume } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { organicCompostDetectList } from "../../data/organicCompostDetect";

class OrganicCompostComonent implements BlockCustomComponent {
    constructor() {
        this.onRandomTick = this.onRandomTick.bind(this);
    } 
    onRandomTick(args: BlockComponentRandomTickEvent): void {
        let transChance: number = 0.1;
        let hasWater: boolean = false;
        const compostBlock = args.block;
        if (compostBlock?.typeId !== "farmersdelight:organic_compost") return;
        const currentProcess  = compostBlock.permutation.getState("farmersdelight:process") as number ?? 0;
        const { x, y, z } = compostBlock.location;
        const dimension = compostBlock.dimension;
        const fromLocation = { x: x - 1, y: y - 1, z: z - 1 };
        const toLocation = { x: x + 1, y: y + 1, z: z + 1 };
        const detectLocs = new BlockVolume(fromLocation, toLocation ).getBlockLocationIterator();
        for (const location of detectLocs) {
            const block= dimension.getBlock(location);
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
export class OrganicCompostComonentRegister {
    @methodEventSub(world.beforeEvents.worldInitialize)
    register(args: WorldInitializeBeforeEvent) {
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:organic_compost', new OrganicCompostComonent());
    }

}