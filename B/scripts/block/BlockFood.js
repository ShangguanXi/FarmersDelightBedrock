var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { EntityInventoryComponent, ItemStack, ItemUseOnAfterEvent, PlayerBreakBlockBeforeEvent, system, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { ItemUtil } from "../lib/ItemUtil";
function spawnLoot(path, dimenion, location) {
    return dimenion.runCommand(`loot spawn ${location.x} ${location.y} ${location.z} loot "${path}"`);
}
export class BlockFood {
    itemUseOn(args) {
        const player = args.source;
        const block = args.block;
        const location = args.block.location;
        const itemStack = args.itemStack;
        const blockFoodAllTag = block.getTags();
        const container = player.getComponent(EntityInventoryComponent.componentId)?.container;
        if (!container)
            return;
        for (const tag of blockFoodAllTag) {
            const nameSpace = tag?.split("-")[0]?.split(":")[0];
            const maxUse = Number(tag.split("-")[0]?.split(":")[1]);
            const item = tag?.split("-")[1];
            const itemType = item?.split(".")[0];
            const itemId = item?.split(".")[1];
            if (nameSpace == "farmersdelight.blockfood") {
                if (Number(block.permutation.getState("farmersdelight:food_block_stage")) != maxUse) {
                    if ((itemType == "tag" && itemStack.hasTag(itemId)) || (itemType == "item" && itemStack.typeId == itemId)) {
                        block.setPermutation(block.permutation.withState("farmersdelight:food_block_stage", Number(block.permutation.getState("farmersdelight:food_block_stage")) + 1));
                        spawnLoot(block.typeId.split(":")[0] + "/food_block/" + block.typeId.split(":")[1], block.dimension, { x: location.x + 0.5, y: location.y + 1, z: location.z + 0.5 });
                        ItemUtil.clearItem(container, player.selectedSlotIndex);
                    }
                    else {
                        player.onScreenDisplay.setActionBar({ translate: 'farmersdelight.blockfood.' + itemId });
                    }
                }
                else {
                    if (block.typeId == "farmersdelight:stuffed_pumpkin_block") {
                        spawnLoot(block.typeId.split(":")[0] + "/food_block/" + block.typeId.split(":")[1], block.dimension, { x: location.x + 0.5, y: location.y + 1, z: location.z + 0.5 });
                    }
                    spawnLoot(block.typeId.split(":")[0] + "/food_block/" + block.typeId.split(":")[1] + "_over", block.dimension, { x: location.x + 0.5, y: location.y + 1, z: location.z + 0.5 });
                    block.dimension.setBlockType({ x: location.x, y: location.y, z: location.z }, "minecraft:air");
                }
                ;
            }
            ;
            if (nameSpace == "farmersdelight.pie") {
                if ((itemType == "tag" && itemStack.hasTag(itemId)) || (itemType == "item" && itemStack.typeId == itemId)) {
                    spawnLoot(block.typeId.split(":")[0] + "/pie/" + block.typeId.split(":")[1], block.dimension, { x: location.x + 0.5, y: location.y + 1, z: location.z + 0.5 });
                    ItemUtil.damageItem(container, player.selectedSlotIndex);
                }
                else {
                    player.addEffect('speed', 60 * 20, { amplifier: 0 });
                }
                ;
                if (Number(block.permutation.getState("farmersdelight:food_block_stage")) != maxUse) {
                    block.setPermutation(block.permutation.withState("farmersdelight:food_block_stage", Number(block.permutation.getState("farmersdelight:food_block_stage")) + 1));
                }
                else {
                    block.dimension.setBlockType({ x: location.x, y: location.y, z: location.z }, "minecraft:air");
                }
                ;
            }
        }
    }
    break(args) {
        const block = args.block;
        const location = args.block.location;
        const player = args.player;
        const blockFoodAllTag = block.getTags();
        const container = player.getComponent(EntityInventoryComponent.componentId)?.container;
        if (!container)
            return;
        for (const tag of blockFoodAllTag) {
            if (tag == "farmersdelight:blockfood") {
                if (Number(block.permutation.getState("farmersdelight:food_block_stage")) != 0) {
                    system.run(() => {
                        block.dimension.setBlockType({ x: location.x, y: location.y, z: location.z }, "minecraft:air");
                    });
                }
                ;
                if (Number(block.permutation.getState("farmersdelight:food_block_stage")) == 0) {
                    system.run(() => {
                        block.dimension.spawnItem(new ItemStack(block.typeId + "_item"), block.location);
                        block.dimension.setBlockType({ x: location.x, y: location.y, z: location.z }, "minecraft:air");
                        player.playSound("dig.stone");
                        ItemUtil.damageItem(container, player.selectedSlotIndex);
                    });
                }
                args.cancel = true;
            }
            ;
            if (tag == "farmersdelight:pie") {
                system.run(() => {
                    block.dimension.setBlockType({ x: location.x, y: location.y, z: location.z }, "minecraft:air");
                    player.playSound("dig.cloth");
                    ItemUtil.damageItem(container, player.selectedSlotIndex);
                });
                args.cancel = true;
            }
        }
    }
}
__decorate([
    methodEventSub(world.afterEvents.itemUseOn),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ItemUseOnAfterEvent]),
    __metadata("design:returntype", void 0)
], BlockFood.prototype, "itemUseOn", null);
__decorate([
    methodEventSub(world.beforeEvents.playerBreakBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerBreakBlockBeforeEvent]),
    __metadata("design:returntype", void 0)
], BlockFood.prototype, "break", null);
//# sourceMappingURL=BlockFood.js.map