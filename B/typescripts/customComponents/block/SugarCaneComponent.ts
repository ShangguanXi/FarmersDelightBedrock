import {
    BlockComponentPlayerInteractEvent,
    BlockComponentRandomTickEvent,
    BlockCustomComponent,
    CustomComponentParameters,
    Direction,
    EquipmentSlot,
    GameMode,
} from "@minecraft/server";
import { blockComponent } from "../../lib/EventSubscriber";
import { getEquipmentSlot } from "../../lib/EntityUtil";
import { resolveSpec } from "../../lib/ObjectUtil";
import { playBoneMealEffect } from "./CropComponent";
import { takeItemInSlot } from "../../lib/ItemUtil";

@blockComponent("farmersdelight:sugar_cane")
export class SugarCaneComponent implements BlockCustomComponent {
    onPlayerInteract(event: BlockComponentPlayerInteractEvent, params: CustomComponentParameters): void {
        const block = event.block;
        const face = event.face;
        const player = event.player;
        const slot = getEquipmentSlot(player, EquipmentSlot.Mainhand);
        switch (slot?.getItem()?.typeId) { // empty -> undefined
            case "minecraft:sugar_cane":
                if (face != Direction.Up) return;
                const successor = params.params as string; // allow self
                const above = block.above();
                if (above?.isAir) {
                    above.setType(successor);
                    event.dimension.playSound("dig.grass", block);
                    if (player!!.getGameMode() !== GameMode.Creative) {
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
        let successor: string | undefined = params.params as string;
        while (successor && successor !== self.typeId) {
            const above = self.above();
            if (above?.isAir) {
                above.setType(successor);
                unchanged = false;
            } else if (above?.typeId !== successor) break;
            self = above;
            successor = resolveSpec<string>(self, "farmersdelight:sugar_cane");
        }
        if (unchanged) return;
        playBoneMealEffect(block, event.dimension);
        if (player!!.getGameMode() !== GameMode.Creative) {
            takeItemInSlot(slot, 1, false);
        }
    }

    onRandomTick(event: BlockComponentRandomTickEvent, params: CustomComponentParameters): void {
        const block = event.block;
        const age = block.permutation.getState("farmersdelight:growth");
        if (age !== undefined && age < 15) {
            block.setPermutation(block.permutation.withState("farmersdelight:growth", age + 1));
        } else {
            const successor = params.params as string;
            if (successor === block.typeId) return;
            const above = block.above();
            if (above?.isAir) {
                above.setType(successor);
            }
        }
    }
}