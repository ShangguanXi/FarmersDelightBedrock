var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BlockPermutation, Direction, GameMode, ItemStack, Player, } from "@minecraft/server";
import { horizontalDirectionOf } from "../../lib/EntityUtil";
import { oppositeOf, offsetByDirection } from "../../lib/DirectionUtil";
import { itemComponent } from "../../lib/EventSubscriber";
import { spawnKnifeLoot } from "../../data/KnifeLoot";
import { hurtEquippedItem } from "../../lib/ItemUtil";
let KnifeComponent = class KnifeComponent {
    onMineBlock(event, _) {
        const stack = event.itemStack;
        if (!stack)
            return;
        const entity = event.source;
        if (entity instanceof Player && entity.getGameMode() === GameMode.Creative)
            return;
        spawnKnifeLoot(event.block, event.minedBlockPermutation, stack);
        hurtEquippedItem(entity, stack);
    }
    onUseOn(event, _) {
        const block = event.block;
        if (block.typeId !== "minecraft:pumpkin")
            return;
        const entity = event.source;
        if (entity instanceof Player || entity.getGameMode() !== GameMode.Creative) {
            hurtEquippedItem(entity, event.itemStack);
        }
        const face = event.blockFace;
        const direction = face === Direction.Up || face === Direction.Down
            ? oppositeOf(horizontalDirectionOf(entity))
            : face;
        const offset = offsetByDirection(direction);
        block.setPermutation(BlockPermutation.resolve("minecraft:carved_pumpkin", {
            "minecraft:cardinal_direction": direction.toLowerCase(),
        }));
        const { dimension, x, y, z } = block;
        dimension.playSound("pumpkin.carve", block);
        const item = dimension.spawnItem(new ItemStack("minecraft:pumpkin_seeds", 4), {
            x: x + 0.5 + offset.x * 0.65,
            y: y + 0.1,
            z: z + 0.5 + offset.z * 0.65,
        });
        if (item) {
            item.clearVelocity();
            item.applyImpulse({
                x: 0.05 * offset.x + Math.random() * 0.02,
                y: 0.05,
                z: 0.05 * offset.z + Math.random() * 0.02,
            });
        }
    }
};
KnifeComponent = __decorate([
    itemComponent("farmersdelight:knife")
], KnifeComponent);
export { KnifeComponent };
