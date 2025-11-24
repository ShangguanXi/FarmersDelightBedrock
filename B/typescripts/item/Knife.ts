import {
    BlockPermutation,
    EntityComponentTypes,
    EntityDieAfterEvent,
    EquipmentSlot,
    GameMode,
    ItemStack,
    PlayerBreakBlockAfterEvent,
    PlayerInteractWithBlockBeforeEvent,
    system,
    world,
} from "@minecraft/server";
import { hurtEquippedItem } from "../lib/ItemUtil";
import { subscribeEvent } from "../lib/EventSubscriber";
import { BLOCK_LOOT_WITH_KNIFE, DROPS_CAKE_SLICE, ENTITY_LOOT_WITH_KNIFE } from "../data/KnifeLoot";
import { spawnLootAtBlock } from "../lib/LootUtil";

class Knife {
    //刀掉落物改变机制有关的战利品
    @subscribeEvent(world.afterEvents.entityDie)
    static onKill(event: EntityDieAfterEvent) {
        const victim = event.deadEntity;
        if (!victim) return;
        const stack = event.damageSource.damagingEntity
            ?.getComponent(EntityComponentTypes.Equippable)
            ?.getEquipmentSlot(EquipmentSlot.Mainhand)
            ?.getItem();
        if (!stack || !stack.hasComponent("farmersdelight:increase_production")) return;
        const loot = ENTITY_LOOT_WITH_KNIFE.get(victim.typeId)?.(stack, victim);
        if (loot) {
            victim.dimension.spawnItem(loot, victim.location);
        }
    }

    @subscribeEvent(world.afterEvents.playerBreakBlock)
    static onBreakBlock(event: PlayerBreakBlockAfterEvent) {
        const player = event.player;
        if (player.getGameMode() === GameMode.Creative) return;
        const stack = event.itemStackAfterBreak;
        if (!stack || !stack.hasTag("farmersdelight:is_knife") || stack.hasComponent("farmersdelight:knife")) return;
        hurtEquippedItem(player, stack);
        const permutation = event.brokenBlockPermutation;
        const loot = BLOCK_LOOT_WITH_KNIFE.get(permutation.type.id)?.(stack, permutation);
        if (loot) {
            spawnLootAtBlock(event.block, loot);
        }
    }

    @subscribeEvent(world.beforeEvents.playerInteractWithBlock)
    static sliceCake(event: PlayerInteractWithBlockBeforeEvent) {
        const stack = event.itemStack;
        if (!stack || !DROPS_CAKE_SLICE.has(event.block.typeId) || !stack.hasTag("farmersdelight:is_knife")) return;
        event.cancel = true;
        const block = event.block;
        system.run(() => {
            const pos = block.center();
            const dimension = block.dimension;
            dimension.spawnItem(new ItemStack("farmersdelight:cake_slice"), pos);
            dimension.playSound("dig.cloth", block);
            if (block.typeId === "minecraft:cake") {
                const permutation = block.permutation;
                const consumed = permutation.getState("bite_counter") ?? 0;
                if (consumed < 6) {
                    block.setPermutation(permutation.withState("bite_counter", consumed + 1));
                } else {
                    block.setType("minecraft:air");
                }
            } else {
                world.getLootTableManager()
                    .generateLootFromBlockPermutation(block.permutation)
                    ?.forEach((stack) => dimension.spawnItem(stack, pos));
                block.setPermutation(BlockPermutation.resolve("minecraft:cake", { "bite_counter": 1 }));
            }
        });
    }
}

void Knife;