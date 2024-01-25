function eatFood(args) {
    const itemStack = args.itemStack;
    const player = args.source
    const useDuration = args.useDuration
    if (itemStack && useDuration == 0) {
        const weight = Math.floor(Math.random() * 11)
        switch (itemStack) {
            case "farmersdelight:apple_cider":
                player.addEffect('absorption', 60 * 20, { amplifier: 0 });
                break;
            case "farmersdelight:apple_pie_slice":
                player.addEffect('speed', 30 * 20, { amplifier: 0 });
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
            case "farmersdelight:chocolate_pie_slice":
                player.addEffect('speed', 30 * 20, { amplifier: 0 });
                break;
            case "farmersdelight:fruit_salad":
                player.addEffect('regeneration', 5 * 20, { amplifier: 0 });
                break;
            case "farmersdelight:grilled_salmon":
                player.addEffect('saturation', 180 * 20, { amplifier: 0 });
                break;
            case "farmersdelight:honey_glazed_ham":
                player.addEffect('saturation', 300 * 20, { amplifier: 0 });
                break;
            case "farmersdelight:melon_juice":
                const health = player.getComponent("health")
                const currentHealth = health.currentValue;
                health.setCurrentValue(currentHealth + 2)
                break;
            case "farmersdelight:mixed_salad":
                player.addEffect('regeneration', 5 * 20, { amplifier: 0 });
                break;
            case "farmersdelight:mutton_wrap":
                player.addEffect('saturation', 300 * 20, { amplifier: 0 });
                break;
            case "farmersdelight:nether_salad":
                if (weight >= 8) {
                    player.addEffect('hunger', 12 * 20, { amplifier: 0 });
                }
                break;
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
            case "farmersdelight:roast_chicken":
                player.addEffect('saturation', 300 * 20, { amplifier: 0 });
                break;
            case "farmersdelight:roasted_mutton_chops":
                player.addEffect('saturation', 300 * 20, { amplifier: 0 });
                break;
            case "farmersdelight:shepherds_pie":
                player.addEffect('saturation', 300 * 20, { amplifier: 0 });
                break;
            case "farmersdelight:squid_ink_pasta":
                player.addEffect('saturation', 300 * 20, { amplifier: 0 });
                break;
            case "farmersdelight:steak_and_potatoes":
                player.addEffect('saturation', 300 * 20, { amplifier: 0 });
                break;
            case "farmersdelight:stuffed_pumpkin":
                player.addEffect('saturation', 300 * 20, { amplifier: 0 });
                break;
            case "farmersdelight:sweet_berry_cheesecake_slice":
                player.addEffect('speed', 30 * 20, { amplifier: 0 });
                break;
            case "farmersdelight:vegetable_noodles":
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
world.afterEvents.itemStopUse.subscribe(eatFood);