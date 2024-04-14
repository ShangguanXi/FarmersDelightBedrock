var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BlockPermutation, EntityInventoryComponent, ItemStack, PlayerInteractWithBlockAfterEvent, PlayerPlaceBlockAfterEvent, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { BlockWithEntity } from "./BlockWithEntity";
import { EntityUtil } from "../lib/EntityUtil";
import { BlockofAxeList, BlockofKnifeList, BlockofPickaxeList, BlockofShovelList, ItemofAxeList, ItemofBlockList, ItemofKnifeList } from "../data/recipe/cuttingBoardRecipe";
import { ItemUtil } from "../lib/ItemUtil";
export class CuttingBoardBlock extends BlockWithEntity {
    //初始化，生成实体并初始化方块实体存储
    placeBlock(args) {
        const block = args.block;
        if (block.typeId != "farmersdelight:cutting_board")
            return;
        const { x, y, z } = block.location;
        const entity = super.setBlock(args.block.dimension, { x: x + 0.5, y: y, z: z + 0.5 }, "farmersdelight:cutting_board");
        entity.setDynamicProperty("farmersdelight:blockEntityItemStackData", '{"item":"undefined"}');
    }
    ;
    //物品与方块互动事件
    //方块互动事件, 用于处理空手取下物品
    interactWithBlock(args) {
        if (args?.block?.typeId !== "farmersdelight:cutting_board")
            return;
        //获取方块实体数据
        const data = super.entityBlockData(args.block, {
            type: 'farmersdelight:cutting_board',
            location: args.block.location
        });
        const player = args.player;
        const container = player.getComponent(EntityInventoryComponent.componentId)?.container;
        if (!data || !container)
            return;
        const entity = data.entity;
        //mainHand为主手物品堆叠
        const mainHand = args.itemStack;
        const itemId = JSON.parse(entity.getDynamicProperty("farmersdelight:blockEntityItemStackData"))["item"];
        //若砧板上有物品
        if (itemId != "undefined") {
            const cutToolData = JSON.parse(entity.getDynamicProperty("farmersdelight:cutTool"));
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
                    ItemUtil.damageItem(container, player.selectedSlot);
                }
            }
            else {
                player.onScreenDisplay.setActionBar({ translate: 'farmersdelight.tips.false_tool' });
            }
            ;
        }
        //若砧板上没有物品
        else {
            let canCut = false;
            if (!mainHand)
                return;
            let isBlock;
            try {
                BlockPermutation.resolve(mainHand.typeId);
                entity.setProperty('farmersdelight:is_block_mode', true);
                isBlock = true;
            }
            catch {
                entity.setProperty('farmersdelight:is_block_mode', false);
                isBlock = false;
            }
            if (BlockofAxeList.includes(mainHand.typeId)) {
                //需要斧头的方块
                entity.setDynamicProperty('farmersdelight:cutTool', `{"tag": "minecraft:is_axe", "mode": "tag"}`);
                entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', `{"item":"${mainHand.typeId}"}`);
                entity.runCommandAsync(`replaceitem entity @s slot.weapon.mainhand 0 ${mainHand.typeId}`);
                if (EntityUtil.gameMode(player)) {
                    ItemUtil.clearItem(container, player.selectedSlot);
                }
                ;
                canCut = true;
            }
            ;
            if (BlockofKnifeList.includes(mainHand.typeId)) {
                //需要刀的方块
                entity.setDynamicProperty('farmersdelight:cutTool', `{"tag": "farmersdelight:is_knife", "mode": "tag"}`);
                entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', `{"item":"${mainHand.typeId}"}`);
                entity.runCommandAsync(`replaceitem entity @s slot.weapon.mainhand 0 ${mainHand.typeId}`);
                if (EntityUtil.gameMode(player)) {
                    ItemUtil.clearItem(container, player.selectedSlot);
                }
                ;
                canCut = true;
            }
            ;
            if (BlockofPickaxeList.includes(mainHand.typeId)) {
                //需要镐子的方块
                entity.setDynamicProperty('farmersdelight:cutTool', `{"tag": "minecraft:is_pickaxe", "mode": "tag"}`);
                entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', `{"item":"${mainHand.typeId}"}`);
                entity.runCommandAsync(`replaceitem entity @s slot.weapon.mainhand 0 ${mainHand.typeId}`);
                if (EntityUtil.gameMode(player)) {
                    ItemUtil.clearItem(container, player.selectedSlot);
                }
                ;
                canCut = true;
            }
            ;
            if (BlockofShovelList.includes(mainHand.typeId)) {
                //需要铲的方块
                entity.setDynamicProperty('farmersdelight:cutTool', `{"tag": "minecraft:is_shovel", "mode": "tag"}`);
                entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', `{"item":"${mainHand.typeId}"}`);
                entity.runCommandAsync(`replaceitem entity @s slot.weapon.mainhand 0 ${mainHand.typeId}`);
                if (EntityUtil.gameMode(player)) {
                    ItemUtil.clearItem(container, player.selectedSlot);
                }
                ;
                canCut = true;
            }
            ;
            if (ItemofBlockList.includes(mainHand.typeId) || ItemofKnifeList.includes(mainHand.typeId)) {
                //原版需要刀的物品与野生作物
                entity.setDynamicProperty('farmersdelight:cutTool', `{"tag": "farmersdelight:is_knife", "mode": "tag"}`);
                entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', `{"item":"${mainHand.typeId}"}`);
                if (EntityUtil.gameMode(player)) {
                    ItemUtil.clearItem(container, player.selectedSlot);
                }
                ;
                canCut = true;
            }
            ;
            if (ItemofAxeList.includes(mainHand.typeId)) {
                //原版需要斧头的物品
                entity.setDynamicProperty('farmersdelight:cutTool', `{"tag": "minecraft:is_axe", "mode": "tag"}`);
                entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', `{"item":"${mainHand.typeId}"}`);
                if (EntityUtil.gameMode(player)) {
                    ItemUtil.clearItem(container, player.selectedSlot);
                }
                ;
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
                            ItemUtil.clearItem(container, player.selectedSlot);
                        }
                        ;
                        canCut = true;
                    }
                    break;
                }
                ;
            }
            if (!canCut) {
                player.onScreenDisplay.setActionBar({ translate: 'farmersdelight.tips.cant_cut' });
            }
            ;
        }
        ;
    }
    ;
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
;
//# sourceMappingURL=CuttingBoardBlock.js.map