var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { WorldInitializeBeforeEvent, world } from "@minecraft/server";
import { ItemUtil } from "../../lib/ItemUtil";
import { methodEventSub } from "../../lib/eventHelper";
class RichSoilComponent {
    constructor() {
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
    }
    onPlayerInteract(args) {
        const player = args.player;
        const face = args.face;
        const container = player?.getComponent("inventory")?.container;
        const block = args.block;
        const dimension = args.dimension;
        if (!player)
            return;
        if (!container)
            return;
        const selectedSlot = container?.getSlot(player.selectedSlotIndex);
        try {
            const itemId = selectedSlot?.typeId;
            const hoeTag = selectedSlot.hasTag("minecraft:is_hoe");
            const topLocation = { x: block.location.x, y: block.location.y + 1, z: block.location.z };
            const topBlockId = dimension.getBlock(topLocation)?.typeId;
            if (face == 'Up' && topBlockId == "minecraft:air") {
                if (itemId == "minecraft:sugar_cane") {
                    world.playSound("dig.grass", block.location);
                    dimension.setBlockType(topLocation, "farmersdelight:rich_soil_sugar_cane_bottom");
                    ItemUtil.clearItem(container, player.selectedSlotIndex);
                }
                if (itemId == "minecraft:brown_mushroom") {
                    world.playSound("dig.grass", block.location);
                    dimension.setBlockType(topLocation, "farmersdelight:brown_mushroom_colony");
                    ItemUtil.clearItem(container, player.selectedSlotIndex);
                }
                if (itemId == "minecraft:red_mushroom") {
                    world.playSound("dig.grass", block.location);
                    dimension.setBlockType(topLocation, "farmersdelight:red_mushroom_colony");
                    ItemUtil.clearItem(container, player.selectedSlotIndex);
                }
            }
            if (hoeTag) {
                dimension.setBlockType(block.location, "farmersdelight:rich_soil_farmland");
                world.playSound("use.gravel", block.location);
                ItemUtil.damageItem(container, player.selectedSlotIndex, 1);
            }
        }
        catch (error) {
        }
    }
}
export class RichSoilComponentRegister {
    register(args) {
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:rich_soil', new RichSoilComponent());
    }
}
__decorate([
    methodEventSub(world.beforeEvents.worldInitialize),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WorldInitializeBeforeEvent]),
    __metadata("design:returntype", void 0)
], RichSoilComponentRegister.prototype, "register", null);
//# sourceMappingURL=RichSoilComponent.js.map