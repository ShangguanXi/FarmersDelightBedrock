import {
    BlockPermutation,
    Direction,
    EquipmentSlot,
    GameMode,
    PlayerInteractWithBlockBeforeEvent,
    system,
    world,
} from "@minecraft/server";
import { subscribeEvent } from "../lib/EventSubscriber";
import { offsetByDirection } from "../lib/DirectionUtil";
import { takeEquippedItem } from "../lib/ItemUtil";

// noinspection JSUnusedGlobalSymbols
export class PumpkinPie {
    @subscribeEvent(world.beforeEvents.playerInteractWithBlock)
    static place(event: PlayerInteractWithBlockBeforeEvent) {
        const stack = event.itemStack;
        if (!stack || stack.typeId !== "minecraft:pumpkin_pie") return;
        if (!event.isFirstEvent ) return

        const block = event.block;
        const blockId = block.typeId
        if (blockId == "farmersdelight:cutting_board") return;
        const face = event.blockFace;
        if (face != Direction.Up) return;
        const pos = offsetByDirection(face, { x: block.x, y: block.y, z: block.z });
        const targetBlock = block.dimension.getBlock(pos);
        if (!targetBlock || !targetBlock.isAir) return;
        const player = event.player;
        const rotation = player.getRotation();
        const yRot = ((rotation.y % 360) + 360) % 360;
        let cardinalDirection: string = "south";
        if (yRot >= 315 || yRot < 45) cardinalDirection = "south";
        else if (yRot >= 45 && yRot < 135) cardinalDirection = "west";
        else if (yRot >= 135 && yRot < 225) cardinalDirection = "north";
        else cardinalDirection = "east";
        event.cancel = true;
        system.run(() => {
            targetBlock.setPermutation(BlockPermutation.resolve("farmersdelight:pumpkin_pie", {
                "farmersdelight:food_block_stage": 0,
                "minecraft:cardinal_direction": cardinalDirection,
            }));
            block.dimension.playSound("dig.cloth", pos);
            if (player.getGameMode() !== GameMode.Creative) {
                takeEquippedItem(player, EquipmentSlot.Mainhand, 1, false);
            }
        });
    }
}
