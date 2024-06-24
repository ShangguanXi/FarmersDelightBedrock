import { ItemComponentTypes } from "@minecraft/server";
import { ItemUtil } from "../../lib/ItemUtil";
function spawnLoot(path, dimenion, location) {
    return dimenion.runCommand(`loot spawn ${location.x} ${location.y} ${location.z} loot "${path}"`);
}
class CropComponent {
    constructor() {
        this.onPlayerDestroy = this.onPlayerDestroy.bind(this);
    }
    onPlayerDestroy(args) {
        const player = args.player;
        const block = args.block;
        const dimension = args.dimension;
        const container = player?.getComponent("inventory")?.container;
        const lootTable = this.getLootTable();
        if (!player)
            return;
        if (!container)
            return;
        const selectedSlot = container?.getSlot(player.selectedSlotIndex);
        const itemId = selectedSlot.typeId;
        const silkTouch = container?.getItem(player.selectedSlotIndex)?.getComponent(ItemComponentTypes.Enchantable)?.hasEnchantment("silk_touch");
        if (itemId == "minecraft:shears" || silkTouch) {
            ItemUtil.damageItem(container, player.selectedSlotIndex, 1);
            ItemUtil.spawnItem(block, block.typeId);
        }
        else {
            spawnLoot(lootTable, dimension, block.location);
        }
        ;
    }
    ;
    getLootTable() {
        return "";
    }
}
//# sourceMappingURL=WildRiceComponent.js.map