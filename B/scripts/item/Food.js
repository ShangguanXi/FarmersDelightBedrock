var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { EntityHealthComponent, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
export class Food {
    eat(args) {
        const itemStack = args.itemStack;
        const player = args.source;
        const useDuration = args.useDuration;
        if (useDuration)
            return;
        const weight = Math.floor(Math.random() * 11);
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
                const health = player.getComponent(EntityHealthComponent.componentId);
                const currentHealth = health?.currentValue ?? 0;
                health?.setCurrentValue(currentHealth + 2);
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
__decorate([
    methodEventSub(world.afterEvents.itemStopUse),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Food.prototype, "eat", null);
//# sourceMappingURL=Food.js.map