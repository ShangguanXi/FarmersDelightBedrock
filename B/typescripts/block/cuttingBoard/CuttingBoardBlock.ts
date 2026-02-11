import {
    EntityInventoryComponent,
    EquipmentSlot,
    ItemComponentTypes,
    ItemStack,
    PlayerInteractWithBlockAfterEvent,
    PlayerPlaceBlockAfterEvent,
    Vector3,
    world,
} from "@minecraft/server";
import { BlockWithEntity } from "../../lib/BlockWithEntity";
import { hasLimitedMaterials } from "../../lib/EntityUtil";
import {
    cuttingBoardRecipeManager
} from "../../data/recipe/cuttingBoardRecipe";
import { hurtItem, hurtEquippedItem, spawnStack, takeEquippedItem, takeItem } from "../../lib/ItemUtil";
import { CuttingBroadComponentParams } from "../../customComponents/item/CuttableComponent";
import { subscribeEvent } from "../../lib/EventSubscriber";


export class CuttingBoardBlock extends BlockWithEntity {
    @subscribeEvent(world.afterEvents.playerPlaceBlock)
    placeBlock(args: PlayerPlaceBlockAfterEvent) {
        if (args.block.typeId !== "farmersdelight:cutting_board") return;
        const { x, y, z } = args.block.location;
        const entity = super.setBlock(args.block.dimension, { x: x + 0.5, y, z: z + 0.5 }, "farmersdelight:cutting_board");
        entity.setDynamicProperty("farmersdelight:blockEntityItemStackData", '{"item":"minecraft:air"}');
        entity.setProperty("farmersdelight:is_block_mode", false)
    }

