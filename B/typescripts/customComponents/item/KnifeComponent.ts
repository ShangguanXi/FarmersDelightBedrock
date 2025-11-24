import {
    BlockPermutation,
    CustomComponentParameters,
    Direction,
    GameMode,
    ItemComponentMineBlockEvent,
    ItemComponentUseOnEvent,
    ItemCustomComponent,
    ItemStack,
    Player,
    StartupEvent,
    system,
} from "@minecraft/server";
import { horizontalDirectionOf } from "../../lib/EntityUtil";
import { oppositeOf, offsetByDirection } from "../../lib/DirectionUtil";
import { subscribeEvent } from "../../lib/EventSubscriber";
import { spawnLootAtBlock } from "../../lib/LootUtil";
import { BLOCK_LOOT_WITH_KNIFE } from "../../data/KnifeLoot";
import { hurtEquippedItem } from "../../lib/ItemUtil";

class KnifeComponent implements ItemCustomComponent {
    onMineBlock(event: ItemComponentMineBlockEvent, _: CustomComponentParameters) {
        const stack = event.itemStack;
        if (!stack) return;
        const entity = event.source;
        if (entity instanceof Player && (entity as Player).getGameMode() === GameMode.Creative) return;
        hurtEquippedItem(entity, stack);
        const permutation = event.minedBlockPermutation;
        const loot = BLOCK_LOOT_WITH_KNIFE.get(permutation.type.id)?.(stack, permutation);
        if (loot) {
            spawnLootAtBlock(event.block, loot);
        }
    }

    onUseOn(event: ItemComponentUseOnEvent, _: CustomComponentParameters) {
        const block = event.block;
        if (block.typeId !== "minecraft:pumpkin") return;
        const entity = event.source;
        if (entity ! instanceof Player || (entity as Player).getGameMode() !== GameMode.Creative) {
            hurtEquippedItem(entity, event.itemStack);
        }
        const face = event.blockFace;
        const direction = face === Direction.Up || face === Direction.Down
            ? oppositeOf(horizontalDirectionOf(entity))
            : face;
        const offset = offsetByDirection(direction);
        block.setPermutation(
            BlockPermutation.resolve("minecraft:carved_pumpkin", {
                "minecraft:cardinal_direction": direction.toLowerCase(),
            }),
        );
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

    @subscribeEvent(system.beforeEvents.startup)
    static init(event: StartupEvent) {
        event.itemComponentRegistry.registerCustomComponent("farmersdelight:knife", new KnifeComponent());
    }
}

void KnifeComponent;
