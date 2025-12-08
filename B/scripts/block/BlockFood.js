var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { EquipmentSlot, ItemStack, PlayerBreakBlockBeforeEvent, PlayerInteractWithBlockAfterEvent, system, world, } from "@minecraft/server";
import { hurtEquippedItem, takeEquippedItem } from "../lib/ItemUtil";
import { subscribeEvent } from "../lib/EventSubscriber";
import { spawnLoot } from "../lib/LootUtil";
export class BlockFood {
    static itemUseOn(event) {
        const block = event.block;
        const permutation = block.permutation;
        const stack = event.itemStack;
        let notice = undefined;
        let stage = undefined;
        for (const tag of block.getTags()) {
            const spec = tag.split("-");
            if (!spec[0].startsWith("farmersdelight.blockfood:"))
                continue;
            if (stage === undefined) {
                stage = permutation.getState("farmersdelight:food_block_stage");
                if (stage === undefined)
                    return;
            }
            if (stage === parseInt(spec[0].substring(25))) {
                const { x, y, z } = block;
                const info = block.typeId.split(":");
                spawnLoot(block.dimension, {
                    x: x + 0.5,
                    y: y + 1,
                    z: z + 0.5,
                }, info[0] + "/food_block/" + info[1] + "_over");
                block.setType("minecraft:air");
                return;
            }
            const predicate = spec[1].split(".");
            const itemId = predicate[1];
            if (!stack) {
                notice = "farmersdelight.blockfood." + itemId;
                continue;
            }
            if (stack.typeId === itemId && (predicate[0] === "tag" && stack.hasTag(itemId))) {
                const { x, y, z } = block;
                const info = block.typeId.split(":");
                spawnLoot(block.dimension, {
                    x: x + 0.5,
                    y: y + 1,
                    z: z + 0.5,
                }, info[0] + "/food_block/" + info[1]);
                block.setPermutation(permutation.withState("farmersdelight:food_block_stage", stage + 1));
                takeEquippedItem(event.player, EquipmentSlot.Mainhand, 1, false);
                return;
            }
        }
        if (notice) {
            event.player.onScreenDisplay.setActionBar({ translate: "farmersdelight.blockfood." + notice });
        }
    }
    static break(event) {
        const block = event.block;
        if (block.hasTag("farmersdelight:blockfood") && !block.getComponent("farmersdelight:dish")) {
            if (block.permutation.getState("farmersdelight:food_block_stage")) {
                system.run(() => block.setType("minecraft:air"));
            }
            else {
                system.run(() => {
                    block.dimension.spawnItem(new ItemStack(block.typeId + "_item"), block);
                    block.setType("minecraft:air");
                    block.dimension.playSound("dig.cloth", block);
                    hurtEquippedItem(event.player, event.itemStack);
                });
            }
            event.cancel = true;
        }
    }
}
__decorate([
    subscribeEvent(world.afterEvents.playerInteractWithBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerInteractWithBlockAfterEvent]),
    __metadata("design:returntype", void 0)
], BlockFood, "itemUseOn", null);
__decorate([
    subscribeEvent(world.beforeEvents.playerBreakBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerBreakBlockBeforeEvent]),
    __metadata("design:returntype", void 0)
], BlockFood, "break", null);
