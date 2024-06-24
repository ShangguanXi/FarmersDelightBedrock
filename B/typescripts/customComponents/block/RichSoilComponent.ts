import { BlockComponentPlayerInteractEvent, BlockCustomComponent, ItemEnchantableComponent, WorldInitializeBeforeEvent, world } from "@minecraft/server";
import { ItemUtil } from "../../lib/ItemUtil";
import { methodEventSub } from "../../lib/eventHelper";

class RichSoilComponent implements BlockCustomComponent {
    constructor() {
        this.onPlayerInteract = this.onPlayerInteract.bind(this);


    }
    onPlayerInteract(args: BlockComponentPlayerInteractEvent): void {

        const player = args.player;
        const face = args.face;
        const container = player?.getComponent("inventory")?.container;
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
                    world.playSound("dig.grass", block.location)
                    dimension.setBlockType(topLocation, "farmersdelight:rich_soil_sugar_cane_bottom")
                }
                if (itemId == "minecraft:brown_mushroom") {
                    world.playSound("dig.grass", block.location)
                    dimension.setBlockType(topLocation, "farmersdelight:brown_mushroom_colony")

                }
                if (itemId == "minecraft:red_mushroom") {
                    world.playSound("dig.grass", block.location)
                    dimension.setBlockType(topLocation, "farmersdelight:red_mushroom_colony")

                }

            }
            if (hoeTag) {
                dimension.setBlockType(block.location, "farmersdelight:rich_soil_farmland")
                world.playSound("use.gravel", block.location)
                ItemUtil.damageItem(container, player.selectedSlotIndex, 1)
            }

        } catch (error) {

        }


    }
}
export class RichSoilComponentRegister {
    @methodEventSub(world.beforeEvents.worldInitialize)
    register(args: WorldInitializeBeforeEvent) {
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:rich_soil', new RichSoilComponent());
    }

}
