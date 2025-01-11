import { Block, BlockPermutation, Container, Entity, EntityInventoryComponent, ItemStack, Player, PlayerInteractWithBlockAfterEvent, PlayerPlaceBlockAfterEvent, Vector3, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { BlockWithEntity } from "./BlockWithEntity";
import { EntityUtil } from "../lib/EntityUtil";
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
} from "../data/recipe/cuttingBoardRecipe";
import { ItemUtil } from "../lib/ItemUtil";

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
        if (args?.block?.typeId !== "farmersdelight:cutting_board") return;

        const data = super.entityBlockData(args.block, {
            type: 'farmersdelight:cutting_board',
            location: args.block.location
        });
        const player = args.player;
        const inventory = player.getComponent("inventory") as EntityInventoryComponent;
        const container = inventory?.container;
        if (!data || !container) return;

        const entity = data.entity;
        const mainHand = args.itemStack;
        const itemData = JSON.parse(entity.getDynamicProperty("farmersdelight:blockEntityItemStackData") as string);
        const itemId = itemData?.item ?? "undefined";

        if (itemId !== "undefined") {
            CuttingBoardBlock.handleItemOnBoard(mainHand, entity, itemId, player, container);
        } else {
            CuttingBoardBlock.handleItemPlacement(mainHand, entity, player, container);
        }
    }

    static handleItemOnBoard(mainHand: ItemStack | undefined, entity: Entity, itemId: string, player: Player, container: Container) {
        const cutToolData = JSON.parse(entity.getDynamicProperty("farmersdelight:cutTool") as string) || {};
        const mode = cutToolData['mode'];

        if (!mainHand) {
            entity.dimension.spawnItem(new ItemStack(itemId), entity.location);
            entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', '{"item":"undefined"}');
            entity.runCommand("/replaceitem entity @s slot.weapon.mainhand 0 air 1 0 ")
        } else if (CuttingBoardBlock.isCorrectTool(mode, mainHand, cutToolData)) {
            CuttingBoardBlock.executeCuttingAction(entity, player, container, itemId);
        } else {
            player.onScreenDisplay.setActionBar({ translate: 'farmersdelight.tips.false_tool' });
        }
    }

    static isCorrectTool(mode: string, mainHand: ItemStack, cutToolData: Record<string, string>): boolean {
        return (mode === 'item' && cutToolData[mode] === mainHand.typeId) || (mode === 'tag' && mainHand.hasTag(cutToolData[mode]));
    }

    static executeCuttingAction(entity: Entity, player: Player, container: Container, itemId: string) {
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

    static handleItemPlacement(mainHand: ItemStack | undefined, entity: Entity, player: Player, container: Container) {
        if (!mainHand) return;

        const toolMapping = [
            { list: BlockofAxeList, tag: 'minecraft:is_axe', isBlock: true },
            { list: BlockofKnifeList, tag: 'farmersdelight:is_knife', isBlock: true },
            { list: BlockofPickaxeList, tag: 'minecraft:is_pickaxe', isBlock: true },
            { list: BlockofShovelList, tag: 'minecraft:is_shovel', isBlock: true },
            { list: ItemofAxeList, tag: 'minecraft:is_axe', isBlock: false },
            { list: ItemofKnifeList, tag: 'farmersdelight:is_knife', isBlock: false },
            { list: ItemofPickaxeList, tag: 'minecraft:is_pickaxe', isBlock: false },
            { list: ItemofShearsList, tag: 'minecraft:shears', isBlock: false }
        ];

        for (const tool of toolMapping) {
            if (tool.list.includes(mainHand.typeId)) {
                CuttingBoardBlock.setCuttingTool(entity, mainHand.typeId, tool.tag, tool.isBlock);
                if (EntityUtil.gameMode(player)) {
                    ItemUtil.clearItem(container, player.selectedSlotIndex);
                }
                return;
            }
        }

        CuttingBoardBlock.handleCustomTags(mainHand, entity, player, container);
    }

    static setCuttingTool(entity: Entity, itemId: string, tag: string, isBlock: boolean) {
        entity.setDynamicProperty('farmersdelight:cutTool', `{"tag": "${tag}", "mode": "tag"}`);
        entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', `{"item":"${itemId}"}`);
        entity.setProperty('farmersdelight:is_block_mode', isBlock);
        if (isBlock) {
            entity.runCommandAsync(`replaceitem entity @s slot.weapon.mainhand 0 ${itemId}`);
        }
    }

    static handleCustomTags(mainHand: ItemStack, entity: Entity, player: Player, container: Container) {
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
