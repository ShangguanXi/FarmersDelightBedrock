var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { WorldInitializeBeforeEvent, world, EntityInventoryComponent } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { ItemUtil } from "../../lib/ItemUtil";
function spawnLoot(path, dimenion, location) {
    return dimenion.runCommand(`loot spawn ${location.x} ${location.y} ${location.z} loot "${path}"`);
}
class CropsComponent {
    constructor() {
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
        this.onRandomTick = this.onRandomTick.bind(this);
    }
    onPlayerInteract(args) {
        const block = args.block;
        const player = args.player;
        const dimension = args.dimension;
        const itemId = player?.getComponent("inventory")?.container?.getSlot(player.selectedSlotIndex).typeId;
        const age = Number(block.permutation.getState("farmersdelight:growth"));
        const random = Math.floor(Math.random() * 101);
        if (!player)
            return;
        const container = player.getComponent(EntityInventoryComponent.componentId)?.container;
        const lootTable = this.getLootTable();
        if (itemId == "minecraft:bone_meal" && age < 7) {
            if (player?.getGameMode() == "creative") {
                block.setPermutation(block.permutation.withState("farmersdelight:growth", 7));
            }
            else {
                if (random <= 60) {
                    block.setPermutation(block.permutation.withState("farmersdelight:growth", age + 1));
                }
                block.dimension.spawnParticle("minecraft:crop_growth_emitter", { x: block.location.x + 0.5, y: block.location.y + 0.5, z: block.location.z + 0.5 });
                if (!container)
                    return;
                ItemUtil.clearItem(container, player?.selectedSlotIndex);
            }
        }
        if (age == 7) {
            block.setPermutation(block.permutation.withState("farmersdelight:growth", 0));
            spawnLoot(lootTable, dimension, { x: block.location.x, y: block.location.y, z: block.location.z });
        }
    }
    onRandomTick(args) {
        const block = args.block;
        const age = Number(block.permutation.getState("farmersdelight:growth"));
        if (age < 7) {
            block.setPermutation(block.permutation.withState("farmersdelight:growth", age + 1));
        }
    }
    getLootTable() {
        return "";
    }
}
class CabbageComponent extends CropsComponent {
    getLootTable() {
        return "farmersdelight/crops/farmersdelight_cabbage_riped";
    }
}
class OnionComponent extends CropsComponent {
    getLootTable() {
        return "farmersdelight/crops/farmersdelight_onion_riped";
    }
}
class TomatoComponent extends CropsComponent {
    getLootTable() {
        return "farmersdelight/crops/farmersdelight_tomato_riped";
    }
}
export class CropComponentRegister {
    register(args) {
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:cabbage', new CabbageComponent());
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:onion', new OnionComponent());
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:tomato', new TomatoComponent());
    }
}
__decorate([
    methodEventSub(world.beforeEvents.worldInitialize),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WorldInitializeBeforeEvent]),
    __metadata("design:returntype", void 0)
], CropComponentRegister.prototype, "register", null);
//# sourceMappingURL=CropComponent.js.map