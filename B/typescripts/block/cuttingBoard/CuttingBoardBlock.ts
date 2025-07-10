import { Block, BlockPermutation, Container, Entity, EntityInventoryComponent, EquipmentSlot, ItemStack, Player, PlayerInteractWithBlockAfterEvent, PlayerPlaceBlockAfterEvent, Vector3, world } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { BlockWithEntity } from "../../lib/BlockWithEntity";
import { EntityUtil } from "../../lib/EntityUtil";
import {
    BlockofAxeList,
    BlockofKnifeList,
    BlockofPickaxeList,
    ItemofPickaxeList,
    BlockofShovelList,
    ItemofAxeList,
    ItemofBlockList,
    ItemofKnifeList,
    ItemofShearsList
} from "../../data/recipe/cuttingBoardRecipe";
import { ItemUtil } from "../../lib/ItemUtil";
import { CuttingBroadComponentParams } from "../../customComponents/item/CuttableComponent";

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
    @methodEventSub(world.afterEvents.playerPlaceBlock)
    placeBlock(args: PlayerPlaceBlockAfterEvent) {
        if (args.block.typeId !== "farmersdelight:cutting_board") return;
        const { x, y, z } = args.block.location;
        const entity = super.setBlock(args.block.dimension, { x: x + 0.5, y, z: z + 0.5 }, "farmersdelight:cutting_board");
        entity.setDynamicProperty("farmersdelight:blockEntityItemStackData", '{"item":"undefined"}');
    }

    @methodEventSub(world.afterEvents.playerInteractWithBlock)
    interactWithBlock(args: PlayerInteractWithBlockAfterEvent): void {
        const block = args.block
        if (block?.typeId !== "farmersdelight:cutting_board") return;

        const data = super.entityBlockData(block, {
            type: 'farmersdelight:cutting_board',
            location: block.location
        });

        const { x, y, z }: Vector3 = block.location;
        const player = args.player;
        const inventory = player.getComponent("inventory") as EntityInventoryComponent;
        const container = inventory?.container;
        if (!data || !container) return;
        const entity = data.entity;
        const mainHand = args.itemStack;
        const equip = player.getComponent('minecraft:equippable')
        const offHand = equip?.getEquipment(EquipmentSlot.Offhand)
        const itemData = JSON.parse(entity.getDynamicProperty("farmersdelight:blockEntityItemStackData") as string);
        const itemId = itemData?.item ?? "undefined";
        if (offHand && itemId == "undefined") {
            const cuttable = offHand.getComponent("farmersdelight:cuttable")
            if (mainHand) {
                if (cuttable) {
                    const params = cuttable?.customComponentParameters.params as CuttingBroadComponentParams
                    const loots = CuttingBoardBlock.processCuttingLoot(params)
                    const toolType = (params.tool.type).toString()
                    if ((toolType == "tag" && mainHand.hasTag(params.tool.name)) || (mainHand.typeId == params.tool.name && toolType == "item")) {
                        entity.dimension.playSound(`block.farmersdelight.cutting_board`, entity.location);
                        for (const loot of loots) block.dimension.spawnItem(new ItemStack(loot.id, loot.count), { x: x + 0.5, y: y + 0.5, z: z + 0.5 });
                        if (EntityUtil.gameMode(player)) {
                            ItemUtil.clearOffhandItem(player)
                            ItemUtil.damageItem(container, player.selectedSlotIndex)
                        }
                        return
                    }
                    else player.onScreenDisplay.setActionBar({ translate: 'farmersdelight.tips.false_tool' })
                }
                else {
                    for (const tool of toolMapping) {
                        if (tool.list.includes(offHand.typeId) && (mainHand.hasTag(tool.tool) && tool.mode == "tag") || (mainHand.typeId == tool.tool && tool.mode == "item")) {
                            const [namespace, id] = offHand.typeId.split(':');
                            entity.runCommand(`loot spawn ${entity.location.x} ${entity.location.y} ${entity.location.z} loot "${namespace}/cutting_board/${id}"`);
                            if (EntityUtil.gameMode(player)) {
                                ItemUtil.clearOffhandItem(player)
                                ItemUtil.damageItem(container, player.selectedSlotIndex)
                            }
                            return;
                        }
                        if (!tool.list.includes(offHand.typeId)) player.onScreenDisplay.setActionBar({ translate: 'farmersdelight.tips.false_tool' })
                    }
                }
            }
            else {
                if (cuttable) {
                    const params = cuttable?.customComponentParameters.params as CuttingBroadComponentParams
                    entity.setDynamicProperty('farmersdelight:cutTool', `{"${params.tool.type}": "${params.tool.name}", "mode": "${params.tool.type}"}`);
                    entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', `{"item":"${offHand.typeId}"}`);
                    entity.setProperty('farmersdelight:is_block_mode', params.is_block ?? false);
                    if (params.is_block) entity.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 ${offHand.typeId}`);
                }
                else {
                    for (const tool of toolMapping) {
                        if (tool.list.includes(offHand.typeId)) {
                            entity.setDynamicProperty('farmersdelight:cutTool', `{"${tool.mode}": "${tool.tool}", "mode": "${tool.mode}"}`);
                            entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', `{"item":"${offHand.typeId}"}`);
                            entity.setProperty('farmersdelight:is_block_mode', tool.isBlock);
                            if (tool.isBlock) entity.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 ${offHand.typeId}`);
                            return;
                        }
                        else player.onScreenDisplay.setActionBar({ translate: 'farmersdelight.tips.cant_cut' });
                        return;
                    }
                }
                if (EntityUtil.gameMode(player)) ItemUtil.clearOffhandItem(player)
            }

        }
        if ((!offHand) && mainHand && itemId == "undefined") {
            const cuttable = mainHand.getComponent("farmersdelight:cuttable")
            if (cuttable) {
                const params = cuttable?.customComponentParameters.params as CuttingBroadComponentParams
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
                    else player.onScreenDisplay.setActionBar({ translate: 'farmersdelight.tips.cant_cut' });

                }

            }
            if (EntityUtil.gameMode(player)) ItemUtil.clearItem(container, player.selectedSlotIndex)
        }
        if ((!offHand) && mainHand && itemId != "undefined") {
            const cutToolData = JSON.parse(entity.getDynamicProperty("farmersdelight:cutTool") as string) || {};

            const mode = cutToolData['mode'];
            const isCorrectTool = CuttingBoardBlock.isCorrectTool(mode, mainHand, cutToolData)
            if (isCorrectTool) {
                const item = new ItemStack(itemId)
                const cuttable = item.getComponent("farmersdelight:cuttable")
                if (cuttable) {
                    const params = cuttable?.customComponentParameters.params as CuttingBroadComponentParams
                    const loots = CuttingBoardBlock.processCuttingLoot(params)
                    entity.setDynamicProperty('farmersdelight:cutTool', undefined);
                    entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', '{"item":"undefined"}');
                    for (const loot of loots) {
                        block.dimension.spawnItem(new ItemStack(loot.id, loot.count), { x: x + 0.5, y: y + 0.5, z: z + 0.5 });
                    }
                    if (EntityUtil.gameMode(player)) ItemUtil.damageItem(container, player.selectedSlotIndex);
                }
                else {
                    const [namespace, id] = itemId.split(':');
                    entity.runCommand(`loot spawn ${entity.location.x} ${entity.location.y} ${entity.location.z} loot "${namespace}/cutting_board/${id}"`);
                    entity.setDynamicProperty('farmersdelight:cutTool', undefined);
                    entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', '{"item":"undefined"}');
                    entity.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 air`);
                    if (EntityUtil.gameMode(player)) ItemUtil.damageItem(container, player.selectedSlotIndex);
                }
                entity.dimension.playSound(`block.farmersdelight.cutting_board`, entity.location);
            }
            else player.onScreenDisplay.setActionBar({ translate: 'farmersdelight.tips.false_tool' });

        }
        if ((offHand || !offHand) && (!mainHand) && itemId != "undefined") {
            entity.setDynamicProperty('farmersdelight:cutTool', undefined);
            entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', '{"item":"undefined"}');
            entity.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 air`);
            ItemUtil.spawnItem(block, itemId, 1, { x: x + 0.5, y: y + 0.5, z: z + 0.5 })
        }


    }
    static isCorrectTool(mode: string, mainHand: ItemStack, cutToolData: Record<string, string>): boolean {
        return (mode === 'item' && cutToolData[mode] === mainHand.typeId) || (mode === 'tag' && mainHand.hasTag(cutToolData[mode]));
    }
    static processCuttingLoot(component: CuttingBroadComponentParams): { id: string; count: number }[] {
        const drops: { id: string; count: number }[] = [];
        for (const [id, count, chance = 1] of component.loot) {
            if (Math.random() <= chance) {
                drops.push({ id, count });
            }
        }
        return drops;
    }

}

