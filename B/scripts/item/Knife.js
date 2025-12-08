var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BlockPermutation, EntityDieAfterEvent, EquipmentSlot, GameMode, ItemStack, PlayerBreakBlockAfterEvent, PlayerInteractWithBlockBeforeEvent, system, world, } from "@minecraft/server";
import { hurtEquippedItem } from "../lib/ItemUtil";
import { subscribeEvent } from "../lib/EventSubscriber";
import { DROPS_CAKE_SLICE, ENTITY_LOOT_WITH_KNIFE, spawnKnifeLoot } from "../data/KnifeLoot";
import { getEquipment } from "../lib/EntityUtil";
export class Knife {
    static onKill(event) {
        const victim = event.deadEntity;
        if (!victim)
            return;
        const stack = getEquipment(event.damageSource.damagingEntity, EquipmentSlot.Mainhand);
        if (!stack || !stack.hasComponent("farmersdelight:increase_production"))
            return;
        const loot = ENTITY_LOOT_WITH_KNIFE.get(victim.typeId)?.(stack, victim);
        if (loot) {
            victim.dimension.spawnItem(loot, victim.location);
        }
    }
    static onBreakBlock(event) {
        const player = event.player;
        if (player.getGameMode() === GameMode.Creative)
            return;
        const stack = event.itemStackAfterBreak;
        if (!stack || !stack.hasTag("farmersdelight:is_knife") || stack.hasComponent("farmersdelight:knife"))
            return;
        spawnKnifeLoot(event.block, event.brokenBlockPermutation, stack);
        hurtEquippedItem(player, stack);
    }
    static sliceCake(event) {
        const stack = event.itemStack;
        if (!stack || !DROPS_CAKE_SLICE.has(event.block.typeId) || !stack.hasTag("farmersdelight:is_knife"))
            return;
        event.cancel = true;
        const block = event.block;
        system.run(() => {
            const pos = block.center();
            const dimension = block.dimension;
            dimension.spawnItem(new ItemStack("farmersdelight:cake_slice"), pos);
            dimension.playSound("dig.cloth", block);
            if (block.typeId === "minecraft:cake") {
                const permutation = block.permutation;
                const consumed = permutation.getState("bite_counter") ?? 0;
                if (consumed < 6) {
                    block.setPermutation(permutation.withState("bite_counter", consumed + 1));
                }
                else {
                    block.setType("minecraft:air");
                }
            }
            else {
                world.getLootTableManager()
                    .generateLootFromBlockPermutation(block.permutation)
                    ?.forEach((stack) => dimension.spawnItem(stack, pos));
                block.setPermutation(BlockPermutation.resolve("minecraft:cake", { "bite_counter": 1 }));
            }
        });
    }
}
__decorate([
    subscribeEvent(world.afterEvents.entityDie),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EntityDieAfterEvent]),
    __metadata("design:returntype", void 0)
], Knife, "onKill", null);
__decorate([
    subscribeEvent(world.afterEvents.playerBreakBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerBreakBlockAfterEvent]),
    __metadata("design:returntype", void 0)
], Knife, "onBreakBlock", null);
__decorate([
    subscribeEvent(world.beforeEvents.playerInteractWithBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerInteractWithBlockBeforeEvent]),
    __metadata("design:returntype", void 0)
], Knife, "sliceCake", null);
