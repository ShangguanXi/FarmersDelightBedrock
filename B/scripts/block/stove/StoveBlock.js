var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { PlayerInteractWithBlockAfterEvent, PlayerPlaceBlockAfterEvent, world } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { BlockWithEntity } from "../../lib/BlockWithEntity";
import { CookRecipeManager } from "../../data/recipe/cookRecipe";
import { EntityUtil } from "../../lib/EntityUtil";
import { ItemUtil } from "../../lib/ItemUtil";
export class StoveBlock extends BlockWithEntity {
    placeBlock(args) {
        const block = args.block;
        if (!block.hasTag("farmersdelight:stove"))
            return;
        //放置直接为点燃状态
        block.setPermutation(block.permutation.withState('farmersdelight:is_working', true));
        const { x, y, z } = block.location;
        const entity = super.setBlock(args.block.dimension, { x: x + 0.5, y: y, z: z + 0.5 }, block.typeId);
        for (let i = 0; i < 6; i++) {
            entity.setDynamicProperty(`farmersdelight:item_${i}_time`, 0);
            entity.setDynamicProperty(`farmersdelight:item_${i}_max_time`, 0);
        }
    }
    useOnBlock(args) {
        if (!args.block.hasTag("farmersdelight:stove"))
            return;
        const data = super.entityBlockData(args.block, {
            type: args.block.typeId,
            location: args.block.location
        });
        const player = args.player;
        const inventory = player?.getComponent("inventory");
        const container = inventory?.container;
        if (!data || !container)
            return;
        const entity = data.entity;
        const itemStack = args.itemStack;
        const stoveContainer = entity?.getComponent("inventory")?.container;
        if (!stoveContainer)
            return;
        const { x, y, z } = args.block.location;
        //空手取下
        if (!itemStack) {
            for (let i = 5; i >= 0; i--) {
                const stoveitemStack = stoveContainer.getItem(i);
                if (stoveitemStack) {
                    entity.dimension.spawnItem(stoveitemStack, { x, y: y + 1.4, z });
                    ItemUtil.clearItem(stoveContainer, i);
                    return;
                }
            }
            return;
        }
        //放置
        const upBlock = player.dimension.getBlock({ x: x, y: y + 1, z: z });
        if (!(upBlock?.isAir))
            return;
        const isCookable = CookRecipeManager.isCookable(itemStack);
        if (!isCookable) {
            return;
        }
        const cookData = CookRecipeManager.getCookResult(itemStack);
        if (!cookData)
            return;
        const maxTime = cookData.time;
        const emptySlotsCount = stoveContainer?.emptySlotsCount;
        if (emptySlotsCount == 0)
            return;
        itemStack.amount = 1;
        for (let i = 0; i < 6; i++) {
            if (stoveContainer?.getItem(i) == undefined) {
                stoveContainer?.setItem(i, itemStack);
                entity.setDynamicProperty(`farmersdelight:item_${i}_max_time`, maxTime);
                if (EntityUtil.gameMode(player))
                    ItemUtil.clearItem(container, player.selectedSlotIndex);
                return;
            }
        }
    }
}
__decorate([
    methodEventSub(world.afterEvents.playerPlaceBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerPlaceBlockAfterEvent]),
    __metadata("design:returntype", void 0)
], StoveBlock.prototype, "placeBlock", null);
__decorate([
    methodEventSub(world.afterEvents.playerInteractWithBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerInteractWithBlockAfterEvent]),
    __metadata("design:returntype", void 0)
], StoveBlock.prototype, "useOnBlock", null);
