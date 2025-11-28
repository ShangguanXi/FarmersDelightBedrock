import {
    Block,
    Container,
    EntityInventoryComponent,
    ItemStack,
    Player,
    PlayerBreakBlockBeforeEvent,
    PlayerInteractWithBlockAfterEvent,
    system,
    world,
} from "@minecraft/server";
import { hurtEquippedItem, ItemUtil } from "../lib/ItemUtil";
import { subscribeEvent } from "../lib/EventSubscriber";
import { spawnLoot } from "../lib/LootUtil";


/**
 * @deprecated
 */
export class BlockFood {
    @subscribeEvent(world.afterEvents.playerInteractWithBlock)
    itemUseOn(args: PlayerInteractWithBlockAfterEvent) {
        const player: Player = args.player;
        const block: Block = args.block;
        const itemStack: ItemStack | undefined = args.itemStack;
        const blockFoodAllTag = block.getTags();
        const inventory = args.player?.getComponent("inventory") as EntityInventoryComponent;
        const container: Container | undefined = inventory?.container
        if (!container) return;
        for (const tag of blockFoodAllTag) {
            const nameSpace = tag?.split("-")[0]?.split(":")[0];
            const maxUse = Number(tag.split("-")[0]?.split(":")[1]);
            const item = tag?.split("-")[1];
            const itemType = item?.split(".")[0];
            const itemId = item?.split(".")[1];
            if (nameSpace == "farmersdelight.blockfood") {
                if (Number(block.permutation.getState("farmersdelight:food_block_stage")) != maxUse) {
                    if (!itemStack) {
                        player.onScreenDisplay.setActionBar({ translate: 'farmersdelight.blockfood.' + itemId });
                        return
                    }
                    if ((itemType == "tag" && itemStack.hasTag(itemId)) || (itemType == "item" && itemStack.typeId == itemId)) {
                        block.setPermutation(block.permutation.withState("farmersdelight:food_block_stage", Number(block.permutation.getState("farmersdelight:food_block_stage")) + 1));
                        const { x, y, z } = block;
                        const info = block.typeId.split(":");
                        spawnLoot(block.dimension, {
                            x: x + 0.5,
                            y: y + 1,
                            z: z + 0.5,
                        }, info[0] + "/food_block/" + info[1]);
                        ItemUtil.clearItem(container, player.selectedSlotIndex)
                    } else {
                        player.onScreenDisplay.setActionBar({ translate: 'farmersdelight.blockfood.' + itemId });
                    }
                } else {
                    const { x, y, z } = block;
                    const info = block.typeId.split(":");
                    spawnLoot(block.dimension, {
                        x: x + 0.5,
                        y: y + 1,
                        z: z + 0.5,
                    }, info[0] + "/food_block/" + info[1] + "_over");
                    block.setType("minecraft:air");
                }
                break
            }
        }

    }
    @subscribeEvent(world.beforeEvents.playerBreakBlock)
    break(event: PlayerBreakBlockBeforeEvent) {
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