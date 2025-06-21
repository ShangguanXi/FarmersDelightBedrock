import { BlockCustomComponent, BlockComponentRandomTickEvent, world, StartupEvent, system, BlockPermutation, BlockVolume, BlockComponentPlayerPlaceBeforeEvent, BlockComponentPlayerInteractEvent, EntityInventoryComponent } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper"
import { organicCompostDetectList } from "../../data/organicCompostDetect";
import { ItemUtil } from "../../lib/ItemUtil";

class OrganicCompostComonent implements BlockCustomComponent {
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
        if (!selectedSlot.getItem()) return
        const itemId = selectedSlot?.typeId;
        const topLocation = { x: block.location.x, y: block.location.y + 1, z: block.location.z }
        const topBlockId = dimension.getBlock(topLocation)?.typeId
        if (face == 'Up' && topBlockId == "minecraft:air") {
            if (itemId == "minecraft:brown_mushroom") {
                dimension.playSound("dig.grass", block.location)
                dimension.setBlockType(topLocation, "farmersdelight:brown_mushroom_colony")
                ItemUtil.clearItem(container, player.selectedSlotIndex)

            }
            if (itemId == "minecraft:red_mushroom") {
                dimension.playSound("dig.grass", block.location)
                dimension.setBlockType(topLocation, "farmersdelight:red_mushroom_colony")
                ItemUtil.clearItem(container, player.selectedSlotIndex)

            }

        }
    }
    onRandomTick(args: BlockComponentRandomTickEvent): void {
        let transChance: number = 0.1;
        let hasWater: boolean = false;
        const compostBlock = args.block;
        if (compostBlock?.typeId !== "farmersdelight:organic_compost") return;
        const currentProcess = compostBlock.permutation.getState("farmersdelight:process") as number ?? 0;
        const { x, y, z } = compostBlock.location;
        const dimension = compostBlock.dimension;
        const fromLocation = { x: x - 1, y: y - 1, z: z - 1 };
        const toLocation = { x: x + 1, y: y + 1, z: z + 1 };
        const detectLocs = new BlockVolume(fromLocation, toLocation).getBlockLocationIterator();
        for (const location of detectLocs) {
            const block = dimension.getBlock(location);
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
    @methodEventSub(system.beforeEvents.startup)
    register(args: StartupEvent) {
        args.blockComponentRegistry.registerCustomComponent('farmersdelight:organic_compost', new OrganicCompostComonent());
    }

}