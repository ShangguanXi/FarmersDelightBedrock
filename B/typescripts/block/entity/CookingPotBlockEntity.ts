import { Block, Container, Entity, EntityInventoryComponent, ItemStack, Vector3, system, world } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { BlockEntity } from "./BlockEntity";
import ObjectUtil from "../../lib/ObjectUtil";
import { vanillaCookingPotRecipe } from "../../data/recipe/cookingPotRecipe";
import { CookingPotRecipe } from "../../lib/CookingPotRecipe";


const fireArrowFull: ItemStack = new ItemStack("farmersdelight:fire_1");
const fireArrowEmpty: ItemStack = new ItemStack("farmersdelight:fire_0");
const emptyArrow: ItemStack = new ItemStack("farmersdelight:cooking_pot_arrow_0");
const recipes: any[] = vanillaCookingPotRecipe.recipe;

// 意义不明的进度函数
function arrowheadUtil(entity: Entity, oldItemStack: ItemStack, slot: number, container: Container) {
    if (entity.getDynamicProperty("farmersdelight:not_can_set")) return;
    const itemStack: ItemStack | undefined = container.getItem(slot);
    if (itemStack?.typeId != oldItemStack.typeId) {
        container.setItem(slot, oldItemStack);
    }
}

world.afterEvents.pistonActivate

function blockEntityLoot(args: any, id: string) {
    const cookingPotblock = new ItemStack('farmersdelight:cooking_pot');
    if (!ObjectUtil.isEqual(args.entity.location, args.blockEntityDataLocation)) args.entity.teleport(args.blockEntityDataLocation);
    if (args.block?.typeId == id) return;
    const container: Container | undefined = args.entity.getComponent(EntityInventoryComponent.componentId)?.container;
    const itemStack: ItemStack | undefined = container?.getItem(6);
    if (itemStack) {
        const typeId: string = itemStack.typeId;
        const amount: number = itemStack.amount;
        container?.setItem(6, undefined);
        cookingPotblock.setLore([`§r§f目前的 ${amount} 份食物: ${typeId}`]);
    }
    container?.setItem(9, undefined);
    container?.setItem(10, undefined);
    args.entity.setDynamicProperty("farmersdelight:not_can_set", true);
    args.entity.dimension.spawnItem(cookingPotblock, args.blockEntityDataLocation);
    BlockEntity.clearEntity(args);
}
export class CookingPotBlockEntity extends BlockEntity {
    @methodEventSub(world.afterEvents.dataDrivenEntityTriggerEvent, { entityTypes: ["farmersdelight:cooking_pot"], eventTypes: ["farmersdelight:cooking_pot_tick"] })
    tick(args: any) {
        const entityBlockData = super.blockEntityData(args);
        if (!entityBlockData) return;
        const entity: Entity = entityBlockData.entity;
        const { x, y, z }: Vector3 = entity.location;
        const block: Block = entityBlockData.block;
        const container: Container | undefined = entity.getComponent(EntityInventoryComponent.componentId)?.container;
        if (!container) return;
        blockEntityLoot(entityBlockData, "farmersdelight:cooking_pot");
        const map: Map<string, number> = new Map();
        const progress: number = entity.getDynamicProperty("farmersdelight:cooking_pot_progress") as number ?? 0
        const stove = entity.dimension.getBlock({ x: entity.location.x, y: entity.location.y - 1, z: entity.location.z })?.permutation?.getState("farmersdelight:is_working");
        const cookingPotRecipe = new CookingPotRecipe(container, 6, recipes, map.get("previewRecipe") ?? 0, map.get("previewRecipe2") ?? 0);
        map.set("previewRecipe2", cookingPotRecipe.index2);
        if (cookingPotRecipe.index2 > -1) cookingPotRecipe.output();
        if (stove) {
            arrowheadUtil(entity, fireArrowFull, 10, container);
            map.set("previewRecipe", cookingPotRecipe.index);
            if (system.currentTick % 15 == 0) {
                const random = Math.floor(Math.random() * 10);
                block.dimension.spawnParticle(`farmersdelight:steam_${random}`, { x: x, y: y + 1, z: z });
                block.dimension.spawnParticle('farmersdelght:bubble', { x: x, y: y + 0.63, z: z });
            }
            if (cookingPotRecipe.index > -1 && cookingPotRecipe.itemStackData.length == recipes[cookingPotRecipe.index].ingredients.length && cookingPotRecipe.canRecipe) {
                const cookingTime = recipes[cookingPotRecipe.index].cookingtime;
                const num = Math.floor((progress / cookingTime) * 10) * 10;
                const arrowhead = new ItemStack(`farmersdelight:cooking_pot_arrow_${num}`);
                arrowheadUtil(entity, arrowhead, 9, container);
                if (progress >= cookingTime) {
                    entity.setDynamicProperty("farmersdelight:cooking_pot_progress", 0);
                    cookingPotRecipe.consume();
                } else {
                    entity.setDynamicProperty("farmersdelight:cooking_pot_progress", progress + 1);
                }
            } else {
                entity.setDynamicProperty("farmersdelight:cooking_pot_progress", 0);
                arrowheadUtil(entity, emptyArrow, 9, container);
            }
        } else {
            arrowheadUtil(entity, fireArrowEmpty, 10, container);
        }
    }
}