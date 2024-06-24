"use strict";
class WildRiceComponent {
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
//# sourceMappingURL=WildRice.js.map