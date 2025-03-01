import { BlockComponentPlayerInteractEvent, BlockCustomComponent, BlockComponentRandomTickEvent, WorldInitializeBeforeEvent, world, BlockVolume, BlockPermutation, BlockComponentEntityFallOnEvent, EntityInventoryComponent, Vector3, Container, Player, Block } from "@minecraft/server";
import { ItemUtil } from "../../lib/ItemUtil";
import { methodEventSub } from "../../lib/eventHelper";


function handlePlanting(seedId: string, crop: string, topLocation: Vector3, container: Container, player: Player, block: Block) {
    if (!player) return;
    if (!container) return;
    const selectedSlot = container?.getSlot(player.selectedSlotIndex)
    const itemId = selectedSlot?.typeId;
    if (itemId == seedId) {
        world.playSound("dig.grass", block.location);
        block.dimension.setBlockType(topLocation, crop);
        ItemUtil.clearItem(container, player.selectedSlotIndex);
    }
}
class RichSoilFarmlandComponent implements BlockCustomComponent {
    constructor() {
        this.onRandomTick = this.onRandomTick.bind(this);
        this.onPlayerInteract = this.onPlayerInteract.bind(this);



    }

  
    onPlayerInteract(args: BlockComponentPlayerInteractEvent): void {
        const player = args.player;
        const face = args.face;
        const inventory = player?.getComponent("inventory") as EntityInventoryComponent;
        const container = inventory?.container;
        const block = args.block;
        const dimension = args.dimension;
        if (!player) return;
        if (!container) return;
        const selectedSlot = container?.getSlot(player.selectedSlotIndex)
        const topLocation = { x: block.location.x, y: block.location.y + 1, z: block.location.z }
        const topBlockId = dimension.getBlock(topLocation)?.typeId
        if (face == 'Up' && topBlockId == "minecraft:air") {
            handlePlanting("minecraft:wheat_seeds", "farmersdelight:rich_soil_wheat", topLocation, container, player, block)
            handlePlanting("minecraft:potato", "farmersdelight:rich_soil_potato", topLocation, container, player, block)
            handlePlanting("minecraft:carrot", "farmersdelight:rich_soil_carrot", topLocation, container, player, block)
            handlePlanting("minecraft:beetroot_seeds", "farmersdelight:rich_soil_beetroot", topLocation, container, player, block)
            handlePlanting("minecraft:torchflower_seeds", "farmersdelight:rich_soil_torchflower_crop", topLocation, container, player, block)
            handlePlanting("minecraft:torchflower", "farmersdelight:rich_soil_torchflower", topLocation, container, player, block)
            handlePlanting("farmersdelight:cabbage_seeds", "farmersdelight:cabbage_block", topLocation, container, player, block)
            handlePlanting("farmersdelight:onion", "farmersdelight:onion_block", topLocation, container, player, block)
            handlePlanting("farmersdelight:tomato_seeds", "farmersdelight:tomato_block", topLocation, container, player, block)
            const tags = selectedSlot?.getTags();
            if (!tags) return
            for (const tag of tags){
                if (tag.includes("farmersdelight:seed")){
                    const crop = tag.split("-")[1]
                    world.playSound("dig.grass", block.location);
                    block.dimension.setBlockType(topLocation, crop);
                    ItemUtil.clearItem(container, player.selectedSlotIndex);
                }

            }
           

        }

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
                dimension.spawnParticle("minecraft:crop_growth_emitter", { x: block.location.x + 0.5, y: block.location.y + 1.5, z: block.location.z + 0.5 })
            }
        }


    }
}
export class RichSoilFarmlandComponentRegister {
    @methodEventSub(world.beforeEvents.worldInitialize)
    register(args: WorldInitializeBeforeEvent) {
        args.blockComponentRegistry.registerCustomComponent('farmersdelight:rich_soil_farmland', new RichSoilFarmlandComponent());
    }

}
