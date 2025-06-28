var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { EquipmentSlot, ItemStack, PlayerInteractWithBlockAfterEvent, PlayerPlaceBlockAfterEvent, world } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { BlockWithEntity } from "../BlockWithEntity";
import { EntityUtil } from "../../lib/EntityUtil";
import { BlockofAxeList, BlockofKnifeList, BlockofPickaxeList, ItemofPickaxeList, BlockofShovelList, ItemofAxeList, ItemofKnifeList, ItemofShearsList } from "../../data/recipe/cuttingBoardRecipe";
import { ItemUtil } from "../../lib/ItemUtil";
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
export { toolMapping };
export class CuttingBoardBlock extends BlockWithEntity {
    placeBlock(args) {
        if (args.block.typeId !== "farmersdelight:cutting_board")
            return;
        const { x, y, z } = args.block.location;
        const entity = super.setBlock(args.block.dimension, { x: x + 0.5, y, z: z + 0.5 }, "farmersdelight:cutting_board");
        entity.setDynamicProperty("farmersdelight:blockEntityItemStackData", '{"item":"undefined"}');
    }
    interactWithBlock(args) {
        const block = args.block;
        if (block?.typeId !== "farmersdelight:cutting_board")
            return;
        const data = super.entityBlockData(block, {
            type: 'farmersdelight:cutting_board',
            location: block.location
        });
        const { x, y, z } = block.location;
        const player = args.player;
        const inventory = player.getComponent("inventory");
        const container = inventory?.container;
        if (!data || !container)
            return;
        const entity = data.entity;
        const mainHand = args.itemStack;
        const equip = player.getComponent('minecraft:equippable');
        const offHand = equip?.getEquipment(EquipmentSlot.Offhand);
        const itemData = JSON.parse(entity.getDynamicProperty("farmersdelight:blockEntityItemStackData"));
        const itemId = itemData?.item ?? "undefined";
        if (offHand && itemId == "undefined") {
            const cuttable = offHand.getComponent("farmersdelight:cuttable");
            if (mainHand) {
                if (cuttable) {
                    const params = cuttable?.customComponentParameters.params;
                    const loots = CuttingBoardBlock.processCuttingLoot(params);
                    const toolType = (params.tool.type).toString();
                    if ((toolType == "tag" && mainHand.hasTag(params.tool.name)) || (mainHand.typeId == params.tool.name && toolType == "item")) {
                        entity.dimension.playSound(`block.farmersdelight.cutting_board`, entity.location);
                        for (const loot of loots)
                            block.dimension.spawnItem(new ItemStack(loot.id, loot.count), { x: x + 0.5, y: y + 0.5, z: z + 0.5 });
                        if (EntityUtil.gameMode(player)) {
                            ItemUtil.clearOffhandItem(player);
                            ItemUtil.damageItem(container, player.selectedSlotIndex);
                        }
                        return;
                    }
                    else
                        player.onScreenDisplay.setActionBar({ translate: 'farmersdelight.tips.false_tool' });
                }
                else {
                    for (const tool of toolMapping) {
                        if (tool.list.includes(offHand.typeId) && (mainHand.hasTag(tool.tool) && tool.mode == "tag") || (mainHand.typeId == tool.tool && tool.mode == "item")) {
                            const [namespace, id] = offHand.typeId.split(':');
                            entity.runCommand(`loot spawn ${entity.location.x} ${entity.location.y} ${entity.location.z} loot "${namespace}/cutting_board/${id}"`);
                            if (EntityUtil.gameMode(player)) {
                                ItemUtil.clearOffhandItem(player);
                                ItemUtil.damageItem(container, player.selectedSlotIndex);
                            }
                            return;
                        }
                        if (!tool.list.includes(offHand.typeId))
                            player.onScreenDisplay.setActionBar({ translate: 'farmersdelight.tips.false_tool' });
                    }
                }
            }
            else {
                if (cuttable) {
                    const params = cuttable?.customComponentParameters.params;
                    entity.setDynamicProperty('farmersdelight:cutTool', `{"${params.tool.type}": "${params.tool.name}", "mode": "${params.tool.type}"}`);
                    entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', `{"item":"${offHand.typeId}"}`);
                    entity.setProperty('farmersdelight:is_block_mode', params.is_block ?? false);
                    if (params.is_block)
                        entity.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 ${offHand.typeId}`);
                }
                else {
                    for (const tool of toolMapping) {
                        if (tool.list.includes(offHand.typeId)) {
                            entity.setDynamicProperty('farmersdelight:cutTool', `{"${tool.mode}": "${tool.tool}", "mode": "${tool.mode}"}`);
                            entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', `{"item":"${offHand.typeId}"}`);
                            entity.setProperty('farmersdelight:is_block_mode', tool.isBlock);
                            if (tool.isBlock)
                                entity.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 ${offHand.typeId}`);
                            return;
                        }
                        else
                            player.onScreenDisplay.setActionBar({ translate: 'farmersdelight.tips.cant_cut' });
                        return;
                    }
                }
                if (EntityUtil.gameMode(player))
                    ItemUtil.clearOffhandItem(player);
            }
        }
        if ((!offHand) && mainHand && itemId == "undefined") {
            const cuttable = mainHand.getComponent("farmersdelight:cuttable");
            if (cuttable) {
                const params = cuttable?.customComponentParameters.params;
                entity.setDynamicProperty('farmersdelight:cutTool', `{"${params.tool.type}": "${params.tool.name}", "mode": "${params.tool.type}"}`);
                entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', `{"item":"${mainHand.typeId}"}`);
                entity.setProperty('farmersdelight:is_block_mode', params.is_block ?? false);
                if (params.is_block) {
                    entity.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 ${mainHand.typeId}`);
                }
            }
            else {
                for (const tool of toolMapping) {
                    if (tool.list.includes(mainHand.typeId)) {
                        entity.setDynamicProperty('farmersdelight:cutTool', `{"${tool.mode}": "${tool.tool}", "mode": "${tool.mode}"}`);
                        entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', `{"item":"${mainHand.typeId}"}`);
                        entity.setProperty('farmersdelight:is_block_mode', tool.isBlock);
                        if (tool.isBlock) {
                            entity.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 ${mainHand.typeId}`);
                        }
                    }
                    else
                        player.onScreenDisplay.setActionBar({ translate: 'farmersdelight.tips.cant_cut' });
                }
            }
            if (EntityUtil.gameMode(player))
                ItemUtil.clearItem(container, player.selectedSlotIndex);
        }
        if ((!offHand) && mainHand && itemId != "undefined") {
            const cutToolData = JSON.parse(entity.getDynamicProperty("farmersdelight:cutTool")) || {};
            const mode = cutToolData['mode'];
            const isCorrectTool = CuttingBoardBlock.isCorrectTool(mode, mainHand, cutToolData);
            if (isCorrectTool) {
                const item = new ItemStack(itemId);
                const cuttable = item.getComponent("farmersdelight:cuttable");
                if (cuttable) {
                    const params = cuttable?.customComponentParameters.params;
                    const loots = CuttingBoardBlock.processCuttingLoot(params);
                    entity.setDynamicProperty('farmersdelight:cutTool', undefined);
                    entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', '{"item":"undefined"}');
                    for (const loot of loots) {
                        block.dimension.spawnItem(new ItemStack(loot.id, loot.count), { x: x + 0.5, y: y + 0.5, z: z + 0.5 });
                    }
                    if (EntityUtil.gameMode(player))
                        ItemUtil.damageItem(container, player.selectedSlotIndex);
                }
                else {
                    const [namespace, id] = itemId.split(':');
                    entity.runCommand(`loot spawn ${entity.location.x} ${entity.location.y} ${entity.location.z} loot "${namespace}/cutting_board/${id}"`);
                    entity.setDynamicProperty('farmersdelight:cutTool', undefined);
                    entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', '{"item":"undefined"}');
                    entity.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 air`);
                    if (EntityUtil.gameMode(player))
                        ItemUtil.damageItem(container, player.selectedSlotIndex);
                }
                entity.dimension.playSound(`block.farmersdelight.cutting_board`, entity.location);
            }
            else
                player.onScreenDisplay.setActionBar({ translate: 'farmersdelight.tips.false_tool' });
        }
        if ((offHand || !offHand) && (!mainHand) && itemId != "undefined") {
            entity.setDynamicProperty('farmersdelight:cutTool', undefined);
            entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', '{"item":"undefined"}');
            entity.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 air`);
            ItemUtil.spawnItem(block, itemId, 1, { x: x + 0.5, y: y + 0.5, z: z + 0.5 });
        }
    }
    static isCorrectTool(mode, mainHand, cutToolData) {
        return (mode === 'item' && cutToolData[mode] === mainHand.typeId) || (mode === 'tag' && mainHand.hasTag(cutToolData[mode]));
    }
    static processCuttingLoot(component) {
        const drops = [];
        for (const [id, count, chance = 1] of component.loot) {
            if (Math.random() <= chance) {
                drops.push({ id, count });
            }
        }
        return drops;
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