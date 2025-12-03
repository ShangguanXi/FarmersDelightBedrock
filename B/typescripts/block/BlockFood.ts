import {
    Block, EquipmentSlot,
    ItemStack,
    PlayerBreakBlockBeforeEvent,
    PlayerInteractWithBlockAfterEvent,
    system,
    world,
} from "@minecraft/server";
import { hurtEquippedItem, takeEquippedItem } from "../lib/ItemUtil";
import { subscribeEvent } from "../lib/EventSubscriber";
import { spawnLoot } from "../lib/LootUtil";

/**
 * @deprecated
 */
export class BlockFood {
    @subscribeEvent(world.afterEvents.playerInteractWithBlock)
    static itemUseOn(event: PlayerInteractWithBlockAfterEvent) {
        const block: Block = event.block;
        const permutation = block.permutation;
        const stack: ItemStack | undefined = event.itemStack;
        let notice: string | undefined = undefined;
        let stage: number | undefined = undefined;
        for (const tag of block.getTags()) {
            const spec = tag.split("-");
            if (!spec[0].startsWith("farmersdelight.blockfood:")) continue;
            if (stage === undefined) {
                stage = permutation.getState("farmersdelight:food_block_stage");
                if (stage === undefined) return;
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
    @subscribeEvent(world.beforeEvents.playerBreakBlock)
    static break(event: PlayerBreakBlockBeforeEvent) {
        const block: Block = event.block;
        if (block.hasTag("farmersdelight:blockfood") && !block.getComponent("farmersdelight:dish")) {
            if (block.permutation.getState("farmersdelight:food_block_stage")) {
                system.run(() => block.setType("minecraft:air"));
            } else {
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