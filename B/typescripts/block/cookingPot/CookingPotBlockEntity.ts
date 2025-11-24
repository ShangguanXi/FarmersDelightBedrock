import {
    Block,
    Container,
    Entity,
    EntityInventoryComponent,
    ItemStack,
    system,
    Vector3,
    world,
} from "@minecraft/server";
import { BlockEntity, BlockEntityData } from "../../lib/BlockEntity";
import { isSamePos } from "../../lib/ObjectUtil";
import { vanillaCookingPotRecipe } from "../../data/recipe/cookingPotRecipe";
import { CookingPotRecipe } from "../../lib/CookingPotRecipe";
import { isHeated } from "../../data/heatBlocks";
import { subscribeEvent } from "../../lib/EventSubscriber";


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

//刷新方块实体状态以及防TP
function blockEntityLoot(args: BlockEntityData, id: string) {
    const cookingPotblock = new ItemStack('farmersdelight:cooking_pot');
    if (!isSamePos(args.entity.location, args.blockEntityDataLocation)) args.entity.teleport(args.blockEntityDataLocation);
    if (args.block?.typeId == id) return;
    
    const inventory = args.entity?.getComponent("inventory") as EntityInventoryComponent;
    const container: Container | undefined  = inventory?.container

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
    @subscribeEvent(world.afterEvents.dataDrivenEntityTrigger, { entityTypes: ["farmersdelight:cooking_pot"], eventTypes: ["farmersdelight:cooking_pot_tick"] })
    tick(args: any) {
        const entityBlockData = super.blockEntityData(args.entity);
        if (!entityBlockData) return;
        const entity: Entity = entityBlockData.entity;
        const { x, y, z }: Vector3 = entity.location;
        const block: Block = entityBlockData.block;
        const inventory = args.entity?.getComponent("inventory") as EntityInventoryComponent;
        const container: Container | undefined  = inventory?.container
        if (!container) return;
        blockEntityLoot(entityBlockData, "farmersdelight:cooking_pot");
        const map: Map<string, number> = new Map();
        const progress: number = entity.getDynamicProperty("farmersdelight:cooking_pot_progress") as number ?? 0
        //热源检测
        const heated = isHeated(block);
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
            arrowheadUtil(entity, new ItemStack("farmersdelight:fire_1"), 10, container);
            if (system.currentTick % 15 == 0) {
                const random = Math.floor(Math.random() * 10);
                block.dimension.spawnParticle(`farmersdelight:steam_${random}`, { x: x, y: y + 1, z: z });
                block.dimension.spawnParticle('farmersdelght:bubble', { x: x, y: y + 0.63, z: z });
            }
            if (system.currentTick % 80 == 0) {
                container?.getItem(6) ? entity.runCommand("playsound block.farmersdelight.cooking_pot.boil_soup @a ~ ~ ~ 1 1") : entity.runCommand("playsound block.farmersdelight.cooking_pot.boil_water @a ~ ~ ~ 1 1");
            }
            const progress = cookingPotRecipe.getProgress()
            if (progress) {
                const num = Math.floor(progress * 10) * 10;
                const arrowhead = new ItemStack(`farmersdelight:cooking_pot_arrow_${num}`);
                arrowheadUtil(entity, arrowhead, 9, container);
            } else {
                arrowheadUtil(entity,  new ItemStack("farmersdelight:cooking_pot_arrow_0"), 9, container);
            }
        } else {
            arrowheadUtil(entity, new ItemStack("farmersdelight:fire_0"), 10, container);
        }
    }
}