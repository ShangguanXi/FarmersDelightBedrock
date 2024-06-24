import { BlockComponentPlayerInteractEvent, BlockCustomComponent, BlockComponentRandomTickEvent, WorldInitializeBeforeEvent, world, BlockVolume, BlockPermutation } from "@minecraft/server";
import { ItemUtil } from "../../lib/ItemUtil";
import { methodEventSub } from "../../lib/eventHelper";

class RichSoilFarmlandComponent implements BlockCustomComponent {
    constructor() {
        this.onRandomTick = this.onRandomTick.bind(this);
        this.onPlayerInteract = this.onPlayerInteract.bind(this);


    }
    onPlayerInteract(args: BlockComponentPlayerInteractEvent): void {
        
    }
    onRandomTick(args: BlockComponentRandomTickEvent): void {

        const block = args.block;
        if (block?.typeId !== "farmersdelight:rich_soil_farmland") return;

        const { x, y, z } = block.location;
        const dimension = block.dimension;
        const fromLocation = { x: x - 4, y: y, z: z - 4 };
        const toLocation = { x: x + 4, y: y + 1, z: z + 4 };
        const detectLocs = new BlockVolume(fromLocation, toLocation).getBlockLocationIterator();
        const moisturizedAmount = block.permutation.getState('farmersdelight:moisturized_amount') as number;
        let hasWater = false;
        for (const location of detectLocs) {
            const water = dimension.getBlock(location)?.typeId === "minecraft:water";
            if (water) {
                hasWater = true;
                break;
            }
        };
        if (hasWater) {
            if (moisturizedAmount < 7) block.setPermutation(block.permutation.withState('farmersdelight:moisturized_amount', moisturizedAmount + 1));
        } else {
            if (moisturizedAmount > 0) {
                block.setPermutation(block.permutation.withState('farmersdelight:moisturized_amount', moisturizedAmount - 1));
            } else {
                block.setPermutation(BlockPermutation.resolve('farmersdelight:rich_soil'));
            }
        };
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
export class RichSoilFarmlandComponentRegister {
    @methodEventSub(world.beforeEvents.worldInitialize)
    register(args: WorldInitializeBeforeEvent) {
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:rich_soil_farmland', new RichSoilFarmlandComponent());
    }

}
