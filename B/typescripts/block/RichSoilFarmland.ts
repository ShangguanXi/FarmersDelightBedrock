import { Block, BlockPermutation, BlockVolume, Dimension, Vector3, system, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";


export class RichSoilFarmland {
    @methodEventSub(system.afterEvents.scriptEventReceive, { namespaces: ["farmersdelight"] })
    blockTick(args: any) {
        const block: Block = args.sourceBlock;
        if (block?.typeId !== "farmersdelight:rich_soil_farmland") return;
        const { x, y, z }: Vector3 = block.location;
        const dimension: Dimension = block.dimension;
        const fromLocation: Vector3 = { x: x - 4, y: y, z: z - 4 };
        const toLocation: Vector3 = { x: x + 4, y: y + 1, z: z + 4 };
        const detectLocs = new BlockVolume(fromLocation, toLocation ).getBlockLocationIterator();
        const moisturizedAmount: number = block.permutation.getState('farmersdelight:moisturized_amount') as number;
        let hasWater: boolean = false;
        for (const location of detectLocs) {
            const water: boolean = dimension.getBlock(location)?.typeId == "minecraft:water";
            if (water) {
                hasWater = true;
                break
            }
        }
        if (hasWater) {
            if (moisturizedAmount < 7) block.setPermutation(block.permutation.withState('farmersdelight:moisturized_amount', moisturizedAmount + 1));
        } else {
            if (moisturizedAmount > 0) {
                block.setPermutation(block.permutation.withState('farmersdelight:moisturized_amount', moisturizedAmount - 1));
            } else {
                block.setPermutation(BlockPermutation.resolve('farmersdelight:rich_soil'));
            }
        }
        const cropBlock = dimension.getBlock({ x: x, y: y + 1, z: z });
        if (!cropBlock?.hasTag('crop')) return;
        let maxGrowth, growthProperty;
        for (const tag of cropBlock.getTags()) {
            const growthTag: RegExpMatchArray | null = tag.match(/max_growth:([0-9]+)/);
            const propertyTag: RegExpMatchArray | null = tag.match(/growth_property:(.*)/);
            if (growthTag) {
                maxGrowth = Number(growthTag[1]);
            }
            if (propertyTag) {
                growthProperty = propertyTag[1];
            }
        }
        if (maxGrowth && growthProperty) {
            const growth: number = cropBlock.permutation.getState(growthProperty) as number;
            if (growth < maxGrowth) {
                cropBlock.setPermutation(cropBlock.permutation.withState(growthProperty, growth + 1));
            }
        }
    }
}