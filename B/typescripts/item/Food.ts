import {
    EntityComponentTypes,
    EquipmentSlot,
    GameMode,
    ItemCompleteUseAfterEvent,
    Player,
    PlayerInteractWithEntityBeforeEvent,
    system,
    world,
} from "@minecraft/server";
import { subscribeEvent } from "../lib/EventSubscriber";
import { takeEquippedItem } from "../lib/ItemUtil";

export const HORSE_FEED_TARGETS: Set<string> = new Set([
    "minecraft:donkey",
    "minecraft:horse",
    "minecraft:mule",
    "minecraft:llama",
    "minecraft:trader_llama",
]);

// noinspection JSUnusedGlobalSymbols
export class Food {
    @subscribeEvent(world.afterEvents.itemCompleteUse)
    static onConsume(event: ItemCompleteUseAfterEvent) {
        if (event.useDuration) return;
        const player: Player = event.source;
        switch (event.itemStack.typeId) {
            case "farmersdelight:apple_cider":
                player.addEffect("absorption", 60 * 20, { amplifier: 0 });
                break;
            case "farmersdelight:bacon_and_eggs":
                player.addEffect("speed", 60 * 20, { amplifier: 0 });
                break;
            case "farmersdelight:cake_slice":
                player.addEffect("speed", 20 * 20, { amplifier: 0 });
                break;
            case "farmersdelight:chicken_cuts":
                if (Math.random() < 0.3) {
                    player.addEffect("hunger", 30 * 20, { amplifier: 0 });
                }
                break;
            case "farmersdelight:mixed_salad":
            case "farmersdelight:fruit_salad":
                player.addEffect("regeneration", 5 * 20, { amplifier: 0 });
                break;
            case "farmersdelight:mutton_wrap":
            case "farmersdelight:honey_glazed_ham":
                player.addEffect("saturation", 300 * 20, { amplifier: 0 });
                break;
            case "farmersdelight:melon_juice":
                const health = player.getComponent(EntityComponentTypes.Health);
                if (health) {
                    health.setCurrentValue(Math.min(health.currentValue + 2, health.effectiveMax));
                }
                break;
            case "farmersdelight:nether_salad":
                if (Math.random() < 0.3) {
                    player.addEffect("hunger", 12 * 20, { amplifier: 0 });
                }
                break;
            case "farmersdelight:grilled_salmon":
            case "farmersdelight:pasta_with_meatballs":
            case "farmersdelight:pasta_with_mutton_chop":
            case "farmersdelight:ratatouille":
                player.addEffect("saturation", 180 * 20, { amplifier: 0 });
                break;
            case "farmersdelight:raw_pasta":
                if (Math.random() < 0.3) {
                    player.addEffect("hunger", 30 * 20, { amplifier: 0 });
                }
                break;
            case "farmersdelight:vegetable_noodles":
            case "farmersdelight:roast_chicken":
            case "farmersdelight:roasted_mutton_chops":
            case "farmersdelight:shepherds_pie":
            case "farmersdelight:squid_ink_pasta":
            case "farmersdelight:steak_and_potatoes":
            case "farmersdelight:stuffed_pumpkin":
                player.addEffect("saturation", 300 * 20, { amplifier: 0 });
                break;
            case "farmersdelight:wheat_dough":
                if (Math.random() < 0.3) {
                    player.addEffect("hunger", 12 * 20, { amplifier: 0 });
                }
                break;
        }
    }

    // 狗粮与马食
    @subscribeEvent(world.beforeEvents.playerInteractWithEntity)
    static tryFeedEntity(event: PlayerInteractWithEntityBeforeEvent) {
        const stack = event.itemStack;
        if (!stack) return;
        switch (stack.typeId) {
            case "farmersdelight:dog_food": {
                const target = event.target;
                if (target.typeId !== "minecraft:wolf") return;
                const player = event.player;
                system.run(() => {
                    target.addEffect("speed", 6000);
                    target.addEffect("strength", 6000);
                    target.addEffect("resistance", 6000);
                    if (player.getGameMode() !== GameMode.Creative) {
                        takeEquippedItem(player, EquipmentSlot.Mainhand, 1, false);
                    }
                });
                event.cancel = true;
                break;
            }
            case "farmersdelight:horse_feed": {
                const target = event.target;
                if (!HORSE_FEED_TARGETS.has(target.typeId)) return;
                const player = event.player;
                system.run(() => {
                    target.getComponent(EntityComponentTypes.Health)?.resetToMaxValue();
                    target.addEffect("speed", 6000, { amplifier: 1 });
                    target.addEffect("jump_boost", 6000);
                    if (player.getGameMode() !== GameMode.Creative) {
                        takeEquippedItem(player, EquipmentSlot.Mainhand, 1, false);
                    }
                });
                event.cancel = true;
                break;
            }
        }
    }
}
