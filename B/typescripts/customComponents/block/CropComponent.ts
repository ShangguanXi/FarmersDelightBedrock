import { BlockCustomComponent, BlockComponentPlayerInteractEvent, WorldInitializeBeforeEvent, world, Dimension, Vector3, BlockComponentRandomTickEvent, EntityInventoryComponent, Container } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { ItemUtil } from "../../lib/ItemUtil";
function spawnLoot(path: string, dimenion: Dimension, location: Vector3) {
    return dimenion.runCommand(`loot spawn ${location.x} ${location.y} ${location.z} loot "${path}"`)
}

class CropsComponent implements BlockCustomComponent {

    constructor() {
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
        this.onRandomTick = this.onRandomTick.bind(this);
    }

    onPlayerInteract(args: BlockComponentPlayerInteractEvent): void {
        const block = args.block;
        const player = args.player;
        const dimension = args.dimension
        const itemId = player?.getComponent("inventory")?.container?.getSlot(player.selectedSlotIndex).typeId
        const age = Number(block.permutation.getState("farmersdelight:growth"))
        const random = Math.floor(Math.random() * 101)
        if (!player) return;
        const container: Container | undefined = player.getComponent(EntityInventoryComponent.componentId)?.container;
        const lootTable = this.getLootTable();
        if (itemId == "minecraft:bone_meal" && age < 7) {
            if (player?.getGameMode() == "creative") {
                block.setPermutation(block.permutation.withState("farmersdelight:growth", 7))
            }
            else {
                if (random <= 60) {
                    block.setPermutation(block.permutation.withState("farmersdelight:growth", age + 1))
                }
                block.dimension.spawnParticle("minecraft:crop_growth_emitter", { x: block.location.x + 0.5, y: block.location.y + 0.5, z: block.location.z + 0.5 });
                if (!container) return;
                ItemUtil.clearItem(container, player?.selectedSlotIndex)
            }

        }
        if (age == 7) {
            block.setPermutation(block.permutation.withState("farmersdelight:growth", 0))
            spawnLoot(lootTable, dimension, { x: block.location.x, y: block.location.y, z: block.location.z })
        }

    }
    onRandomTick(args: BlockComponentRandomTickEvent): void {
        const block = args.block;
        const age = Number(block.permutation.getState("farmersdelight:growth"))
        if (age<7){
            block.setPermutation(block.permutation.withState("farmersdelight:growth", age+1))
        }
    }
    getLootTable(): string {
        return "";

    }

}
class CabbageComponent extends CropsComponent{
    getLootTable(): string {
        return "farmersdelight/crops/farmersdelight_cabbage_riped";

    }
}
class OnionComponent extends CropsComponent{
    getLootTable(): string {
        return "farmersdelight/crops/farmersdelight_onion_riped";

    }
}
class TomatoComponent extends CropsComponent{
    getLootTable(): string {
        return "farmersdelight/crops/farmersdelight_tomato_riped";

    }
}
export class CropComponentRegister {
    @methodEventSub(world.beforeEvents.worldInitialize)
    register(args: WorldInitializeBeforeEvent) {
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:cabbage', new CabbageComponent());
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:onion', new OnionComponent());
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:tomato', new TomatoComponent());
    }

}