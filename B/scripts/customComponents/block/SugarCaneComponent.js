var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Direction, EquipmentSlot, GameMode, } from "@minecraft/server";
import { blockComponent } from "../../lib/EventSubscriber";
import { getEquipmentSlot } from "../../lib/EntityUtil";
import { resolveSpec } from "../../lib/ObjectUtil";
import { playBoneMealEffect } from "./CropComponent";
import { takeItemInSlot } from "../../lib/ItemUtil";
let SugarCaneComponent = class SugarCaneComponent {
    onPlayerInteract(event, params) {
        const block = event.block;
        const face = event.face;
        const player = event.player;
        const slot = getEquipmentSlot(player, EquipmentSlot.Mainhand);
        switch (slot?.getItem()?.typeId) {
            case "minecraft:sugar_cane":
                if (face != Direction.Up)
                    return;
                const successor = params.params;
                const above = block.above();
                if (above?.isAir) {
                    above.setType(successor);
                    event.dimension.playSound("dig.grass", block);
                    if (player.getGameMode() !== GameMode.Creative) {
                        takeItemInSlot(slot, 1, false);
                    }
                }
                return;
            case "minecraft:bone_meal":
            case "minecraft:rapid_fertilizer":
                break;
            default:
                return;
        }
        let unchanged = true;
        let self = block;
        let successor = params.params;
        while (successor && successor !== self.typeId) {
            const above = self.above();
            if (above?.isAir) {
                above.setType(successor);
                unchanged = false;
            }
            else if (above?.typeId !== successor)
                break;
            self = above;
            successor = resolveSpec(self, "farmersdelight:sugar_cane");
        }
        if (unchanged)
            return;
        playBoneMealEffect(block, event.dimension);
        if (player.getGameMode() !== GameMode.Creative) {
            takeItemInSlot(slot, 1, false);
        }
    }
    onRandomTick(event, params) {
        const block = event.block;
        const age = block.permutation.getState("farmersdelight:growth");
        if (age !== undefined && age < 15) {
            block.setPermutation(block.permutation.withState("farmersdelight:growth", age + 1));
        }
        else {
            const successor = params.params;
            if (successor === block.typeId)
                return;
            const above = block.above();
            if (above?.isAir) {
                above.setType(successor);
            }
        }
    }
};
SugarCaneComponent = __decorate([
    blockComponent("farmersdelight:sugar_cane")
], SugarCaneComponent);
export { SugarCaneComponent };