    @subscribeEvent(world.afterEvents.playerInteractWithBlock)
    interactWithBlock(args: PlayerInteractWithBlockAfterEvent): void {
        const block = args.block;
        if (block?.typeId !== "farmersdelight:cutting_board") return;

        const data = super.entityBlockData(block, {
            type: 'farmersdelight:cutting_board',
            location: block.location
        });

        const { x, y, z } = block.location;
        const player = args.player;
        const inventory = player.getComponent("inventory") as EntityInventoryComponent;
        const container = inventory?.container;
        if (!data || !container) return;
        const entity = data.entity;
        const itemStack = args.itemStack;
        const equip = player.getComponent('minecraft:equippable');
        const itemData = JSON.parse(entity.getDynamicProperty("farmersdelight:blockEntityItemStackData") as string);

        const entityInv = entity.getComponent('minecraft:inventory');
        const currentItem = itemData.item as string;
        const face = block.permutation.getState("minecraft:cardinal_direction") as string;
        const offsets: { [key: string]: { x: number; y: number; z: number } } = {
            south: { x: -0.15, y: 0, z: 0 },
            north: { x: 0.15, y: 0, z: 0 },
            west: { x: 0, y: 0, z: -0.15 },
            east: { x: 0, y: 0, z: 0.15 }
        };
        const offset = offsets[face] ?? { x: 0, y: 0, z: 0 };

        if (currentItem === "minecraft:air") {
            // 砧板为空，尝试放入物品
            if (!itemStack) return;
            const recipes = cuttingBoardRecipeManager.getMatchingRecipes(itemStack);
            if (recipes.length === 0) {
                // 无配方定义，显示提示
                player.onScreenDisplay.setActionBar({ translate: 'farmersdelight.tips.cant_cut' });
                return;
            }
            // 有配方定义，放入物品
            const recipe = recipes[0];
            const isBlockType = recipe.is_block_type;
            entityInv?.container?.setItem(0, itemStack);
            equip?.setEquipment(EquipmentSlot.Mainhand, undefined);
            entity.setDynamicProperty("farmersdelight:blockEntityItemStackData", `{"item":"${itemStack.typeId}"}`);
            entity.setDynamicProperty("farmersdelight:isBlockType", isBlockType);
            entity.setProperty("farmersdelight:is_block_mode", isBlockType)
            if (isBlockType) {
                entity.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 ${itemStack.typeId}`);
            }
        } else {
            const boardItemStack = entityInv?.container?.getItem(0);
            if (!itemStack) {
                container.setItem(player.selectedSlotIndex, boardItemStack);
                entity.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 minecraft:air`);
                entityInv?.container?.setItem(0, undefined);
                entity.setDynamicProperty("farmersdelight:blockEntityItemStackData", '{"item":"minecraft:air"}');
                entity.setProperty("farmersdelight:is_block_mode", false)
                return;
            };
            // 尝试用手持工具进行切割，用存储的物品ID构建ItemStack来匹配配方
            if (!boardItemStack) return;
            // 通过recognizeRecipe检查手持工具是否能处理砧板上的物品
            const recipe = cuttingBoardRecipeManager.recognizeRecipe(boardItemStack, itemStack);
            if (!recipe) {
                player.onScreenDisplay.setActionBar({ translate: 'farmersdelight.tips.false_tool' });
                return;
            }

            // 获取实体背包中物品的数量
            const boardItemAmount = boardItemStack.amount;
            // 检查手持工具是否有耐久度
            const durabilityComp = itemStack.getComponent(ItemComponentTypes.Durability);

            if (durabilityComp) {
                // 工具有耐久度
                const remainingDurability = durabilityComp.maxDurability - durabilityComp.damage;
                if (remainingDurability > boardItemAmount) {
                    // 耐久度大于背包物品数量：按背包物品数量执行，生成结果物品
                    for (let i = 0; i < boardItemAmount; i++) {
                        for (const resultItem of recipe.result) {
                            const chance = resultItem.chance ?? 1;
                            if (Math.random() <= chance) {
                                const stack = new ItemStack(resultItem.item, resultItem.count ?? 1);
                                spawnStack(stack, entity);
                            }
                        }
                    }
                    // 扣除工具耐久
                    hurtEquippedItem(player, itemStack, boardItemAmount);
                    // 清空砧板
                    entityInv?.container?.setItem(0, undefined);
                    entity.setDynamicProperty("farmersdelight:blockEntityItemStackData", '{"item":"minecraft:air"}');
                    entity.setProperty("farmersdelight:is_block_mode", false)
                } else {
                    // 耐久度小于等于背包物品数量：按耐久度次数处理
                    for (let i = 0; i < remainingDurability; i++) {
                        for (const resultItem of recipe.result) {
                            const chance = resultItem.chance ?? 1;
                            if (Math.random() <= chance) {
                                const stack = new ItemStack(resultItem.item, resultItem.count ?? 1);
                                spawnStack(stack, entity);
                            }
                        }
                    }
                    // 扣除背包中对应数量的物品
                    const newAmount = boardItemAmount - remainingDurability;
                    if (newAmount > 0) {
                        boardItemStack.amount = newAmount;
                        entityInv?.container?.setItem(0, boardItemStack);
                    } else {
                        entityInv?.container?.setItem(0, undefined);
                        entity.setDynamicProperty("farmersdelight:blockEntityItemStackData", '{"item":"minecraft:air"}');
                        entity.setProperty("farmersdelight:is_block_mode", false)

                        entity.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 minecraft:air`);
                    }
                    // 工具耗尽，清空玩家主手
                    equip?.setEquipment(EquipmentSlot.Mainhand, undefined);
                }
            } else {
                // 工具无耐久度：直接按背包物品数量处理
                for (let i = 0; i < boardItemAmount; i++) {
                    for (const resultItem of recipe.result) {
                        const chance = resultItem.chance ?? 1;
                        if (Math.random() <= chance) {
                            const stack = new ItemStack(resultItem.item, resultItem.count ?? 1);
                            spawnStack(stack, entity);
                        }
                    }
                }
                // 清空砧板
                entityInv?.container?.setItem(0, undefined);
                entity.setDynamicProperty("farmersdelight:blockEntityItemStackData", '{"item":"minecraft:air"}');
                entity.setProperty("farmersdelight:is_block_mode", false)
            }


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

