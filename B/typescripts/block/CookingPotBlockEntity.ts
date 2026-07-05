import {
    Block,
    Container,
    Entity,
    EntityInventoryComponent,
    ItemStack,
    PlayerInteractWithBlockBeforeEvent,
    PlayerPlaceBlockAfterEvent,
    system,
    world,
} from "@minecraft/server";
import { attachedBlockEntity, subscribeEvent } from "../lib/EventSubscriber";
import { getBlockEntity } from "../lib/BlockWithEntity";
import { vanillaCookingPotRecipe } from "../data/recipe/cookingPotRecipe";
import { CookingPotRecipe } from "../lib/CookingPotRecipe";
import { isHeated } from "../data/Heaters";

const recipes: any[] = vanillaCookingPotRecipe.recipe;
const recipeFactory: Map<string, CookingPotRecipe> = new Map();

//potItem用于放置厨锅时暂时存储厨锅物品数据，方便读取lore
//别问我为啥不写类里面，因为写类里面的时候在constructor里还是正常的map，一到事件里就莫名其妙变成了undefined，ts也没报错，查不出来原因
const potItem = new Map();

//意义不明的进度函数
function arrowheadUtil(entity: Entity, oldItemStack: ItemStack, slot: number, container: Container) {
    if (entity.getDynamicProperty("farmersdelight:not_can_set")) return;
    const itemStack: ItemStack | undefined = container.getItem(slot);
    if (itemStack?.typeId != oldItemStack.typeId) {
        container.setItem(slot, oldItemStack);
    }
}

@attachedBlockEntity({ eventTypes: ["farmersdelight:cooking_pot_tick"] })
export class CookingPotBlockEntity {
    //方块被破坏/替换时：掉落食材，把成品食物封装进带 lore 的厨锅物品
    static onDiscard(entity: Entity): undefined {
        const cookingPotblock = new ItemStack('farmersdelight:cooking_pot');
        const inventory = entity.getComponent("inventory") as EntityInventoryComponent;
        const container: Container | undefined = inventory?.container;
        if (!container) return;

        for (let slot = 0; slot < 9; slot++) {
            const itemStack: ItemStack | undefined = container.getItem(slot);
            if (slot != 6 && slot != 8 && itemStack) {
                entity.dimension.spawnItem(itemStack, entity.location);
            }
            if (slot == 6) {
                if (itemStack) {
                    const typeId: string = itemStack.typeId;
                    const amount: number = itemStack.amount;
                    container.setItem(6, undefined);
                    cookingPotblock.setLore([`§r§f${amount} 份食物: ${typeId}`]);
                }
                container.setItem(9, undefined);
                container.setItem(10, undefined);
                entity.setDynamicProperty("farmersdelight:not_can_set", true);
                entity.dimension.spawnItem(cookingPotblock, entity.location);
            }
            if (slot == 8) {
                if (itemStack) {
                    entity.dimension.spawnItem(itemStack, entity.location);
                }
            }
        }
        recipeFactory.delete(entity.id);
    }

    static onTick(entity: Entity, block: Block) {
        const { x, y, z }: { x: number; y: number; z: number } = entity.location;
        const inventory = entity.getComponent("inventory") as EntityInventoryComponent;
        const container: Container | undefined = inventory?.container;
        if (!container) return;
        //热源检测
        const heated = isHeated(block);
        //配方管理器初始化, 每tick更新一次
        let cookingPotRecipe: CookingPotRecipe;
        if (!recipeFactory.get(entity.id)) {
            cookingPotRecipe = new CookingPotRecipe(entity, 6, 1, ['cooking_pot'], recipes);
            recipeFactory.set(entity.id, cookingPotRecipe);
        } else {
            cookingPotRecipe = recipeFactory.get(entity.id) as CookingPotRecipe;
        }

        entity.setDynamicProperty('cookingPot:heated', heated);
        cookingPotRecipe.update();
        if (heated) {
            arrowheadUtil(entity, new ItemStack("farmersdelight:fire_1"), 10, container);
            if (system.currentTick % 15 == 0) {
                const random = Math.floor(Math.random() * 10);
                block.dimension.spawnParticle(`farmersdelight:steam_${random}`, { x: x, y: y + 1, z: z });
                block.dimension.spawnParticle('farmersdelght:bubble', { x: x, y: y + 0.63, z: z });
            }
            if (system.currentTick % 80 == 0) {
                container.getItem(6) ? entity.runCommand("playsound block.farmersdelight.cooking_pot.boil_soup @a ~ ~ ~ 1 1") : entity.runCommand("playsound block.farmersdelight.cooking_pot.boil_water @a ~ ~ ~ 1 1");
            }
            const progress = cookingPotRecipe.getProgress();
            if (progress) {
                const num = Math.floor(progress * 10) * 10;
                const arrowhead = new ItemStack(`farmersdelight:cooking_pot_arrow_${num}`);
                arrowheadUtil(entity, arrowhead, 9, container);
            } else {
                arrowheadUtil(entity, new ItemStack("farmersdelight:cooking_pot_arrow_0"), 9, container);
            }
        } else {
            arrowheadUtil(entity, new ItemStack("farmersdelight:fire_0"), 10, container);
        }
    }

    //放置前暂存手持物品，便于放置时读取lore
    @subscribeEvent(world.beforeEvents.playerInteractWithBlock)
    static stashItem(args: PlayerInteractWithBlockBeforeEvent) {
        potItem.set(args.player.id, args.itemStack);
    }

    @subscribeEvent(world.afterEvents.playerPlaceBlock)
    static onPlace(args: PlayerPlaceBlockAfterEvent) {
        const itemStack = potItem.get(args.player.id) as ItemStack;
        const block: Block = args.block;
        if (block.typeId != "farmersdelight:cooking_pot") return;
        const lores: string[] = itemStack?.getLore() ?? [];
        const entity = getBlockEntity(block);
        if (!entity) return;
        const inventory = entity.getComponent("inventory") as EntityInventoryComponent;
        const container = inventory?.container;
        if (!container || !lores.length) return;
        for (const lore of lores) {
            const data: RegExpMatchArray | null = lore.match(/\d+|\S+:\S+/g);
            if (!data) continue;
            const slot = container.getSlot(6);
            const cookingItemStack = new ItemStack(data[1]);
            cookingItemStack.amount = parseInt(data[0]);
            slot.setItem(cookingItemStack);
        }
    }

    @subscribeEvent(world.beforeEvents.playerBreakBlock, { blockTypes: ["farmersdelight:cooking_pot"] })
    static onBreak(args: any) {
        const block: Block = args.block;
        const location = block.location;
        args.cancel = true;
        system.run(() => {
            block.dimension.setBlockType(location, "minecraft:air");
        });
    }
}
