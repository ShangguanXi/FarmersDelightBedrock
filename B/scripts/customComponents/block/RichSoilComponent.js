var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BlockPermutation, Direction, EquipmentSlot, GameMode, } from "@minecraft/server";
import { hurtItemInSlot, takeItemInSlot } from "../../lib/ItemUtil";
import { blockComponent } from "../../lib/EventSubscriber";
import { getEquipmentSlot } from "../../lib/EntityUtil";
let RichSoilComponent = class RichSoilComponent {
    onPlayerInteract(event, _) {
        if (event.face !== Direction.Up)
            return;
        let block;
        const player = event.player;
        const slot = getEquipmentSlot(player, EquipmentSlot.Mainhand);
        const stack = slot?.getItem();
        switch (stack?.typeId) {
            case "minecraft:brown_mushroom":
                block = "farmersdelight:brown_mushroom_colony";
                break;
            case "minecraft:red_mushroom":
                block = "farmersdelight:red_mushroom_colony";
                break;
            case "minecraft:sugar_cane":
                block = "minecraft:reeds";
                break;
            default:
                if (stack?.hasTag("minecraft:is_hoe")) {
                    const pos = event.block;
                    if (pos.above()?.isAir) {
                        pos.setType("farmersdelight:rich_soil_farmland");
                        pos.dimension.playSound("use.gravel", pos.center());
                        if (player.getGameMode() !== GameMode.Creative) {
                            hurtItemInSlot(slot, stack);
                        }
                    }
                }
                return;
        }
        const pos = event.block;
        const { dimension, x, y, z } = pos;
        dimension.playSound("dig.grass", pos.center());
        dimension.setBlockType({ x: x, y: y + 1, z: z }, block);
        if (player.getGameMode() === GameMode.Creative)
            return;
        takeItemInSlot(slot, 1, false);
    }
    onRandomTick(event, _) {
        const crop = event.block.above();
        switch (crop?.typeId) {
            case "minecraft:brown_mushroom":
                crop.setPermutation(BlockPermutation.resolve("farmersdelight:brown_mushroom_colony", { "farmersdelight:growth": 1 }));
                return;
            case "minecraft:red_mushroom":
                crop.setPermutation(BlockPermutation.resolve("farmersdelight:red_mushroom_colony", { "farmersdelight:growth": 1 }));
                return;
        }
        if (crop?.getComponent("farmersdelight:mushroom_cluster")) {
            const permutation = crop.permutation;
            if (permutation.getState("farmersdelight:growth") === 0) {
                crop.setPermutation(permutation.withState("farmersdelight:growth", 1));
            }
        }
    }
};
RichSoilComponent = __decorate([
    blockComponent("farmersdelight:rich_soil")
], RichSoilComponent);
export { RichSoilComponent };
