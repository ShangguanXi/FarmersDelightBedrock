var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BlockPermutation, } from "@minecraft/server";
import { hurtItem, takeItem } from "../../lib/ItemUtil";
import { blockComponent } from "../../lib/EventSubscriber";
let RichSoilComponent = class RichSoilComponent {
    onPlayerInteract(args) {
        const player = args.player;
        const face = args.face;
        const inventory = player?.getComponent("inventory");
        const container = inventory?.container;
        const block = args.block;
        const dimension = args.dimension;
        if (!player)
            return;
        if (!container)
            return;
        const selectedSlot = container?.getSlot(player.selectedSlotIndex);
        try {
            const itemId = selectedSlot?.typeId;
            const hoeTag = selectedSlot.hasTag("minecraft:is_hoe");
            const topLocation = { x: block.location.x, y: block.location.y + 1, z: block.location.z };
            const topBlockId = dimension.getBlock(topLocation)?.typeId;
            if (face == 'Up' && topBlockId == "minecraft:air") {
                if (itemId == "minecraft:sugar_cane") {
                    dimension.playSound("dig.grass", block.location);
                    dimension.setBlockType(topLocation, "farmersdelight:rich_soil_sugar_cane_bottom");
                    takeItem(container, player.selectedSlotIndex, 1);
                }
                if (itemId == "minecraft:brown_mushroom") {
                    dimension.playSound("dig.grass", block.location);
                    dimension.setBlockType(topLocation, "farmersdelight:brown_mushroom_colony");
                    takeItem(container, player.selectedSlotIndex, 1);
                }
                if (itemId == "minecraft:red_mushroom") {
                    dimension.playSound("dig.grass", block.location);
                    dimension.setBlockType(topLocation, "farmersdelight:red_mushroom_colony");
                    takeItem(container, player.selectedSlotIndex, 1);
                }
            }
            if (hoeTag) {
                dimension.setBlockType(block.location, "farmersdelight:rich_soil_farmland");
                dimension.playSound("use.gravel", block.location);
                hurtItem(container, player.selectedSlotIndex, 1);
            }
        }
        catch (error) {
        }
    }
    onRandomTick(event, _) {
        const above = event.block.above();
        switch (above?.typeId) {
            case "minecraft:brown_mushroom":
                above.setPermutation(BlockPermutation.resolve("farmersdelight:brown_mushroom_colony", { "farmersdelight:growth": 1 }));
                return;
            case "minecraft:red_mushroom":
                above.setPermutation(BlockPermutation.resolve("farmersdelight:red_mushroom_colony", { "farmersdelight:growth": 1 }));
                return;
        }
        if (above?.getComponent("farmersdelight:mushroom_cluster")) {
            const permutation = above.permutation;
            if (permutation.getState("farmersdelight:growth") === 0) {
                above.setPermutation(permutation.withState("farmersdelight:growth", 1));
            }
        }
    }
};
RichSoilComponent = __decorate([
    blockComponent("farmersdelight:rich_soil")
], RichSoilComponent);
export { RichSoilComponent };
