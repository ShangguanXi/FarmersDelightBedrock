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
import { methodEventSub } from "../lib/eventHelper";
import { BlockWithEntity } from "./BlockWithEntity";
import { EntityUtil } from "../lib/EntityUtil";
import { BlockofAxeList, BlockofKnifeList, BlockofPickaxeList, ItemofPickaxeList, BlockofShovelList, ItemofAxeList, ItemofKnifeList, ItemofShearsList } from "../data/recipe/cuttingBoardRecipe";
import { ItemUtil } from "../lib/ItemUtil";
export class CuttingBoardBlock extends BlockWithEntity {
    placeBlock(args) {
        const { block } = args;
        if (block.typeId !== "farmersdelight:cutting_board")
            return;
        const position = { x: block.location.x + 0.5, y: block.location.y, z: block.location.z + 0.5 };
        const entity = super.setBlock(args.block.dimension, position, "farmersdelight:cutting_board");
        entity.setDynamicProperty("farmersdelight:blockEntityItemStackData", '{"item":"undefined"}');
    }
    interactWithBlock(args) {
        const { block, itemStack, player } = args;
        if (block?.typeId !== "farmersdelight:cutting_board")
            return;
        const data = super.entityBlockData(block, { type: 'farmersdelight:cutting_board', location: block.location });
        const inventory = player.getComponent("inventory");
        if (!data || !inventory)
            return;
        const entity = data.entity;
        const itemId = JSON.parse(entity.getDynamicProperty("farmersdelight:blockEntityItemStackData")).item;
        const cutToolData = JSON.parse(entity.getDynamicProperty("farmersdelight:cutTool"));
        const isEmptyHand = !itemStack;
        if (itemId !== "undefined") {
            this.processCutting(entity, player, itemStack, itemId, cutToolData);
        }
        else {
            this.placeItemOnBoard(entity, player, itemStack, inventory.container);
        }
    }
    processCutting(entity, player, mainHand, itemId, cutToolData) {
        if (!mainHand) {
            entity.dimension.spawnItem(new ItemStack(itemId), entity.location);
            this.clearCuttingBoard(entity);
        }
        else if (this.isValidCutTool(mainHand, cutToolData)) {
            this.executeCutting(entity, player, itemId, cutToolData);
        }
        else {
            player.onScreenDisplay.setActionBar({ translate: 'farmersdelight.tips.false_tool' });
        }
    }
    placeItemOnBoard(entity, player, mainHand, container) {
        if (!mainHand || !container)
            return;
        const toolType = this.getToolType(mainHand);
        if (toolType) {
            this.setCuttingBoardProperties(entity, toolType, mainHand.typeId, true);
            this.consumeItem(player, container);
        }
        else if (!this.setTagTool(entity, mainHand)) {
            player.onScreenDisplay.setActionBar({ translate: 'farmersdelight.tips.cant_cut' });
        }
    }
    setTagTool(entity, itemStack) {
        const tags = itemStack.getTags();
        for (const tag of tags) {
            const ids = tag.split('.');
            if (ids[0] === 'farmersdelight:can_cut') {
                entity.setDynamicProperty('farmersdelight:cutTool', `{"${ids[1]}": "${ids[2]}", "mode": "${ids[1]}"}`);
                entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', `{"item":"${itemStack.typeId}"}`);
                return true;
            }
        }
        return false;
    }
    executeCutting(entity, player, itemId, cutToolData) {
        const [namespace, id] = itemId.split(':');
        entity.runCommandAsync("playsound block.farmersdelight.cutting_board @a ~ ~ ~ 1 1");
        entity.runCommandAsync(`loot spawn ${entity.location.x} ${entity.location.y} ${entity.location.z} loot "${namespace}/cutting_board/${id}"`);
        this.clearCuttingBoard(entity);
        if (EntityUtil.gameMode(player)) {
            const inventory = player?.getComponent("inventory");
            const container = inventory?.container;
            ItemUtil.damageItem(container, player.selectedSlotIndex);
        }
    }
    clearCuttingBoard(entity) {
        entity.setDynamicProperty('farmersdelight:cutTool', undefined);
        entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', '{"item":"undefined"}');
    }
    isValidCutTool(mainHand, cutToolData) {
        return (cutToolData.mode === 'item' && cutToolData.item === mainHand.typeId) ||
            (cutToolData.mode === 'tag' && mainHand.hasTag(cutToolData.tag));
    }
    setCuttingBoardProperties(entity, tool, itemId, isBlockMode) {
        entity.setDynamicProperty('farmersdelight:cutTool', JSON.stringify(tool));
        entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', `{"item":"${itemId}"}`);
        entity.setProperty('farmersdelight:is_block_mode', isBlockMode);
    }
    consumeItem(player, container) {
        if (EntityUtil.gameMode(player)) {
            ItemUtil.clearItem(container, player.selectedSlotIndex);
        }
    }
    getToolType(item) {
        if (BlockofAxeList.includes(item.typeId))
            return { tag: 'minecraft:is_axe', mode: 'tag' };
        if (BlockofKnifeList.includes(item.typeId))
            return { tag: 'farmersdelight:is_knife', mode: 'tag' };
        if (BlockofPickaxeList.includes(item.typeId))
            return { tag: 'minecraft:is_pickaxe', mode: 'tag' };
        if (BlockofShovelList.includes(item.typeId))
            return { tag: 'minecraft:is_shovel', mode: 'tag' };
        if (ItemofAxeList.includes(item.typeId))
            return { tag: 'minecraft:is_axe', mode: 'tag' };
        if (ItemofKnifeList.includes(item.typeId))
            return { tag: 'farmersdelight:is_knife', mode: 'tag' };
        if (ItemofPickaxeList.includes(item.typeId))
            return { tag: 'minecraft:is_pickaxe', mode: 'tag' };
        if (ItemofShearsList.includes(item.typeId))
            return { tag: 'minecraft:shears', mode: 'item' };
        return null;
    }
}
__decorate([
    methodEventSub(world.afterEvents.playerPlaceBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerPlaceBlockAfterEvent]),
    __metadata("design:returntype", void 0)
], CuttingBoardBlock.prototype, "placeBlock", null);
__decorate([
    methodEventSub(world.afterEvents.playerInteractWithBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerInteractWithBlockAfterEvent]),
    __metadata("design:returntype", void 0)
], CuttingBoardBlock.prototype, "interactWithBlock", null);
//# sourceMappingURL=CuttingBoardBlock.js.map