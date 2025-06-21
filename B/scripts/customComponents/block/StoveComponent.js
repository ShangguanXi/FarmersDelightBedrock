var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { StartupEvent, system, ItemStack } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { ItemUtil } from "../../lib/ItemUtil";
export class StoveComponent {
    constructor() {
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
    }
    onPlayerInteract(args) {
        const player = args.player;
        const dimension = args.dimension;
        const block = args.block;
        const inventory = player?.getComponent("inventory");
        const container = inventory?.container;
        const { x, y, z } = args.block.location;
        if (!player)
            return;
        const itemStack = container?.getItem(player.selectedSlotIndex);
        if (!container)
            return;
        if (!itemStack)
            return;
        if (itemStack.typeId == "farmersdelight:skillet" || itemStack.typeId == "farmersdelight:cooking_pot")
            return;
        if (itemStack.typeId == "minecraft:water_bucket" && block.permutation.getState('farmersdelight:is_working') == true) {
            const bucket = new ItemStack("minecraft:bucket");
            ItemUtil.replaceItem(player, player.selectedSlotIndex, bucket);
            block.setPermutation(block.permutation.withState('farmersdelight:is_working', false));
            dimension.playSound("random.fizz", { x, y, z });
        }
        ;
        if (itemStack.hasTag("minecraft:is_shovel") && block.permutation.getState('farmersdelight:is_working') == true) {
            ItemUtil.damageItem(container, player.selectedSlotIndex);
            block.setPermutation(block.permutation.withState('farmersdelight:is_working', false));
            dimension.playSound("random.fizz", { x, y, z });
        }
        ;
        if (itemStack.typeId == "minecraft:flint_and_steel" && block.permutation.getState('farmersdelight:is_working') == false) {
            ItemUtil.damageItem(container, player.selectedSlotIndex);
            block.setPermutation(block.permutation.withState('farmersdelight:is_working', true));
            dimension.playSound("fire.ignite", { x, y, z });
        }
        ;
    }
}
export class StoveComponentRegister {
    register(args) {
        args.blockComponentRegistry.registerCustomComponent('farmersdelight:stove', new StoveComponent());
    }
}
__decorate([
    methodEventSub(system.beforeEvents.startup),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [StartupEvent]),
    __metadata("design:returntype", void 0)
], StoveComponentRegister.prototype, "register", null);
//# sourceMappingURL=StoveComponent.js.map