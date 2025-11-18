import {
    BlockComponentPlayerInteractEvent,
    BlockCustomComponent,
    EntityInventoryComponent,
    StartupEvent,
    system,
} from "@minecraft/server";
import { ItemUtil } from "../../lib/ItemUtil";
import { subscribeEvent } from "../../lib/EventSubscriber";

class RichSoilComponent implements BlockCustomComponent {
    constructor() {
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
}
export class RichSoilComponentRegister {
    @subscribeEvent(system.beforeEvents.startup)
    register(args: StartupEvent) {
        args.blockComponentRegistry.registerCustomComponent('farmersdelight:rich_soil', new RichSoilComponent());
    }

}
