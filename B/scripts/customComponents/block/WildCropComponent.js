var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ItemComponentTypes, WorldInitializeBeforeEvent, world, system } from "@minecraft/server";
import { ItemUtil } from "../../lib/ItemUtil";
import { methodEventSub } from "../../lib/eventHelper";
function spawnLoot(path, dimenion, location) {
    return dimenion.runCommand(`loot spawn ${location.x} ${location.y} ${location.z} loot "${path}"`);
}
class WildCropComponent {
    constructor() {
        this.onPlayerDestroy = this.onPlayerDestroy.bind(this);
    }
    onPlayerDestroy(args) {
        const player = args.player;
        const block = args.block;
        const dimension = args.dimension;
        const container = player?.getComponent("inventory")?.container;
        const lootTable = this.getLootTable();
        const lootItem = this.lootItem();
        if (!player)
            return;
        if (!container)
            return;
        const selectedSlot = container?.getSlot(player.selectedSlotIndex);
        const itemId = selectedSlot.typeId;
        const silkTouch = container?.getItem(player.selectedSlotIndex)?.getComponent(ItemComponentTypes.Enchantable)?.hasEnchantment("silk_touch");
        if (itemId == "minecraft:shears") {
            ItemUtil.damageItem(container, player.selectedSlotIndex, 1);
            ItemUtil.spawnItem(block, lootItem);
        }
        ;
        if ((itemId != "minecraft:shears") && (!silkTouch)) {
            spawnLoot(lootTable, dimension, block.location);
        }
        ;
    }
    ;
    getLootTable() {
        return "";
    }
    lootItem() {
        return "";
    }
}
class WildBeetrootsComponent extends WildCropComponent {
    getLootTable() {
        return "farmersdelight/crops/farmersdelight_wild_beetroot";
    }
    lootItem() {
        return "farmersdelight:wild_beetroots";
    }
}
class WildCabbagesComponent extends WildCropComponent {
    getLootTable() {
        return "farmersdelight/crops/farmersdelight_wild_cabbage";
    }
    lootItem() {
        return "farmersdelight:wild_cabbages";
    }
}
class WildCarrotComponent extends WildCropComponent {
    getLootTable() {
        return "farmersdelight/crops/farmersdelight_wild_carrot";
    }
    lootItem() {
        return "farmersdelight:wild_carrots";
    }
}
class WildOnionComponent extends WildCropComponent {
    getLootTable() {
        return "farmersdelight/crops/farmersdelight_wild_onion";
    }
    lootItem() {
        return "farmersdelight:wild_onions";
    }
}
class WildPotatoComponent extends WildCropComponent {
    getLootTable() {
        return "farmersdelight/crops/farmersdelight_wild_potato";
    }
    lootItem() {
        return "farmersdelight:wild_potatoes";
    }
}
class WildTomatoComponent extends WildCropComponent {
    getLootTable() {
        return "farmersdelight/crops/farmersdelight_wild_tomato";
    }
    lootItem() {
        return "farmersdelight:wild_tomatoes";
    }
}
class WildRiceComponent extends WildCropComponent {
    constructor() {
        super();
        this.beforeOnPlayerPlace = this.beforeOnPlayerPlace.bind(this);
        this.onTick = this.onTick.bind(this);
    }
    beforeOnPlayerPlace(args) {
        const player = args.player;
        const container = player?.getComponent("inventory")?.container;
        const block = args.block;
        const dimension = args.dimension;
        const upBlockId = dimension.getBlock({ x: block.location.x, y: block.location.y + 1, z: block.location.z })?.typeId;
        if (upBlockId == "minecraft:water" || upBlockId != "minecraft:air") {
            args.cancel = true;
        }
        else {
            world.structureManager.place("farmersdelight:wild_rice_no_water", dimension, block.location);
            if (!player)
                return;
            if (!container)
                return;
            system.runTimeout(() => {
                ItemUtil.clearItem(container, player.selectedSlotIndex, 1);
                world.playSound("dig.grass", block.location);
            });
        }
    }
    onTick(args) {
        const block = args.block;
        const dimension = args.dimension;
        const blockState = block.permutation.getState("farmersdelight:wild_rice");
        if (blockState == 0) {
            const upBlockId = dimension.getBlock({ x: block.location.x, y: block.location.y + 1, z: block.location.z })?.typeId;
            if (upBlockId != "farmersdelight:wild_rice") {
                dimension.setBlockType(block.location, "minecraft:air");
            }
        }
    }
    getLootTable() {
        return "farmersdelight/crops/farmersdelight_wild_rice";
    }
    lootItem() {
        return "farmersdelight:wild_rice";
    }
}
class SandyShrubComponent extends WildCropComponent {
    getLootTable() {
        return "farmersdelight/empty";
    }
    lootItem() {
        return "farmersdelight:sandy_shrub";
    }
}
export class WildCropComponentRegister {
    register(args) {
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
__decorate([
    methodEventSub(world.beforeEvents.worldInitialize),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WorldInitializeBeforeEvent]),
    __metadata("design:returntype", void 0)
], WildCropComponentRegister.prototype, "register", null);
//# sourceMappingURL=WildCropComponent.js.map