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
        if (args.block.typeId !== "farmersdelight:cutting_board")
            return;
        const { x, y, z } = args.block.location;
        const entity = super.setBlock(args.block.dimension, { x: x + 0.5, y, z: z + 0.5 }, "farmersdelight:cutting_board");
        entity.setDynamicProperty("farmersdelight:blockEntityItemStackData", '{"item":"undefined"}');
    }
    interactWithBlock(args) {
        if (args?.block?.typeId !== "farmersdelight:cutting_board")
            return;
        const data = super.entityBlockData(args.block, {
            type: 'farmersdelight:cutting_board',
            location: args.block.location
        });
        const player = args.player;
        const inventory = player.getComponent("inventory");
        const container = inventory?.container;
        if (!data || !container)
            return;
        const entity = data.entity;
        const mainHand = args.itemStack;
        const itemData = JSON.parse(entity.getDynamicProperty("farmersdelight:blockEntityItemStackData"));
        const itemId = itemData?.item ?? "undefined";
        if (itemId !== "undefined") {
            CuttingBoardBlock.handleItemOnBoard(mainHand, entity, itemId, player, container);
        }
        else {
            CuttingBoardBlock.handleItemPlacement(mainHand, entity, player, container);
        }
    }
    static handleItemOnBoard(mainHand, entity, itemId, player, container) {
        const cutToolData = JSON.parse(entity.getDynamicProperty("farmersdelight:cutTool")) || {};
        const mode = cutToolData['mode'];
        if (!mainHand) {
            entity.dimension.spawnItem(new ItemStack(itemId), entity.location);
            entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', '{"item":"undefined"}');
            entity.runCommand("/replaceitem entity @s slot.weapon.mainhand 0 air 1 0 ");
        }
        else if (CuttingBoardBlock.isCorrectTool(mode, mainHand, cutToolData)) {
            CuttingBoardBlock.executeCuttingAction(entity, player, container, itemId);
        }
        else {
            player.onScreenDisplay.setActionBar({ translate: 'farmersdelight.tips.false_tool' });
        }
    }
    static isCorrectTool(mode, mainHand, cutToolData) {
        return (mode === 'item' && cutToolData[mode] === mainHand.typeId) || (mode === 'tag' && mainHand.hasTag(cutToolData[mode]));
    }
    static executeCuttingAction(entity, player, container, itemId) {
        const [namespace, id] = itemId.split(':');
        entity.runCommandAsync(`playsound block.farmersdelight.cutting_board @a ~ ~ ~ 1 1`);
        entity.runCommandAsync(`loot spawn ${entity.location.x} ${entity.location.y} ${entity.location.z} loot "${namespace}/cutting_board/${id}"`);
        entity.setDynamicProperty('farmersdelight:cutTool', undefined);
        entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', '{"item":"undefined"}');
        entity.runCommandAsync(`replaceitem entity @s slot.weapon.mainhand 0 air`);
        if (EntityUtil.gameMode(player)) {
            ItemUtil.damageItem(container, player.selectedSlotIndex);
        }
    }
    static handleItemPlacement(mainHand, entity, player, container) {
        if (!mainHand)
            return;
        const toolMapping = [
            { list: BlockofAxeList, tool: 'minecraft:is_axe', mode: 'tag', isBlock: true },
            { list: BlockofKnifeList, tool: 'farmersdelight:is_knife', mode: 'tag', isBlock: true },
            { list: BlockofPickaxeList, tool: 'minecraft:is_pickaxe', mode: 'tag', isBlock: true },
            { list: BlockofShovelList, tool: 'minecraft:is_shovel', mode: 'tag', isBlock: true },
            { list: ItemofAxeList, tool: 'minecraft:is_axe', mode: 'tag', isBlock: false },
            { list: ItemofKnifeList, tool: 'farmersdelight:is_knife', mode: 'tag', isBlock: false },
            { list: ItemofPickaxeList, tool: 'minecraft:is_pickaxe', mode: 'tag', isBlock: false },
            { list: ItemofShearsList, tool: 'minecraft:shears', mode: 'item', isBlock: false }
        ];
        for (const tool of toolMapping) {
            if (tool.list.includes(mainHand.typeId)) {
                CuttingBoardBlock.setCuttingTool(entity, mainHand.typeId, tool.tool, tool.mode, tool.isBlock);
                if (EntityUtil.gameMode(player)) {
                    ItemUtil.clearItem(container, player.selectedSlotIndex);
                }
                return;
            }
        }
        CuttingBoardBlock.handleCustomTags(mainHand, entity, player, container);
    }
    static setCuttingTool(entity, itemId, tool, mode, isBlock) {
        entity.setDynamicProperty('farmersdelight:cutTool', `{"${mode}": "${tool}", "mode": "${mode}"}`);
        entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', `{"item":"${itemId}"}`);
        entity.setProperty('farmersdelight:is_block_mode', isBlock);
        if (isBlock) {
            entity.runCommandAsync(`replaceitem entity @s slot.weapon.mainhand 0 ${itemId}`);
        }
    }
    static handleCustomTags(mainHand, entity, player, container) {
        for (const tag of mainHand.getTags()) {
            const [prefix, mode, toolTag] = tag.split('.');
            if (prefix === 'farmersdelight:can_cut') {
                entity.setDynamicProperty('farmersdelight:cutTool', `{"${mode}": "${toolTag}", "mode": "${mode}"}`);
                entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', `{"item":"${mainHand.typeId}"}`);
                if (EntityUtil.gameMode(player)) {
                    ItemUtil.clearItem(container, player.selectedSlotIndex);
                }
                return;
            }
        }
        player.onScreenDisplay.setActionBar({ translate: 'farmersdelight.tips.cant_cut' });
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