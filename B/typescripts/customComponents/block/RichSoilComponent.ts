import {
    BlockComponentPlayerInteractEvent,
    BlockComponentRandomTickEvent,
    BlockCustomComponent,
    BlockPermutation,
    CustomComponentParameters,
    Direction,
    EquipmentSlot,
    GameMode,
} from "@minecraft/server";
import { hurtItemInSlot, takeItemInSlot } from "../../lib/ItemUtil";
import { blockComponent } from "../../lib/EventSubscriber";
import { getEquipmentSlot } from "../../lib/EntityUtil";

@blockComponent("farmersdelight:rich_soil")
export class RichSoilComponent implements BlockCustomComponent {
    onPlayerInteract(event: BlockComponentPlayerInteractEvent, _: CustomComponentParameters): void {
        if (event.face !== Direction.Up) return;
        let block: string;
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
                        if (player!!.getGameMode() !== GameMode.Creative) {
                            hurtItemInSlot(slot!!, stack);
                        }
                    }
                }
                return;
        }
        // assert player && slot
        const pos = event.block;
        const { dimension, x, y, z } = pos;
        dimension.playSound("dig.grass", pos.center());
        dimension.setBlockType({ x: x, y: y + 1, z: z }, block); // TODO: use trySetPermutation
        if (player!!.getGameMode() === GameMode.Creative) return;
        takeItemInSlot(slot!!, 1, false);
    }

    onRandomTick(event: BlockComponentRandomTickEvent, _: CustomComponentParameters): void {
        const crop = event.block.above();
        switch (crop?.typeId) {
            case "minecraft:brown_mushroom":
                crop!!.setPermutation(BlockPermutation.resolve(
                    "farmersdelight:brown_mushroom_colony",
                    { "farmersdelight:growth": 1 },
                ));
                return;
            case "minecraft:red_mushroom":
                crop!!.setPermutation(BlockPermutation.resolve(
                    "farmersdelight:red_mushroom_colony",
                    { "farmersdelight:growth": 1 },
                ));
                return;
        }
        if (crop?.getComponent("farmersdelight:mushroom_cluster")) { // 怎么没有hasComponent
            const permutation = crop!!.permutation;
            if (permutation.getState("farmersdelight:growth") === 0) {
                crop!!.setPermutation(permutation.withState("farmersdelight:growth", 1));
                // return;
            }
        }
    }
}
