import {
    BlockComponentPlayerInteractEvent,
    BlockComponentRandomTickEvent,
    BlockCustomComponent,
    BlockPermutation,
    CustomComponentParameters,
    EntityInventoryComponent,
} from "@minecraft/server";
import { ItemUtil } from "../../lib/ItemUtil";
import { blockComponent } from "../../lib/EventSubscriber";

@blockComponent("farmersdelight:rich_soil")
export class RichSoilComponent implements BlockCustomComponent {
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
        try {
            const itemId = selectedSlot?.typeId;
            const hoeTag = selectedSlot.hasTag("minecraft:is_hoe");
            const topLocation = { x: block.location.x, y: block.location.y + 1, z: block.location.z }
            const topBlockId = dimension.getBlock(topLocation)?.typeId
            if (face == 'Up' && topBlockId == "minecraft:air") {
                if (itemId == "minecraft:sugar_cane") {
                    dimension.playSound("dig.grass", block.location)
                    dimension.setBlockType(topLocation, "farmersdelight:rich_soil_sugar_cane_bottom")
                    ItemUtil.clearItem(container,player.selectedSlotIndex)
                }
                if (itemId == "minecraft:brown_mushroom") {
                    dimension.playSound("dig.grass", block.location)
                    dimension.setBlockType(topLocation, "farmersdelight:brown_mushroom_colony")
                    ItemUtil.clearItem(container,player.selectedSlotIndex)

                }
                if (itemId == "minecraft:red_mushroom") {
                    dimension.playSound("dig.grass", block.location)
                    dimension.setBlockType(topLocation, "farmersdelight:red_mushroom_colony")
                    ItemUtil.clearItem(container,player.selectedSlotIndex)

                }

            }
            if (hoeTag) {
                dimension.setBlockType(block.location, "farmersdelight:rich_soil_farmland")
                dimension.playSound("use.gravel", block.location)
                ItemUtil.damageItem(container, player.selectedSlotIndex, 1)
            }

        } catch (error) {

        }
    }

    onRandomTick(event: BlockComponentRandomTickEvent, _: CustomComponentParameters): void {
        const above = event.block.above();
        switch (above?.typeId) {
            case "minecraft:brown_mushroom":
                above!!.setPermutation(BlockPermutation.resolve(
                    "farmersdelight:brown_mushroom_colony",
                    { "farmersdelight:growth": 1 },
                ));
                return;
            case "minecraft:red_mushroom":
                above!!.setPermutation(BlockPermutation.resolve(
                    "farmersdelight:red_mushroom_colony",
                    { "farmersdelight:growth": 1 },
                ));
                return;
        }
        if (above?.getComponent("farmersdelight:mushroom_cluster")) { // 怎么没有hasComponent
            const permutation = above!!.permutation;
            if (permutation.getState("farmersdelight:growth") === 0) {
                above!!.setPermutation(permutation.withState("farmersdelight:growth", 1));
                // return;
            }
        }
    }
}
