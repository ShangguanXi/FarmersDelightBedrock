import { BlockCustomComponent, BlockComponentPlayerDestroyEvent, StructureManager, EntityInventoryComponent, BlockComponentTickEvent, Vector3, Dimension, BlockComponentOnPlaceEvent, LocationOutOfWorldBoundariesError, ItemComponentTypes, WorldInitializeBeforeEvent, world, BlockComponentPlayerPlaceBeforeEvent, BlockVolume, system } from "@minecraft/server";
import { ItemUtil } from "../../lib/ItemUtil";
import { methodEventSub } from "../../lib/eventHelper";
function spawnLoot(path: string, dimenion: Dimension, location: Vector3) {
    return dimenion.runCommand(`loot spawn ${location.x} ${location.y} ${location.z} loot "${path}"`)
}

class WildCropComponent implements BlockCustomComponent {

    constructor() {
        this.onPlayerDestroy = this.onPlayerDestroy.bind(this);
    }

    onPlayerDestroy(args: BlockComponentPlayerDestroyEvent): void {
        const player = args.player;
        const block = args.block;
        const dimension = args.dimension;
        const container = player?.getComponent("inventory")?.container;
        const lootTable = this.getLootTable();
        const lootItem = this.lootItem();
        if (!player) return;
        if (!container) return;
        const selectedSlot = container?.getSlot(player.selectedSlotIndex)
        const itemId = selectedSlot.typeId;
        const silkTouch = container?.getItem(player.selectedSlotIndex)?.getComponent(ItemComponentTypes.Enchantable)?.hasEnchantment("silk_touch");
        try {
            if (itemId == "minecraft:shears") {
                ItemUtil.damageItem(container, player.selectedSlotIndex, 1)
                ItemUtil.spawnItem(block, lootItem)
    
            };
            if ((itemId != "minecraft:shears") && (!silkTouch)) {
                spawnLoot(lootTable, dimension, block.location)
            };
        } catch (error) {
            spawnLoot(lootTable, dimension, block.location)
        }
       
    };
    getLootTable(): string {
        return "";

    }
    lootItem(): string {
        return "";

    }



}
class WildBeetrootsComponent extends WildCropComponent {
    getLootTable(): string {
        return "farmersdelight/crops/farmersdelight_wild_beetroot";

    }
    lootItem(): string {
        return "farmersdelight:wild_beetroots";

    }
}
class WildCabbagesComponent extends WildCropComponent {
    getLootTable(): string {
        return "farmersdelight/crops/farmersdelight_wild_cabbage";

    }
    lootItem(): string {
        return "farmersdelight:wild_cabbages";

    }
}
class WildCarrotComponent extends WildCropComponent {
    getLootTable(): string {
        return "farmersdelight/crops/farmersdelight_wild_carrot";

    }
    lootItem(): string {
        return "farmersdelight:wild_carrots";

    }
}
class WildOnionComponent extends WildCropComponent {
    getLootTable(): string {
        return "farmersdelight/crops/farmersdelight_wild_onion";

    }
    lootItem(): string {
        return "farmersdelight:wild_onions";

    }
}
class WildPotatoComponent extends WildCropComponent {
    getLootTable(): string {
        return "farmersdelight/crops/farmersdelight_wild_potato";

    }
    lootItem(): string {
        return "farmersdelight:wild_potatoes";

    }
}
class WildTomatoComponent extends WildCropComponent {
    getLootTable(): string {
        return "farmersdelight/crops/farmersdelight_wild_tomato";

    }
    lootItem(): string {
        return "farmersdelight:wild_tomatoes";

    }
}
class WildRiceComponent extends WildCropComponent {
    constructor() {
        super();
        this.beforeOnPlayerPlace = this.beforeOnPlayerPlace.bind(this);
        this.onTick = this.onTick.bind(this);
    }
    beforeOnPlayerPlace(args: BlockComponentPlayerPlaceBeforeEvent): void {

        const player = args.player;
        const container = player?.getComponent("inventory")?.container;
        const block = args.block;
        const dimension = args.dimension;
        const upBlockId = dimension.getBlock({ x: block.location.x, y: block.location.y + 1, z: block.location.z })?.typeId

        if (upBlockId == "minecraft:water" || upBlockId != "minecraft:air") {
            args.cancel = true;
        }
        else {
            world.structureManager.place("farmersdelight:wild_rice_no_water", dimension, block.location);
            if (!player) return;
            if (!container) return;
            system.runTimeout(() => {
                ItemUtil.clearItem(container, player.selectedSlotIndex, 1)
                world.playSound("dig.grass", block.location)
            })


        }
    }
    onTick(args: BlockComponentTickEvent): void {
        const block = args.block;
        const dimension = args.dimension;
        const blockState = block.permutation.getState("farmersdelight:wild_rice")
        if (blockState == 0) {
            const upBlockId = dimension.getBlock({ x: block.location.x, y: block.location.y + 1, z: block.location.z })?.typeId
            if (upBlockId != "farmersdelight:wild_rice") {
                dimension.setBlockType(block.location, "minecraft:air")
            }
        }
    }




    getLootTable(): string {
        return "farmersdelight/crops/farmersdelight_wild_rice";

    }
    lootItem(): string {
        return "farmersdelight:wild_rice";

    }
}
class SandyShrubComponent extends WildCropComponent {
    getLootTable(): string {
        return "farmersdelight/empty";

    }
    lootItem(): string {
        return "farmersdelight:sandy_shrub";

    }
}
export class WildCropComponentRegister {
    @methodEventSub(world.beforeEvents.worldInitialize)
    register(args: WorldInitializeBeforeEvent) {
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:wild_beetroots', new WildBeetrootsComponent());
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:wild_cabbages', new WildCabbagesComponent());
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:wild_carrots', new WildCarrotComponent());
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:wild_onions', new WildOnionComponent());
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:wild_potatoes', new WildPotatoComponent());
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:wild_tomatoes', new WildTomatoComponent());
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:wild_rice', new WildRiceComponent());
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:sandy_shrub', new SandyShrubComponent());
    }

}
