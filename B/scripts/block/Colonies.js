var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BlockPermutation, Direction, EntityInventoryComponent, ItemStack, PlayerBreakBlockAfterEvent, PlayerInteractWithBlockBeforeEvent, system, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { EntityUtil } from "../lib/EntityUtil";
import { ItemUtil } from "../lib/ItemUtil";
export class Colonies {
    tryPlaceBlock(args) {
        const itemStack = args.itemStack;
        const block = args.block;
        if (!itemStack ||
            (itemStack.typeId != 'farmersdelight:brown_mushroom_colony_item' && itemStack.typeId != 'farmersdelight:red_mushroom_colony_item') ||
            args.blockFace != Direction.Up ||
            (block.typeId != 'minecraft:mycelium' && block.typeId != 'farmersdelight:rich_soil'))
            return;
        const player = args.player;
        args.cancel = true;
        system.run(() => {
            const main = block.above();
            const mainPerm = BlockPermutation.resolve(itemStack.typeId.split('_item')[0], { 'farmersdelight:growth': 4 });
            main?.setPermutation(mainPerm);
            if (EntityUtil.gameMode(player))
                ItemUtil.clearItem(player.getComponent('inventory')?.container, player.selectedSlot);
        });
    }
    break(args) {
        const brokenPerm = args.brokenBlockPermutation;
        const blockId = brokenPerm.type.id;
        const player = args.player;
        if ((blockId != 'farmersdelight:brown_mushroom_colony' && blockId != 'farmersdelight:red_mushroom_colony') || !EntityUtil.gameMode(player))
            return;
        const growth = brokenPerm.getState('farmersdelight:growth');
        const item = args.itemStackBeforeBreak;
        const { x, y, z } = args.block.location;
        if (growth == 4 && item?.typeId == 'minecraft:shears') {
            player.dimension.spawnItem(new ItemStack(`${blockId}_item`), { x: x + 0.5, y, z: z + 0.5 });
            const invComp = player.getComponent(EntityInventoryComponent.componentId);
            const container = invComp?.container;
            if (!container)
                return;
            ItemUtil.damageItem(container, player.selectedSlot);
        }
        else {
            spawnLoot(`farmersdelight/crops/farmersdelight_${blockId.split(':')[1]}${growth}`, player.dimension, { x: x + 0.5, y, z: z + 0.5 });
        }
    }
}
__decorate([
    methodEventSub(world.beforeEvents.playerInteractWithBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerInteractWithBlockBeforeEvent]),
    __metadata("design:returntype", void 0)
], Colonies.prototype, "tryPlaceBlock", null);
__decorate([
    methodEventSub(world.afterEvents.playerBreakBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerBreakBlockAfterEvent]),
    __metadata("design:returntype", void 0)
], Colonies.prototype, "break", null);
function spawnLoot(path, dimenion, location) {
    return dimenion.runCommand(`loot spawn ${location.x} ${location.y} ${location.z} loot "${path}"`);
}
//# sourceMappingURL=Colonies.js.map