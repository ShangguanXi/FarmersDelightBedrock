var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Direction, EquipmentSlot, GameMode, } from "@minecraft/server";
import { COMPOST_ACTIVATORS } from "../../data/CompostActivators";
import { takeItemInSlot } from "../../lib/ItemUtil";
import { blockComponent } from "../../lib/EventSubscriber";
import { volumeAround } from "../../lib/BlockUtil";
import { getEquipmentSlot } from "../../lib/EntityUtil";
let OrganicCompostComponent = class OrganicCompostComponent {
    onPlayerInteract(event, _) {
        if (event.face !== Direction.Up)
            return;
        let block;
        const player = event.player;
        const slot = getEquipmentSlot(player, EquipmentSlot.Mainhand);
        switch (slot?.getItem()?.typeId) {
            case "minecraft:brown_mushroom":
                block = "farmersdelight:brown_mushroom_colony";
                break;
            case "minecraft:red_mushroom":
                block = "farmersdelight:red_mushroom_colony";
                break;
            default:
                return;
        }
        const pos = event.block;
        const { dimension, x, y, z } = pos;
        dimension.playSound("dig.grass", pos);
        dimension.setBlockType({ x: x, y: y + 1, z: z }, block);
        if (player.getGameMode() === GameMode.Creative)
            return;
        takeItemInSlot(slot);
    }
    onRandomTick(event, _) {
        const center = event.block;
        const dimension = center.dimension;
        let moisturized = false;
        let chance = 0.05;
        let maxLight = 0;
        for (const location of volumeAround(center, 1, 1, 1).getBlockLocationIterator()) {
            const block = dimension.getBlock(location);
            if (!block)
                continue;
            if (COMPOST_ACTIVATORS.has(block.typeId) || block.hasTag("compost_activators")) {
                chance += 0.02;
            }
            if (block.isWaterlogged || block.typeId === "minecraft:water") {
                moisturized = true;
            }
            const light = dimension.getSkyLightLevel({
                x: location.x,
                y: location.y + 1,
                z: location.z,
            });
            if (light > maxLight) {
                maxLight = light;
            }
        }
        if (maxLight > 12) {
            chance += 0.05;
        }
        if (moisturized) {
            chance += 0.1;
        }
        if (Math.random() < chance) {
            const process = center.permutation.getState("farmersdelight:process") ?? 0;
            if (process < 7) {
                center.setPermutation(center.permutation.withState("farmersdelight:process", process + 1));
            }
            else {
                center.setType("farmersdelight:rich_soil");
            }
        }
    }
};
OrganicCompostComponent = __decorate([
    blockComponent("farmersdelight:organic_compost")
], OrganicCompostComponent);
export { OrganicCompostComponent };
