var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { EntityComponentTypes, EquipmentSlot, ItemStack, } from "@minecraft/server";
import { blockComponent } from "../../lib/EventSubscriber";
import { getEquipment, increaseAttribute } from "../../lib/EntityUtil";
let PieComponent = class PieComponent {
    onPlayerInteract(args, param) {
        const player = args.player;
        if (!player)
            return;
        const params = param.params;
        const block = args.block;
        const state = block.permutation.getState(params.state.name) ?? 0;
        if (state < (params.state.min_use ?? 0))
            return;
        if (getEquipment(player, EquipmentSlot.Mainhand)?.hasTag("farmersdelight:is_knife")) {
            block.dimension.spawnItem(new ItemStack(params.item), block.center());
            block.dimension.playSound("use.cloth", block);
        }
        else {
            const nutrition = params.nutrition;
            increaseAttribute(player, EntityComponentTypes.Hunger, nutrition);
            increaseAttribute(player, EntityComponentTypes.Saturation, 2 * nutrition * params.saturation_modifier);
            for (const [id, time, amplifier = 0] of params.effects) {
                player.addEffect(id, time, { amplifier: amplifier });
            }
            block.dimension.playSound("random.eat", block);
        }
        if (state < params.state.max_use) {
            block.setPermutation(block.permutation.withState(params.state.name, state + 1));
        }
        else {
            block.setType("minecraft:air");
        }
    }
};
PieComponent = __decorate([
    blockComponent("farmersdelight:pie")
], PieComponent);
export { PieComponent };
