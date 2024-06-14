import { Block, Container, Entity, EntityInventoryComponent, EntitySpawnAfterEvent, ItemStack, Vector3, system, world } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { BlockEntity, BlockEntityData } from "./BlockEntity";
import ObjectUtil from "../../lib/ObjectUtil";
import { vanillaCookingPotRecipe } from "../../data/recipe/cookingPotRecipe";
import { CookingPotRecipe } from "../../lib/CookingPotRecipe";
import { heatConductors, heatSources } from "../../data/heatBlocks";


const fireArrowFull: ItemStack = new ItemStack("farmersdelight:fire_1");
const fireArrowEmpty: ItemStack = new ItemStack("farmersdelight:fire_0");
const emptyArrow: ItemStack = new ItemStack("farmersdelight:cooking_pot_arrow_0");
const recipes: any[] = vanillaCookingPotRecipe.recipe;
const recipeFactory: Map<string, CookingPotRecipe> = new Map()

// 意义不明的进度函数
function arrowheadUtil(entity: Entity, oldItemStack: ItemStack, slot: number, container: Container) {
    if (entity.getDynamicProperty("farmersdelight:not_can_set")) return;
    const itemStack: ItemStack | undefined = container.getItem(slot);
    if (itemStack?.typeId != oldItemStack.typeId) {
        container.setItem(slot, oldItemStack);
    }
}

//检查热源  自定义热源可以使用farmersdelight:heat_source的tag进行定义
function heatCheck(block: Block) {
    const blockBelow = block.below()
    if (heatSources.includes(blockBelow?.typeId as string) || blockBelow?.hasTag('farmersdelight:heat_source')) return true
    if (heatConductors.includes(blockBelow?.typeId as string) || blockBelow?.hasTag('farmersdelight:heat_conductors')) {
        const blockBelow2 = block.below(2)
        if (heatSources.includes(blockBelow2?.typeId as string) || blockBelow2?.hasTag('farmersdelight:heat_source')) return true
    }
    return false
}

world.afterEvents.pistonActivate

//刷新方块实体状态以及防TP
function blockEntityLoot(args: BlockEntityData, id: string) {
    const cookingPotblock = new ItemStack('farmersdelight:cooking_pot');
    if (!ObjectUtil.isEqual(args.entity.location, args.blockEntityDataLocation)) args.entity.teleport(args.blockEntityDataLocation);
    if (args.block?.typeId == id) return;
    const container: Container | undefined = args.entity.getComponent(EntityInventoryComponent.componentId)?.container;

    for (let slot = 0; slot < 9; slot++) {
        const itemStack: ItemStack | undefined = container?.getItem(slot);
        if (slot != 6 && slot != 8 && itemStack) {
            args.entity.dimension.spawnItem(itemStack, args.blockEntityDataLocation);
        }
        if (slot == 6) {
            if (itemStack) {
                const typeId: string = itemStack.typeId;
                const amount: number = itemStack.amount;
                container?.setItem(6, undefined);
                cookingPotblock.setLore([`§r§f${amount} 份食物: ${typeId}`]);
            }
            container?.setItem(9, undefined);
            container?.setItem(10, undefined);
            args.entity.setDynamicProperty("farmersdelight:not_can_set", true);
            args.entity.dimension.spawnItem(cookingPotblock, args.blockEntityDataLocation);
        }
        if (slot == 8) {
            if (itemStack) {
                args.entity.dimension.spawnItem(itemStack, args.blockEntityDataLocation);
            }
            BlockEntity.clearEntity(args);
            break
        }
    }
}
export class CookingPotBlockEntity extends BlockEntity {
    @methodEventSub(world.afterEvents.dataDrivenEntityTrigger, { entityTypes: ["farmersdelight:cooking_pot"], eventTypes: ["farmersdelight:cooking_pot_tick"] })
    tick(args: any) {
        const entityBlockData = super.blockEntityData(args.entity);
        if (!entityBlockData) return;
        const entity: Entity = entityBlockData.entity;
        const { x, y, z }: Vector3 = entity.location;
        const block: Block = entityBlockData.block;
        const container: Container | undefined = entity.getComponent(EntityInventoryComponent.componentId)?.container;
        if (!container) return;
        blockEntityLoot(entityBlockData, "farmersdelight:cooking_pot");
        const map: Map<string, number> = new Map();
        const progress: number = entity.getDynamicProperty("farmersdelight:cooking_pot_progress") as number ?? 0
        //热源检测
        const heated = heatCheck(block);
        //配方管理器初始化, 每tick更新一次
        let cookingPotRecipe
        if (!recipeFactory.get(entity.id)) {
            cookingPotRecipe = new CookingPotRecipe(entity, 6, 1, ['cooking_pot'], recipes);
            recipeFactory.set(entity.id, cookingPotRecipe);
        }
        else {
            cookingPotRecipe = recipeFactory.get(entity.id) as CookingPotRecipe;
        }
        entity.setDynamicProperty('cookingPot:heated', heated);
        cookingPotRecipe.update()
        if (heated) {
            arrowheadUtil(entity, fireArrowFull, 10, container);
            if (system.currentTick % 15 == 0) {
                const random = Math.floor(Math.random() * 10);
                block.dimension.spawnParticle(`farmersdelight:steam_${random}`, { x: x, y: y + 1, z: z });
                block.dimension.spawnParticle('farmersdelght:bubble', { x: x, y: y + 0.63, z: z });
            }
            if (system.currentTick % 80 == 0) {
                container?.getItem(6) ? entity.runCommandAsync("playsound block.farmersdelight.cooking_pot.boil_soup @a ~ ~ ~ 1 1") : entity.runCommandAsync("playsound block.farmersdelight.cooking_pot.boil_water @a ~ ~ ~ 1 1");
            }
            const progress = cookingPotRecipe.getProgress()
            if (progress) {
                const num = Math.floor(progress * 10) * 10;
                const arrowhead = new ItemStack(`farmersdelight:cooking_pot_arrow_${num}`);
                arrowheadUtil(entity, arrowhead, 9, container);
            } else {
                arrowheadUtil(entity, emptyArrow, 9, container);
            }
        } else {
            arrowheadUtil(entity, fireArrowEmpty, 10, container);
        }
    }
}