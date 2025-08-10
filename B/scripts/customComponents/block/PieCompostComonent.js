var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { system, StartupEvent, world, PlayerBreakBlockBeforeEvent, ItemComponentTypes, ItemStack } from "@minecraft/server";
import { ItemUtil } from "../../lib/ItemUtil";
import { methodEventSub } from "../../lib/eventHelper";
export class PieComponent {
    constructor() {
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
    }
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
        const { x, y, z } = args.block.location;
        const container = inventory?.container;
        const itemStack = container.getItem(player.selectedSlotIndex);
        const state = block.permutation.getState(params.state.name);
        if (!itemStack || !itemStack.hasTag("farmersdelight:is_knife")) {
            block.dimension.playSound("random.eat", { x, y, z });
            if (state != (params.state.max_use))
                block.setPermutation(block.permutation.withState(params.state.name, state + 1));
            else
                block.dimension.setBlockType({ x, y, z }, "minecraft:air");
            const hunger = player.getComponent('minecraft:player.hunger');
            const saturation = player.getComponent('minecraft:player.saturation');
            const nutrition = params.nutrition;
            const saturation_modifier = params.saturation_modifier;
            hunger?.setCurrentValue(hunger.currentValue + nutrition > hunger.effectiveMax ? hunger.effectiveMax : hunger.currentValue + nutrition);
            saturation?.setCurrentValue(saturation.currentValue + saturation_modifier * nutrition * 2 > saturation.effectiveMax ? saturation.effectiveMax : saturation.currentValue + saturation_modifier * nutrition * 2);
            for (const [id, time, amplifier = 0] of params.effects) {
                player.addEffect(id, time, { amplifier: amplifier });
            }
            return;
        }
        if (!itemStack.hasTag("farmersdelight:is_knife"))
            return;
        block.dimension.playSound("use.cloth", { x, y, z });
        block.dimension.spawnItem(new ItemStack(params.item), { x: x + 0.5, y: y + 0.5, z: z + 0.5 });
        if (state != (params.state.max_use))
            block.setPermutation(block.permutation.withState(params.state.name, state + 1));
        else
            block.dimension.setBlockType({ x, y, z }, "minecraft:air");
    }
    break(args) {
        const block = args.block;
        const pie = block.getComponent('farmersdelight:pie');
        if (!pie)
            return;
        const params = pie.customComponentParameters.params;
        const itemStack = args.itemStack;
        const player = args.player;
        const { x, y, z } = args.block.location;
        const state = block.permutation.getState(params.state.name);
        const minUse = params.state.min_use || 0;
        if (state == minUse)
            return;
        if (!itemStack)
            return;
        const enchant = itemStack.getComponent(ItemComponentTypes.Enchantable);
        const silkTouch = enchant?.getEnchantment('silk_touch');
        if (silkTouch) {
            const container = player.getComponent("inventory")?.container;
            if (!container)
                return;
            args.cancel = true;
            system.runTimeout(() => {
                ItemUtil.damageItem(container, player.selectedSlotIndex);
                ItemUtil.spawnItem(block, block.typeId);
                block.dimension.runCommand(`/setblock ${x} ${y} ${z} air`);
            });
        }
    }
    register(args) {
        args.blockComponentRegistry.registerCustomComponent('farmersdelight:pie', new PieComponent());
    }
}
__decorate([
    methodEventSub(world.beforeEvents.playerBreakBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerBreakBlockBeforeEvent]),
    __metadata("design:returntype", void 0)
], PieComponent.prototype, "break", null);
__decorate([
    methodEventSub(system.beforeEvents.startup),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [StartupEvent]),
    __metadata("design:returntype", void 0)
], PieComponent.prototype, "register", null);
//# sourceMappingURL=PieCompostComonent.js.map