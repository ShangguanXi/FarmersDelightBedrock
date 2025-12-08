var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { EntityComponentTypes, ItemStack, PlayerBreakBlockBeforeEvent, system, world, } from "@minecraft/server";
import { hurtEquippedItem, isEnchanted, spawnStack } from "../../lib/ItemUtil";
import { blockComponent, subscribeEvent } from "../../lib/EventSubscriber";
import { resolveSpec } from "../../lib/ObjectUtil";
let PieComponent = class PieComponent {
    onPlayerInteract(args, param) {
        const params = param.params;
        const player = args.player;
        if (!player)
            return;
        const isSneaking = player?.isSneaking;
        if (isSneaking)
            return;
        const inventory = player?.getComponent("inventory");
        if (!inventory)
            return;
        const block = args.block;
        const container = inventory?.container;
        const itemStack = container.getItem(player.selectedSlotIndex);
        const state = block.permutation.getState(params.state.name);
        if (!itemStack?.hasTag("farmersdelight:is_knife")) {
            block.dimension.playSound("random.eat", block);
            if (state != (params.state.max_use))
                block.setPermutation(block.permutation.withState(params.state.name, state + 1));
            else
                block.setType("minecraft:air");
            const hunger = player.getComponent(EntityComponentTypes.Hunger);
            const saturation = player.getComponent(EntityComponentTypes.Saturation);
            const nutrition = params.nutrition;
            const saturation_modifier = params.saturation_modifier;
            hunger?.setCurrentValue(hunger.currentValue + nutrition > hunger.effectiveMax
                ? hunger.effectiveMax
                : hunger.currentValue + nutrition);
            saturation?.setCurrentValue(saturation.currentValue + saturation_modifier * nutrition * 2 > saturation.effectiveMax
                ? saturation.effectiveMax
                : saturation.currentValue + saturation_modifier * nutrition * 2);
            for (const [id, time, amplifier = 0] of params.effects) {
                player.addEffect(id, time, { amplifier: amplifier });
            }
            return;
        }
        block.dimension.playSound("use.cloth", block);
        block.dimension.spawnItem(new ItemStack(params.item), block.center());
        if (state != (params.state.max_use))
            block.setPermutation(block.permutation.withState(params.state.name, state + 1));
        else
            block.setType("minecraft:air");
    }
    static performSilkTouch(event) {
        const block = event.block;
        const limit = resolveSpec(block, "farmersdelight:pie")?.state;
        if (!limit)
            return;
        const stack = event.itemStack;
        if (!isEnchanted(stack, "silk_touch"))
            return;
        if ((block.permutation.getState(limit.name) ?? 0) > (limit.min_use ?? 0))
            return;
        const player = event.player;
        system.run(() => {
            spawnStack(new ItemStack(block.typeId), block);
            block.setType("minecraft:air");
            hurtEquippedItem(player, stack);
        });
        event.cancel = true;
    }
};
__decorate([
    subscribeEvent(world.beforeEvents.playerBreakBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerBreakBlockBeforeEvent]),
    __metadata("design:returntype", void 0)
], PieComponent, "performSilkTouch", null);
PieComponent = __decorate([
    blockComponent("farmersdelight:pie")
], PieComponent);
export { PieComponent };
