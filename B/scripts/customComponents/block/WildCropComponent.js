var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { system, StartupEvent, world, PlayerBreakBlockBeforeEvent, ItemComponentTypes } from "@minecraft/server";
import { ItemUtil } from "../../lib/ItemUtil";
import { methodEventSub } from "../../lib/eventHelper";
export class WildCropComponent {
    constructor() {
        this.onPlace = this.onPlace.bind(this);
    }
    onPlace(args) { }
    break(args) {
        const block = args.block;
        const wildCrop = block.getComponent('farmersdelight:wild_crop');
        if (!wildCrop)
            return;
        const itemStack = args.itemStack;
        const player = args.player;
        const { x, y, z } = args.block.location;
        if (!itemStack)
            return;
        const enchant = itemStack.getComponent(ItemComponentTypes.Enchantable);
        const silkTouch = enchant?.getEnchantment('silk_touch');
        if (silkTouch)
            return;
        if (itemStack.typeId == "minecraft:shears") {
            const container = player.getComponent("inventory")?.container;
            if (!container)
                return;
            args.cancel = true;
            system.runTimeout(() => {
                ItemUtil.damageItem(container, player.selectedSlotIndex);
                ItemUtil.spawnItem(block, block.typeId);
                block.dimension.runCommand(`/setblock ${x} ${y} ${z} air`);
            });
        }
    }
    register(args) {
        args.blockComponentRegistry.registerCustomComponent('farmersdelight:wild_crop', new WildCropComponent());
        args.blockComponentRegistry.registerCustomComponent('farmersdelight:wild_rice', new WildRiceComponent());
    }
}
__decorate([
    methodEventSub(world.beforeEvents.playerBreakBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerBreakBlockBeforeEvent]),
    __metadata("design:returntype", void 0)
], WildCropComponent.prototype, "break", null);
__decorate([
    methodEventSub(system.beforeEvents.startup),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [StartupEvent]),
    __metadata("design:returntype", void 0)
], WildCropComponent.prototype, "register", null);
class WildRiceComponent {
    constructor() {
        this.beforeOnPlayerPlace = this.beforeOnPlayerPlace.bind(this);
        this.onTick = this.onTick.bind(this);
        this.onPlayerBreak = this.onPlayerBreak.bind(this);
    }
    onPlayerBreak(args) {
        const player = args.player;
        const block = args.block;
        const dimension = args.dimension;
        const inventory = player?.getComponent("inventory");
        const container = inventory?.container;
        const lootTable = this.getLootTable();
        const lootItem = this.lootItem();
        if (!player)
            return;
        if (!container)
            return;
        try {
            const selectedSlot = container?.getSlot(player.selectedSlotIndex);
            const itemId = selectedSlot.typeId;
            const enchantable = container?.getItem(player.selectedSlotIndex)?.getComponent(ItemComponentTypes.Enchantable);
            const silkTouch = enchantable?.hasEnchantment("silk_touch");
            if (itemId == "minecraft:shears") {
                ItemUtil.damageItem(container, player.selectedSlotIndex, 1);
                ItemUtil.spawnItem(block, lootItem);
            }
            ;
            if ((itemId != "minecraft:shears") && (!silkTouch)) {
                this.spawnLoot(lootTable, dimension, block.location);
            }
            ;
        }
        catch (error) {
            this.spawnLoot(lootTable, dimension, block.location);
        }
    }
    ;
    beforeOnPlayerPlace(args) {
        const player = args.player;
        const inventory = player?.getComponent("inventory");
        const container = inventory?.container;
        const block = args.block;
        const dimension = args.dimension;
        const upBlockId = dimension.getBlock({ x: block.location.x, y: block.location.y + 1, z: block.location.z })?.typeId;
        if (upBlockId == "minecraft:water" || upBlockId != "minecraft:air") {
            args.cancel = true;
        }
        else {
            if (!player)
                return;
            if (!container)
                return;
            system.runTimeout(() => {
                world.structureManager.place("farmersdelight:wild_rice_no_water", dimension, block.location);
                ItemUtil.clearItem(container, player.selectedSlotIndex, 1);
                dimension.playSound("dig.grass", block.location);
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
    spawnLoot(path, dimenion, location) {
        return dimenion.runCommand(`loot spawn ${location.x} ${location.y} ${location.z} loot "${path}"`);
    }
    getLootTable() {
        return "farmersdelight/crops/farmersdelight_wild_rice";
    }
    lootItem() {
        return "farmersdelight:wild_rice";
    }
}
