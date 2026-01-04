var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { EquipmentSlot, GameMode, Player, PlayerBreakBlockBeforeEvent, system, world, } from "@minecraft/server";
import { hurtEquippedItem, isEnchanted, spawnStack } from "../../lib/ItemUtil";
import { blockComponent, subscribeEvent } from "../../lib/EventSubscriber";
import { getEquipment } from "../../lib/EntityUtil";
import { destroyBlock, removeBlock } from "../../lib/BlockUtil";
let WildCropComponent = class WildCropComponent {
    static harvest(event) {
        const player = event.player;
        if (player.getGameMode() === GameMode.Creative)
            return;
        const block = event.block;
        if (!block.getComponent("farmersdelight:wild_crop"))
            return;
        const stack = event.itemStack;
        if (!isEnchanted(stack, "silk_touch") && stack?.hasTag("minecraft:is_shears")) {
            const loot = event.block.getItemStack(1, false);
            if (!loot)
                return;
            system.run(() => {
                spawnStack(loot, block);
                removeBlock(block);
                hurtEquippedItem(player, stack);
            });
            event.cancel = true;
        }
    }
};
__decorate([
    subscribeEvent(world.beforeEvents.playerBreakBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerBreakBlockBeforeEvent]),
    __metadata("design:returntype", void 0)
], WildCropComponent, "harvest", null);
WildCropComponent = __decorate([
    blockComponent("farmersdelight:wild_crop")
], WildCropComponent);
export { WildCropComponent };
let WildRiceComponent = class WildRiceComponent {
    beforeOnPlayerPlace(event, params) {
        const block = event.block;
        if (params.params === "upper") {
            if (block.below()?.getComponent("farmersdelight:wild_rice"))
                return;
        }
        else if (block.typeId === "minecraft:water" && !block.permutation.getState("liquid_depth")) {
            const upper = block.above();
            if (upper?.isAir) {
                const permutation = event.permutationToPlace.withState("farmersdelight:upper", true);
                system.run(() => {
                    if (upper.isValid && upper.isAir && upper?.below()?.getComponent("farmersdelight:wild_rice")) {
                        upper.setPermutation(permutation);
                    }
                });
                return;
            }
        }
        event.cancel = true;
    }
    onBreak(event, params) {
        if (params.params !== "upper")
            return;
        const block = event.block;
        const lower = block.below();
        if (lower?.getComponent("farmersdelight:wild_rice")) {
            removeBlock(lower);
        }
        const entity = event.entitySource;
        if (entity instanceof Player && entity.getGameMode() === GameMode.Creative)
            return;
        const stack = getEquipment(entity, EquipmentSlot.Mainhand);
        if (isEnchanted(stack, "silk_touch"))
            return;
        const loots = world.getLootTableManager()
            .generateLootFromBlockPermutation(event.brokenBlockPermutation.withState("farmersdelight:upper", false), stack);
        if (loots) {
            const dimension = block.dimension;
            const pos = block.bottomCenter();
            for (const stack of loots) {
                dimension.spawnItem(stack, pos);
            }
        }
    }
    onTick(event, params) {
        if (params.params === "upper")
            return;
        const block = event.block;
        if (block.above()?.getComponent("farmersdelight:wild_rice")) {
            if (block.below()?.isAir) {
                destroyBlock(block);
            }
        }
        else {
            removeBlock(block);
        }
    }
};
WildRiceComponent = __decorate([
    blockComponent("farmersdelight:wild_rice")
], WildRiceComponent);
export { WildRiceComponent };
