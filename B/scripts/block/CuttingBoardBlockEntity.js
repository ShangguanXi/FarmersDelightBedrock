var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { EquipmentSlot, ItemComponentTypes, ItemStack, PlayerInteractWithBlockAfterEvent, system, world, } from "@minecraft/server";
import { attachedBlockEntity, subscribeEvent } from "../lib/EventSubscriber";
import { getBlockEntity } from "../lib/BlockWithEntity";
import { dropsItems } from "../lib/EntityUtil";
import { cuttingBoardRecipeManager } from "../data/recipe/cuttingBoardRecipe";
import { hurtEquippedItem, spawnStack } from "../lib/ItemUtil";
let CuttingBoardBlockEntity = class CuttingBoardBlockEntity {
    static onDiscard(entity) {
        dropsItems(entity);
    }
    static onTick(entity, block) {
        const { x, y, z } = entity.location;
        const currentTick = system.currentTick % 2;
        const itemStack = JSON.parse(entity.getDynamicProperty('farmersdelight:blockEntityItemStackData') ?? '{"item":"minecraft:air"}')["item"];
        if (!currentTick && itemStack) {
            const id = itemStack.split(':');
            const name = id[0] == 'minecraft' ? `farmersdelight:${id[0]}_${id[1]}` : itemStack;
            entity.dimension.spawnParticle(name, { x: x, y: y + 0.0563, z: z });
        }
    }
    static onInteract(args) {
        const block = args.block;
        if (block?.typeId !== "farmersdelight:cutting_board")
            return;
        const entity = getBlockEntity(block);
        const { x, y, z } = block.location;
        const player = args.player;
        const inventory = player.getComponent("inventory");
        const container = inventory?.container;
        if (!entity || !container)
            return;
        const itemStack = args.itemStack;
        const equip = player.getComponent('minecraft:equippable');
        const itemData = JSON.parse(entity.getDynamicProperty("farmersdelight:blockEntityItemStackData") ?? '{"item":"minecraft:air"}');
        const entityInv = entity.getComponent('minecraft:inventory');
        const currentItem = itemData.item;
        const face = block.permutation.getState("minecraft:cardinal_direction");
        const offsets = {
            south: { x: -0.15, y: 0, z: 0 },
            north: { x: 0.15, y: 0, z: 0 },
            west: { x: 0, y: 0, z: -0.15 },
            east: { x: 0, y: 0, z: 0.15 }
        };
        const offset = offsets[face] ?? { x: 0, y: 0, z: 0 };
        if (currentItem === "minecraft:air") {
            if (!itemStack)
                return;
            const recipes = cuttingBoardRecipeManager.getMatchingRecipes(itemStack);
            if (recipes.length === 0) {
                player.onScreenDisplay.setActionBar({ translate: 'farmersdelight.tips.cant_cut' });
                return;
            }
            const recipe = recipes[0];
            const isBlockType = recipe.is_block_type;
            entityInv?.container?.setItem(0, itemStack);
            equip?.setEquipment(EquipmentSlot.Mainhand, undefined);
            entity.setDynamicProperty("farmersdelight:blockEntityItemStackData", `{"item":"${itemStack.typeId}"}`);
            entity.setDynamicProperty("farmersdelight:isBlockType", isBlockType);
            entity.setProperty("farmersdelight:is_block_mode", isBlockType);
            if (isBlockType) {
                entity.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 ${itemStack.typeId}`);
            }
        }
        else {
            const boardItemStack = entityInv?.container?.getItem(0);
            if (!itemStack) {
                container.setItem(player.selectedSlotIndex, boardItemStack);
                entity.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 minecraft:air`);
                entityInv?.container?.setItem(0, undefined);
                entity.setDynamicProperty("farmersdelight:blockEntityItemStackData", '{"item":"minecraft:air"}');
                entity.setProperty("farmersdelight:is_block_mode", false);
                return;
            }
            ;
            if (!boardItemStack)
                return;
            const recipe = cuttingBoardRecipeManager.recognizeRecipe(boardItemStack, itemStack);
            if (!recipe) {
                player.onScreenDisplay.setActionBar({ translate: 'farmersdelight.tips.false_tool' });
                return;
            }
            const boardItemAmount = boardItemStack.amount;
            const durabilityComp = itemStack.getComponent(ItemComponentTypes.Durability);
            if (durabilityComp) {
                const remainingDurability = durabilityComp.maxDurability - durabilityComp.damage;
                if (remainingDurability > boardItemAmount) {
                    for (let i = 0; i < boardItemAmount; i++) {
                        for (const resultItem of recipe.result) {
                            const chance = resultItem.chance ?? 1;
                            if (Math.random() <= chance) {
                                const stack = new ItemStack(resultItem.item, resultItem.count ?? 1);
                                spawnStack(stack, entity);
                            }
                        }
                    }
                    hurtEquippedItem(player, itemStack, boardItemAmount);
                    block.dimension.playSound(recipe.sound, block.location);
                    entityInv?.container?.setItem(0, undefined);
                    entity.setDynamicProperty("farmersdelight:blockEntityItemStackData", '{"item":"minecraft:air"}');
                    entity.setProperty("farmersdelight:is_block_mode", false);
                    entity.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 minecraft:air`);
                }
                else {
                    for (let i = 0; i < remainingDurability; i++) {
                        for (const resultItem of recipe.result) {
                            const chance = resultItem.chance ?? 1;
                            if (Math.random() <= chance) {
                                const stack = new ItemStack(resultItem.item, resultItem.count ?? 1);
                                spawnStack(stack, entity);
                            }
                        }
                    }
                    block.dimension.playSound(recipe.sound, block.location);
                    const newAmount = boardItemAmount - remainingDurability;
                    if (newAmount > 0) {
                        boardItemStack.amount = newAmount;
                        entityInv?.container?.setItem(0, boardItemStack);
                    }
                    else {
                        entityInv?.container?.setItem(0, undefined);
                        entity.setDynamicProperty("farmersdelight:blockEntityItemStackData", '{"item":"minecraft:air"}');
                        entity.setProperty("farmersdelight:is_block_mode", false);
                        entity.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 minecraft:air`);
                    }
                    equip?.setEquipment(EquipmentSlot.Mainhand, undefined);
                }
            }
            else {
                for (let i = 0; i < boardItemAmount; i++) {
                    for (const resultItem of recipe.result) {
                        const chance = resultItem.chance ?? 1;
                        if (Math.random() <= chance) {
                            const stack = new ItemStack(resultItem.item, resultItem.count ?? 1);
                            spawnStack(stack, entity);
                        }
                    }
                }
                block.dimension.playSound(recipe.sound, block.location);
                entityInv?.container?.setItem(0, undefined);
                entity.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 minecraft:air`);
                entity.setDynamicProperty("farmersdelight:blockEntityItemStackData", '{"item":"minecraft:air"}');
                entity.setProperty("farmersdelight:is_block_mode", false);
            }
        }
    }
};
__decorate([
    subscribeEvent(world.afterEvents.playerInteractWithBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerInteractWithBlockAfterEvent]),
    __metadata("design:returntype", void 0)
], CuttingBoardBlockEntity, "onInteract", null);
CuttingBoardBlockEntity = __decorate([
    attachedBlockEntity({ eventTypes: ["farmersdelight:cutting_board_tick"] })
], CuttingBoardBlockEntity);
export { CuttingBoardBlockEntity };
