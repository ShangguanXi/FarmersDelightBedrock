var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ItemStack, PlayerInteractWithBlockAfterEvent, PlayerPlaceBlockAfterEvent, world } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { BlockWithEntity } from "../../lib/BlockWithEntity";
import { vanillaItemList } from "../../data/recipe/cookRecipe";
import { EntityUtil } from "../../lib/EntityUtil";
import { ItemUtil } from "../../lib/ItemUtil";
import { heatConductors, heatSources } from "../../data/heatBlocks";
export class Skillet extends BlockWithEntity {
    placeBlock(args) {
        const block = args.block;
        if (block.typeId !== "farmersdelight:skillet_block")
            return;
        const pos = block.location;
        const entity = super.setBlock(args.block.dimension, { x: pos.x + 0.5, y: pos.y, z: pos.z + 0.5 }, "farmersdelight:skillet");
        entity.setDynamicProperty("farmersdelight:item", "undefined");
        entity.setDynamicProperty("farmersdelight:amount", 0);
        entity.setDynamicProperty("farmersdelight:canAdd", 64);
        entity.setDynamicProperty("farmersdelight:cookData", "{}");
    }
    useOnBlock(args) {
        if (args?.block?.typeId !== "farmersdelight:skillet_block")
            return;
        const data = super.entityBlockData(args.block, {
            type: "farmersdelight:skillet",
            location: args.block.location
        });
        if (!data)
            return;
        const player = args.player;
        const itemStack = args.itemStack;
        const entity = data.entity;
        let currentItem = entity.getDynamicProperty("farmersdelight:item");
        let totalAmount = entity.getDynamicProperty("farmersdelight:amount");
        let canAddAmount = entity.getDynamicProperty("farmersdelight:canAdd");
        let cookData = JSON.parse(entity.getDynamicProperty("farmersdelight:cookData") || "{}");
        const inventory = player.getComponent("inventory");
        const container = inventory?.container;
        if (!container)
            return;
        if (!itemStack) {
            if (currentItem == "undefined")
                return;
            for (const item of cookData.datas) {
                entity.dimension.spawnItem(new ItemStack(currentItem, item.count), entity.location);
            }
            entity.setDynamicProperty("farmersdelight:item", "undefined");
            entity.setDynamicProperty("farmersdelight:amount", 0);
            entity.setDynamicProperty("farmersdelight:canAdd", 64);
            entity.setDynamicProperty("farmersdelight:cookData", "{}");
            return;
        }
        const itemId = itemStack.typeId;
        const amount = itemStack.amount;
        const cookable = itemStack.getComponent("farmersdelight:cookable");
        if (vanillaItemList.includes(itemId) || cookable) {
            const params = cookable?.customComponentParameters.params;
            const time = cookable ? (params.time ? params.time : 200) : 200;
            if (currentItem == "undefined") {
                entity.setDynamicProperty("farmersdelight:item", itemId);
                entity.setDynamicProperty("farmersdelight:canAdd", itemStack.maxAmount - amount);
                entity.setDynamicProperty("farmersdelight:amount", amount);
                entity.setDynamicProperty("farmersdelight:cookData", JSON.stringify({ datas: [{ count: amount, time: time }] }));
                if (EntityUtil.gameMode(player))
                    ItemUtil.clearItem(container, player.selectedSlotIndex, amount);
            }
            else if (itemId == currentItem) {
                if (canAddAmount - amount >= 0) {
                    cookData.datas.push({ count: amount, time: time });
                    entity.setDynamicProperty("farmersdelight:canAdd", canAddAmount - amount);
                    entity.setDynamicProperty("farmersdelight:cookData", JSON.stringify(cookData));
                    entity.setDynamicProperty("farmersdelight:amount", totalAmount + amount);
                    if (EntityUtil.gameMode(player))
                        ItemUtil.clearItem(container, player.selectedSlotIndex, amount);
                }
                if (canAddAmount - amount < 0 && canAddAmount != 0) {
                    cookData.datas.push({ count: canAddAmount, time: time });
                    entity.setDynamicProperty("farmersdelight:canAdd", 0);
                    entity.setDynamicProperty("farmersdelight:amount", 64);
                    entity.setDynamicProperty("farmersdelight:cookData", JSON.stringify(cookData));
                    if (EntityUtil.gameMode(player))
                        ItemUtil.clearItem(container, player.selectedSlotIndex, canAddAmount);
                }
            }
            if (Skillet.heatCheck(args.block) && canAddAmount > 0) {
                entity.dimension.playSound("block.farmersdelight.skillet.add_food", entity.location);
            }
        }
        else {
            player.onScreenDisplay.setActionBar({ translate: "farmersdelight.skillet.invalid_item" });
        }
    }
    static heatCheck(block) {
        const blockBelow = block.below();
        if (heatSources.includes(blockBelow?.typeId) || blockBelow?.hasTag('farmersdelight:heat_source'))
            return true;
        if (heatConductors.includes(blockBelow?.typeId) || blockBelow?.hasTag('farmersdelight:heat_conductors')) {
            const blockBelow2 = block.below(2);
            if (heatSources.includes(blockBelow2?.typeId) || blockBelow2?.hasTag('farmersdelight:heat_source'))
                return true;
        }
        return false;
    }
}
__decorate([
    methodEventSub(world.afterEvents.playerPlaceBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerPlaceBlockAfterEvent]),
    __metadata("design:returntype", void 0)
], Skillet.prototype, "placeBlock", null);
__decorate([
    methodEventSub(world.afterEvents.playerInteractWithBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerInteractWithBlockAfterEvent]),
    __metadata("design:returntype", void 0)
], Skillet.prototype, "useOnBlock", null);
