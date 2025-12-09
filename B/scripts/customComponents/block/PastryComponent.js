var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { EntityComponentTypes, EquipmentSlot, GameMode, ItemComponentTypes, ItemStack, PlayerBreakBlockBeforeEvent, system, world, } from "@minecraft/server";
import { blockComponent, subscribeEvent } from "../../lib/EventSubscriber";
import { getEquipment, increaseAttribute } from "../../lib/EntityUtil";
import { resolveSpec } from "../../lib/ObjectUtil";
import { applyConsumeEffects } from "../item/ConsumeEffectsComponent";
import { isEnchanted } from "../../lib/ItemUtil";
function eatItem(player, stack) {
    const food = stack.getComponent(ItemComponentTypes.Food);
    if (food) {
        const nutrition = food.nutrition;
        increaseAttribute(player, EntityComponentTypes.Hunger, nutrition);
        increaseAttribute(player, EntityComponentTypes.Saturation, 2 * nutrition * food.saturationModifier);
    }
    const effects = resolveSpec(stack, "farmersdelight:consume_effects");
    if (effects) {
        applyConsumeEffects(player, effects);
    }
}
function dropSlices(block, permutation, spec) {
    const amount = spec.servings + (spec.seals ?? 0) - (permutation.getState(spec.counter) ?? 0);
    if (amount > 0) {
        block.dimension.spawnItem(new ItemStack(spec.slice, amount), block.center());
    }
}
let PastryComponent = class PastryComponent {
    onPlayerInteract(event, param) {
        const player = event.player;
        if (!player)
            return;
        const spec = param.params;
        const block = event.block;
        const permutation = block.permutation;
        const state = permutation.getState(spec.counter) ?? 0;
        const bites = state - (spec.seals ?? 0);
        if (bites < 0)
            return;
        if (getEquipment(player, EquipmentSlot.Mainhand)?.hasTag("farmersdelight:is_knife")) {
            const dimension = event.dimension;
            const pos = block.center();
            dimension.spawnItem(new ItemStack(spec.slice), pos);
            dimension.playSound("use.cloth", pos);
        }
        else {
            eatItem(player, new ItemStack(spec.slice));
            event.dimension.playSound("random.eat", player.getHeadLocation());
        }
        if (bites + 1 < spec.servings) {
            block.setPermutation(permutation.withState(spec.counter, state + 1));
        }
        else {
            block.setType("minecraft:air");
        }
    }
    onPlayerBreak(event, param) {
        const player = event.player;
        if (!player || player.getGameMode() === GameMode.Creative)
            return;
        const stack = getEquipment(player, EquipmentSlot.Mainhand);
        if (stack?.hasTag("farmersdelight:is_knife")) {
            dropSlices(event.block, event.brokenBlockPermutation, param.params);
        }
    }
    static preventSilkTouch(event) {
        const stack = event.itemStack;
        if (!isEnchanted(stack, "silk_touch"))
            return;
        const block = event.block;
        const spec = resolveSpec(block, "farmersdelight:pastry");
        if (spec) {
            if (stack?.hasTag("farmersdelight:is_knife")) {
                const permutation = block.permutation;
                system.run(() => {
                    dropSlices(block, permutation, spec);
                    block.setType("minecraft:air");
                });
            }
            else {
                system.run(() => block.setType("minecraft:air"));
            }
            event.cancel = true;
        }
    }
};
__decorate([
    subscribeEvent(world.beforeEvents.playerBreakBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerBreakBlockBeforeEvent]),
    __metadata("design:returntype", void 0)
], PastryComponent, "preventSilkTouch", null);
PastryComponent = __decorate([
    blockComponent("farmersdelight:pastry")
], PastryComponent);
export { PastryComponent };
