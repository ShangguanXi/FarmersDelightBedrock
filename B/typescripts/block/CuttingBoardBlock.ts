import {
    Block, BlockPermutation, Container, Entity, EntityInventoryComponent, ItemStack, Player, PlayerInteractWithBlockAfterEvent, PlayerPlaceBlockAfterEvent, Vector3, world
} from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { BlockWithEntity } from "./BlockWithEntity";
import { EntityUtil } from "../lib/EntityUtil";
import {
    BlockofAxeList, BlockofKnifeList, BlockofPickaxeList, ItemofPickaxeList, BlockofShovelList, ItemofAxeList, ItemofBlockList, ItemofKnifeList, ItemofShearsList
} from "../data/recipe/cuttingBoardRecipe";
import { ItemUtil } from "../lib/ItemUtil";

export class CuttingBoardBlock extends BlockWithEntity {

    @methodEventSub(world.afterEvents.playerPlaceBlock)
    placeBlock(args: PlayerPlaceBlockAfterEvent) {
        const { block } = args;
        if (block.typeId !== "farmersdelight:cutting_board") return;
        const position: Vector3 = { x: block.location.x + 0.5, y: block.location.y, z: block.location.z + 0.5 };
        const entity: Entity = super.setBlock(args.block.dimension, position, "farmersdelight:cutting_board");
        entity.setDynamicProperty("farmersdelight:blockEntityItemStackData", '{"item":"undefined"}');
    }

    @methodEventSub(world.afterEvents.playerInteractWithBlock)
    interactWithBlock(args: PlayerInteractWithBlockAfterEvent): void {
        const { block, itemStack, player } = args;
        if (block?.typeId !== "farmersdelight:cutting_board") return;

        const data = super.entityBlockData(block, { type: 'farmersdelight:cutting_board', location: block.location });
        const inventory = player.getComponent("inventory") as EntityInventoryComponent;
        if (!data || !inventory) return;

        const entity = data.entity;
        const itemId: string = JSON.parse(entity.getDynamicProperty("farmersdelight:blockEntityItemStackData") as string).item;
        const cutToolData = JSON.parse(entity.getDynamicProperty("farmersdelight:cutTool") as string);
        const isEmptyHand = !itemStack;

        if (itemId !== "undefined") {
            this.processCutting(entity, player, itemStack, itemId, cutToolData);
        } else {
            this.placeItemOnBoard(entity, player, itemStack, inventory.container);
        }
    }

    private processCutting(entity: Entity, player: Player, mainHand: ItemStack | undefined, itemId: string, cutToolData: any): void {
        if (!mainHand) {
            entity.dimension.spawnItem(new ItemStack(itemId), entity.location);
            this.clearCuttingBoard(entity);
        } else if (this.isValidCutTool(mainHand, cutToolData)) {
            this.executeCutting(entity, player, itemId, cutToolData);
        } else {
            player.onScreenDisplay.setActionBar({ translate: 'farmersdelight.tips.false_tool' });
        }
    }

    private placeItemOnBoard(entity: Entity, player: Player, mainHand: ItemStack | undefined, container: Container | undefined): void {
        if (!mainHand || !container) return;

        const toolType = this.getToolType(mainHand);
        if (toolType) {
            this.setCuttingBoardProperties(entity, toolType, mainHand.typeId, true);
            this.consumeItem(player, container);
        } else if (!this.setTagTool(entity, mainHand)) {
            player.onScreenDisplay.setActionBar({ translate: 'farmersdelight.tips.cant_cut' });
        }
    }

    private setTagTool(entity: Entity, itemStack: ItemStack): boolean {
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

    private executeCutting(entity: Entity, player: Player, itemId: string, cutToolData: any): void {
        const [namespace, id] = itemId.split(':');
        entity.runCommandAsync("playsound block.farmersdelight.cutting_board @a ~ ~ ~ 1 1");
        entity.runCommandAsync(`loot spawn ${entity.location.x} ${entity.location.y} ${entity.location.z} loot "${namespace}/cutting_board/${id}"`);
        this.clearCuttingBoard(entity);
        if (EntityUtil.gameMode(player)) {
            
        const inventory = player?.getComponent("inventory") as EntityInventoryComponent;
        const container = inventory?.container as Container
            ItemUtil.damageItem(container, player.selectedSlotIndex);
        }
    }

    private clearCuttingBoard(entity: Entity): void {
        entity.setDynamicProperty('farmersdelight:cutTool', undefined);
        entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', '{"item":"undefined"}');
    }

    private isValidCutTool(mainHand: ItemStack, cutToolData: any): boolean {
        return (cutToolData.mode === 'item' && cutToolData.item === mainHand.typeId) ||
            (cutToolData.mode === 'tag' && mainHand.hasTag(cutToolData.tag));
    }

    private setCuttingBoardProperties(entity: Entity, tool: { tag: string; mode: string }, itemId: string, isBlockMode: boolean): void {
        entity.setDynamicProperty('farmersdelight:cutTool', JSON.stringify(tool));
        entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', `{"item":"${itemId}"}`);
        entity.setProperty('farmersdelight:is_block_mode', isBlockMode);
    }

    private consumeItem(player: Player, container: Container): void {
        if (EntityUtil.gameMode(player)) {
            ItemUtil.clearItem(container, player.selectedSlotIndex);
        }
    }

    private getToolType(item: ItemStack): { tag: string; mode: string } | null {
        if (BlockofAxeList.includes(item.typeId)) return { tag: 'minecraft:is_axe', mode: 'tag' };
        if (BlockofKnifeList.includes(item.typeId)) return { tag: 'farmersdelight:is_knife', mode: 'tag' };
        if (BlockofPickaxeList.includes(item.typeId)) return { tag: 'minecraft:is_pickaxe', mode: 'tag' };
        if (BlockofShovelList.includes(item.typeId)) return { tag: 'minecraft:is_shovel', mode: 'tag' };
        if (ItemofAxeList.includes(item.typeId)) return { tag: 'minecraft:is_axe', mode: 'tag' };
        if (ItemofKnifeList.includes(item.typeId)) return { tag: 'farmersdelight:is_knife', mode: 'tag' };
        if (ItemofPickaxeList.includes(item.typeId)) return { tag: 'minecraft:is_pickaxe', mode: 'tag' };
        if (ItemofShearsList.includes(item.typeId)) return { tag: 'minecraft:shears', mode: 'item' };
        return null;
    }
}
