import { Block, Container, Entity, EntityInventoryComponent, ItemStack, Player, Vector3, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { BlockWithEntity } from "./BlockWithEntity";
import { EntityUtil } from "../lib/EntityUtil";
import { farmersdelightBlockList, vanillaItemList } from "../data/recipe/cuttingBoardRecipe";
import { ItemUtil } from "../lib/ItemUtil";


export class CuttingBoardBlock extends BlockWithEntity {
    //初始化，生成实体并初始化方块实体存储
    @methodEventSub(world.afterEvents.playerPlaceBlock)
    placeBlock(args: any) {
        const block: Block = args.block;
        if (block.typeId != "farmersdelight:cutting_board") return;
        const { x, y, z }: Vector3 = block.location;
        const entity: Entity = super.setBlock(args, { x: x + 0.5, y: y, z: z + 0.5 }, "farmersdelight:cutting_board");
        entity.setDynamicProperty("farmersdelight:blockEntityItemStackData", '{"item":"undefined"}');
    };
    //物品与方块互动事件
    @methodEventSub(world.afterEvents.itemUseOn)
    useOnBlock(args: any): void {
        if (args?.block?.typeId !== "farmersdelight:cutting_board") return;
        //获取方块实体数据
        const data = super.entityBlockData(args, {
            type: 'farmersdelight:cutting_board',
            location: args.block.location
        });
        const player: Player = args.source;
        const container: Container | undefined = player.getComponent(EntityInventoryComponent.componentId)?.container;
        if (!data || !container) return;
        const entity: Entity = data.entity;
        //mainHand为主手物品堆叠
        const mainHand: ItemStack = args.itemStack;
        //这玩意写的是itemStack, 但实际上只是一个物品的标识符, 是个字符串...
        const itemStack: string = JSON.parse(entity.getDynamicProperty("farmersdelight:blockEntityItemStackData") as string)["item"];
        //若砧板上有物品
        if (itemStack != "undefined") {
            const cutToolData = JSON.parse(entity.getDynamicProperty("farmersdelight:cutTool") as string);
            const mode = cutToolData['mode'];
            if ((mode == 'item' && cutToolData[mode] == mainHand.typeId) || (mode == 'tag' && mainHand.hasTag(cutToolData[mode]))) {
                const id = itemStack.split(':')[1];
                entity.runCommandAsync("playsound block.farmersdelight.cutting_board @a ~ ~ ~ 1 1");
                //对应战利品表名称:"farmersdelight_<物品标识符(不含命名空间)>,放在farmersdelight/cutting_board目录下"
                entity.runCommandAsync(`loot spawn ${entity.location.x} ${entity.location.y} ${entity.location.z} loot "farmersdelight/cutting_board/farmersdelight_${id}"`);
                entity.setDynamicProperty('farmersdelight:cutTool', undefined);
                entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', '{"item":"undefined"}');
                if (EntityUtil.gameMode(player)) {
                    ItemUtil.damageItem(container, player.selectedSlot);
                }
            }
            else {
                player.onScreenDisplay.setActionBar({ translate: 'farmersdelight.tips.false_tool' });
            };
        }
        //若砧板上没有物品
        else {
            let canCut = false;
            if (farmersdelightBlockList.includes(mainHand.typeId) || vanillaItemList.includes(mainHand.typeId)) {
                //原版物品与野生作物
                entity.setDynamicProperty('farmersdelight:cutTool', `{"tag": "farmersdelight:is_knife", "mode": "tag"}`);
                entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', `{"item":"${mainHand.typeId}"}`);
                if (EntityUtil.gameMode(player)) {
                    ItemUtil.clearItem(container, player.selectedSlot);
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
                        if (EntityUtil.gameMode(player)) {
                            ItemUtil.clearItem(container, player.selectedSlot);
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
    //方块互动事件, 用于处理空手取下物品
    @methodEventSub(world.afterEvents.playerInteractWithBlock)
    interactWithBlock(args: any): void {
        if (args?.block?.typeId !== "farmersdelight:cutting_board") return;
        //获取方块实体数据
        const data = super.entityBlockData(args, {
            type: 'farmersdelight:cutting_board',
            location: args.block.location
        });
        const player: Player = args.player;
        const container: Container | undefined = player.getComponent(EntityInventoryComponent.componentId)?.container;
        if (!data || !container) return;
        if (container.getItem(player.selectedSlot)) return;
        const entity: Entity = data.entity;
        const itemId: string = JSON.parse(entity.getDynamicProperty("farmersdelight:blockEntityItemStackData") as string)["item"];
        if (itemId == 'undefined') return;
        entity.dimension.spawnItem(new ItemStack(itemId), entity.location);
        entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', '{"item":"undefined"}');
    };
};