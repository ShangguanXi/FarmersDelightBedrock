import { Block, BlockPermutation, Container, Entity, EntityInventoryComponent, ItemStack, Player, PlayerInteractWithBlockAfterEvent, PlayerPlaceBlockAfterEvent, Vector3, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { BlockWithEntity } from "./BlockWithEntity";
import { EntityUtil } from "../lib/EntityUtil";
import { BlockofAxeList, BlockofKnifeList, BlockofPickaxeList, BlockofShovelList, ItemofAxeList, ItemofBlockList, ItemofKnifeList } from "../data/recipe/cuttingBoardRecipe";
import { ItemUtil } from "../lib/ItemUtil";


export class CuttingBoardBlock extends BlockWithEntity {
    //初始化，生成实体并初始化方块实体存储
    @methodEventSub(world.afterEvents.playerPlaceBlock)
    placeBlock(args: PlayerPlaceBlockAfterEvent) {
        const block: Block = args.block;
        if (block.typeId != "farmersdelight:cutting_board") return;
        const { x, y, z }: Vector3 = block.location;
        const entity: Entity = super.setBlock(args.block.dimension, { x: x + 0.5, y: y, z: z + 0.5 }, "farmersdelight:cutting_board");
        entity.setDynamicProperty("farmersdelight:blockEntityItemStackData", '{"item":"undefined"}');
    };
    //物品与方块互动事件
    //方块互动事件, 用于处理空手取下物品
    @methodEventSub(world.afterEvents.playerInteractWithBlock)
    interactWithBlock(args: PlayerInteractWithBlockAfterEvent): void {
        if (args?.block?.typeId !== "farmersdelight:cutting_board") return;
        //获取方块实体数据
        const data = super.entityBlockData(args.block, {
            type: 'farmersdelight:cutting_board',
            location: args.block.location
        });
        const player: Player = args.player;
        const container: Container | undefined = player.getComponent(EntityInventoryComponent.componentId)?.container;
        if (!data || !container) return;
        const entity: Entity = data.entity;
        //mainHand为主手物品堆叠
        const mainHand = args.itemStack;
        const itemId: string = JSON.parse(entity.getDynamicProperty("farmersdelight:blockEntityItemStackData") as string)["item"];
        //若砧板上有物品
        if (itemId != "undefined") {
            const cutToolData = JSON.parse(entity.getDynamicProperty("farmersdelight:cutTool") as string);
            const mode = cutToolData['mode'];
            if (!mainHand) {
                entity.dimension.spawnItem(new ItemStack(itemId), entity.location);
                entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', '{"item":"undefined"}');
            }
            else if ((mode == 'item' && cutToolData[mode] == mainHand.typeId) || (mode == 'tag' && mainHand.hasTag(cutToolData[mode]))) {
                const id = itemId.split(':')[1];
                const namespace = itemId.split(':')[0];
                entity.runCommandAsync("playsound block.farmersdelight.cutting_board @a ~ ~ ~ 1 1");
                //对应战利品表名称:"<物品标识符(不含命名空间)>,放在<物品命名空间>/cutting_board目录下"
                entity.runCommandAsync(`loot spawn ${entity.location.x} ${entity.location.y} ${entity.location.z} loot "${namespace}/cutting_board/${id}"`);
                entity.setDynamicProperty('farmersdelight:cutTool', undefined);
                entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', '{"item":"undefined"}');
                entity.runCommandAsync(`replaceitem entity @s slot.weapon.mainhand 0 air`);
                if (EntityUtil.gameMode(player)) {
                    ItemUtil.damageItem(container, player.selectedSlotIndex);
                }
            }
            else {
                player.onScreenDisplay.setActionBar({ translate: 'farmersdelight.tips.false_tool' });
            };
        }
        //若砧板上没有物品
        else {
            let canCut = false;
            if (!mainHand) return
            let isBlock
            if (BlockofAxeList.includes(mainHand.typeId)) {
                //需要斧头的方块
                entity.setDynamicProperty('farmersdelight:cutTool', `{"tag": "minecraft:is_axe", "mode": "tag"}`);
                entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', `{"item":"${mainHand.typeId}"}`);
                entity.runCommandAsync(`replaceitem entity @s slot.weapon.mainhand 0 ${mainHand.typeId}`);
                entity.setProperty('farmersdelight:is_block_mode', true);
                isBlock = true;
                if (EntityUtil.gameMode(player)) {
                    ItemUtil.clearItem(container, player.selectedSlotIndex);
                };
                canCut = true;
            };
            if (BlockofKnifeList.includes(mainHand.typeId)) {
                //需要刀的方块
                entity.setDynamicProperty('farmersdelight:cutTool', `{"tag": "farmersdelight:is_knife", "mode": "tag"}`);
                entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', `{"item":"${mainHand.typeId}"}`);
                entity.runCommandAsync(`replaceitem entity @s slot.weapon.mainhand 0 ${mainHand.typeId}`);
                entity.setProperty('farmersdelight:is_block_mode', true);
                isBlock = true;
                if (EntityUtil.gameMode(player)) {
                    ItemUtil.clearItem(container, player.selectedSlotIndex);
                };
                canCut = true;
            };
            if (BlockofPickaxeList.includes(mainHand.typeId)) {
                //需要镐子的方块
                entity.setDynamicProperty('farmersdelight:cutTool', `{"tag": "minecraft:is_pickaxe", "mode": "tag"}`);
                entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', `{"item":"${mainHand.typeId}"}`);
                entity.runCommandAsync(`replaceitem entity @s slot.weapon.mainhand 0 ${mainHand.typeId}`);
                entity.setProperty('farmersdelight:is_block_mode', true);
                isBlock = true;
                if (EntityUtil.gameMode(player)) {
                    ItemUtil.clearItem(container, player.selectedSlotIndex);
                };
                canCut = true;
            };
            if (BlockofShovelList.includes(mainHand.typeId)) {
                //需要铲的方块
                entity.setDynamicProperty('farmersdelight:cutTool', `{"tag": "minecraft:is_shovel", "mode": "tag"}`);
                entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', `{"item":"${mainHand.typeId}"}`);
                entity.runCommandAsync(`replaceitem entity @s slot.weapon.mainhand 0 ${mainHand.typeId}`);
                entity.setProperty('farmersdelight:is_block_mode', true);
                isBlock = true;
                if (EntityUtil.gameMode(player)) {
                    ItemUtil.clearItem(container, player.selectedSlotIndex);
                };
                canCut = true;
            };
            if (ItemofBlockList.includes(mainHand.typeId) || ItemofKnifeList.includes(mainHand.typeId)) {
                //原版需要刀的物品与野生作物
                entity.setDynamicProperty('farmersdelight:cutTool', `{"tag": "farmersdelight:is_knife", "mode": "tag"}`);
                entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', `{"item":"${mainHand.typeId}"}`);
                entity.setProperty('farmersdelight:is_block_mode', false);
                isBlock = false;
                if (EntityUtil.gameMode(player)) {
                    ItemUtil.clearItem(container, player.selectedSlotIndex);
                };
                canCut = true;
            };
            if (ItemofAxeList.includes(mainHand.typeId)) {
                //原版需要斧头的物品
                entity.setDynamicProperty('farmersdelight:cutTool', `{"tag": "minecraft:is_axe", "mode": "tag"}`);
                entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', `{"item":"${mainHand.typeId}"}`);
                entity.setProperty('farmersdelight:is_block_mode', false);
                isBlock = false;
                if (EntityUtil.gameMode(player)) {
                    ItemUtil.clearItem(container, player.selectedSlotIndex);
                };
                canCut = true;
            }
            else {
                const tags = mainHand.getTags();
                for (const tag of tags) {
                    //被切物品tag应为 "farmersdelight:can_cut.item.<切割工具标识符>" 或者 "farmersdelight:can_cut.tag.<切割工具标签>" 形式
                    //即ids[0]='farmersdelight:can_cut', ids[1]='item'或'tag'
                    const ids = tag.split('.');
                    if (ids[0] == 'farmersdelight:can_cut') {
                        //正确格式例如 "{'tag': 'farmersdelight:is_knife'}"
                        entity.setDynamicProperty('farmersdelight:cutTool', `{"${ids[1]}": "${ids[2]}", "mode": "${ids[1]}"}`);
                        entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', `{"item":"${mainHand.typeId}"}`);
                        if (isBlock) {
                            entity.runCommandAsync(`replaceitem entity @s slot.weapon.mainhand 0 ${mainHand.typeId}`);
                        }
                        if (EntityUtil.gameMode(player)) {
                            ItemUtil.clearItem(container, player.selectedSlotIndex);
                        };
                        canCut = true;
                    }
                    break;
                };
            }
            if (!canCut) {
                player.onScreenDisplay.setActionBar({ translate: 'farmersdelight.tips.cant_cut' });
            };
        };
    };
};