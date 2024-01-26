import { EntityHealthComponent, ItemStack, Player, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";


export class Food {
    @methodEventSub(world.afterEvents.itemStopUse)
    eat(args: any) {
        const itemStack: ItemStack = args.itemStack;
        const player: Player = args.source
        const useDuration: number = args.useDuration;
        if (useDuration) return;
        const weight = Math.floor(Math.random() * 11)
        switch (itemStack.typeId) {
            case "farmersdelight:apple_cider":
                player.addEffect('absorption', 60 * 20, { amplifier: 0 });
                break;
            case "farmersdelight:bacon_and_eggs":
                player.addEffect('speed', 60 * 20, { amplifier: 0 });
                break;
            case "farmersdelight:cake_slice":
                player.addEffect('speed', 20 * 20, { amplifier: 0 });
                break;
            case "farmersdelight:chicken_cuts":
                if (weight >= 8) {
                    player.addEffect('hunger', 30 * 20, { amplifier: 0 });
                }
                break;
            case "farmersdelight:sweet_berry_cheesecake_slice":
            case "farmersdelight:apple_pie_slice":
            case "farmersdelight:chocolate_pie_slice":
                player.addEffect('speed', 30 * 20, { amplifier: 0 });
                break;
            case "farmersdelight:mixed_salad":
            case "farmersdelight:fruit_salad":
                player.addEffect('regeneration', 5 * 20, { amplifier: 0 });
                break;
            case "farmersdelight:mutton_wrap":
            case "farmersdelight:honey_glazed_ham":
                player.addEffect('saturation', 300 * 20, { amplifier: 0 });
                break;
            case "farmersdelight:melon_juice":
                const health: EntityHealthComponent | undefined = player.getComponent(EntityHealthComponent.componentId);
                const currentHealth: number = health?.currentValue ?? 0;
                health?.setCurrentValue(currentHealth + 2)
                break;
            case "farmersdelight:nether_salad":
                if (weight >= 8) {
                    player.addEffect('hunger', 12 * 20, { amplifier: 0 });
                }
                break;
            case "farmersdelight:grilled_salmon":
            case "farmersdelight:pasta_with_meatballs":
            case "farmersdelight:pasta_with_mutton_chop":
            case "farmersdelight:ratatouille":
                player.addEffect('saturation', 180 * 20, { amplifier: 0 });
                break;
            case "farmersdelight:raw_pasta":
                if (weight >= 8) {
                    player.addEffect('hunger', 30 * 20, { amplifier: 0 });
                }
                break;
            case "farmersdelight:vegetable_noodles":
            case "farmersdelight:roast_chicken":
            case "farmersdelight:roasted_mutton_chops":
            case "farmersdelight:shepherds_pie":
            case "farmersdelight:squid_ink_pasta":
            case "farmersdelight:steak_and_potatoes":
            case "farmersdelight:stuffed_pumpkin":
                player.addEffect('saturation', 300 * 20, { amplifier: 0 });
                break;
            case "farmersdelight:wheat_dough":
                if (weight >= 8) {
                    player.addEffect('hunger', 12 * 20, { amplifier: 0 });
                }
                break;
        }
    }
}