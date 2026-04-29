var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BlockPermutation, Direction, EquipmentSlot, GameMode, PlayerInteractWithBlockBeforeEvent, system, world, } from "@minecraft/server";
import { subscribeEvent } from "../lib/EventSubscriber";
import { offsetByDirection } from "../lib/DirectionUtil";
import { takeEquippedItem } from "../lib/ItemUtil";
export class PumpkinPie {
    static place(event) {
        const stack = event.itemStack;
        if (!stack || stack.typeId !== "minecraft:pumpkin_pie")
            return;
        if (!event.isFirstEvent)
            return;
        const block = event.block;
        const blockId = block.typeId;
        if (blockId == "farmersdelight:cutting_board")
            return;
        const face = event.blockFace;
        if (face != Direction.Up)
            return;
        const pos = offsetByDirection(face, { x: block.x, y: block.y, z: block.z });
        const targetBlock = block.dimension.getBlock(pos);
        if (!targetBlock || !targetBlock.isAir)
            return;
        const player = event.player;
        const rotation = player.getRotation();
        const yRot = ((rotation.y % 360) + 360) % 360;
        let cardinalDirection = "south";
        if (yRot >= 315 || yRot < 45)
            cardinalDirection = "south";
        else if (yRot >= 45 && yRot < 135)
            cardinalDirection = "west";
        else if (yRot >= 135 && yRot < 225)
            cardinalDirection = "north";
        else
            cardinalDirection = "east";
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
__decorate([
    subscribeEvent(world.beforeEvents.playerInteractWithBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerInteractWithBlockBeforeEvent]),
    __metadata("design:returntype", void 0)
], PumpkinPie, "place", null);
