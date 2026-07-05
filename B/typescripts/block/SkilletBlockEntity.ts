import {
    Block,
    Entity,
    EntityInventoryComponent,
    ItemStack,
    PlayerInteractWithBlockAfterEvent,
    system,
    world,
} from "@minecraft/server";
import { attachedBlockEntity, subscribeEvent } from "../lib/EventSubscriber";
import { getBlockEntity } from "../lib/BlockWithEntity";
import { hasLimitedMaterials } from "../lib/EntityUtil";
import { takeItem } from "../lib/ItemUtil";
import { isHeated } from "../data/Heaters";
import { findCookingRecipe } from "../data/recipe/cookRecipe";

const skilletV2: any[] = [];
for (let i = 0; i < 5; i++) {
    const json: any = {};
    json.x = (Math.random() * 2 - 1) * 0.15 * 0.5;
    json.z = (Math.random() * 2 - 1) * 0.15 * 0.5;
    skilletV2.push(json);
}

@attachedBlockEntity({ eventTypes: ["farmersdelight:skillet_tick"] })
export class SkilletBlockEntity {
    //方块被破坏/替换时，掉落正在烹饪的物品（动态属性存储，无容器）
    static onDiscard(entity: Entity): undefined {
        const item = entity.getDynamicProperty("farmersdelight:item") as string;
        const amount = entity.getDynamicProperty("farmersdelight:amount") as number;
        if (item && item !== "undefined" && amount && amount > 0) {
            entity.dimension.spawnItem(new ItemStack(item, amount), entity.location);
        }
    }

    static onTick(entity: Entity, block: Block) {
        const { x, y, z } = entity.location;
        const itemId = (entity.getDynamicProperty("farmersdelight:item") as string) ?? "undefined";
        let totalAmount = (entity.getDynamicProperty("farmersdelight:amount") as number) ?? 0;
        let canAddAmount = (entity.getDynamicProperty("farmersdelight:canAdd") as number) ?? 64;
        const name: string[] = itemId.split(':');
        const dimension = entity.dimension;
        const particleName: string = name[0] == 'minecraft' ? `farmersdelight:${name[0]}_skillet_${name[1]}` : `${name[0]}:skillet_${name[1]}`;
        const count = (entity.getDynamicProperty("farmersdelight:amount") as number) || 0;
        const particleCount = count > 48 ? 5 : (count > 32 ? 4 : (count > 16 ? 3 : (count > 1 ? 2 : count == 1 ? 1 : 0)));
        for (let index = 0; index < particleCount; index++) {
            dimension.spawnParticle(particleName, { x: x + skilletV2[index].x, y: y + 0.07 + 0.03 * (index + 1), z: z + skilletV2[index].z });
        }
        // 烹饪
        if (!isHeated(block)) return;
        const cookDataProperty = (entity.getDynamicProperty("farmersdelight:cookData") as string) || "{}";
        if (cookDataProperty == "{}") return;
        const cookData = JSON.parse(cookDataProperty);
        if (cookData.datas.length == 0) return;
        if (system.currentTick % 80 == 0) entity.dimension.playSound("block.farmersdelight.skillet.sizzle", entity.location);
        if (system.currentTick % 4 == 0) {
            const random = Math.floor(Math.random() * 10);
            entity.dimension.spawnParticle(`farmersdelight:skillet_steam_${random}`, { x: x, y: y + 0.25, z: z });
        }
        for (let i = cookData.datas.length - 1; i >= 0; i--) {
            if (cookData.datas[i].time > 0) {
                cookData.datas[i].time -= 1;
            }
            if (cookData.datas[i].time == 0) {
                const recipe = findCookingRecipe(new ItemStack(itemId));
                if (recipe) {
                    const resultCount = recipe.count ? recipe.count : 1;
                    dimension.spawnItem(new ItemStack(recipe.result, resultCount), { x, y: y + 0.4, z });
                }
                totalAmount -= 1;
                canAddAmount += 1;
                entity.setDynamicProperty("farmersdelight:amount", totalAmount);
                entity.setDynamicProperty("farmersdelight:canAdd", canAddAmount);
                cookData.datas[i].count -= 1;
                if (cookData.datas[i].count <= 0) {
                    cookData.datas.splice(i, 1);
                } else {
                    // 重置计时器，继续烧下一个
                    cookData.datas[i].time = recipe ? recipe.time : 200;
                }
            }
        }
        if (cookData.datas.length == 0) entity.setDynamicProperty("farmersdelight:item", "undefined");
        entity.setDynamicProperty("farmersdelight:cookData", JSON.stringify(cookData));
    }

    @subscribeEvent(world.afterEvents.playerInteractWithBlock)
    static onInteract(args: PlayerInteractWithBlockAfterEvent) {
        if (args?.block?.typeId !== "farmersdelight:skillet_block") return;

        const entity = getBlockEntity(args.block);
        if (!entity) return;
        const player = args.player;
        const itemStack = args.itemStack;
        let currentItem = (entity.getDynamicProperty("farmersdelight:item") as string) ?? "undefined";
        let totalAmount = (entity.getDynamicProperty("farmersdelight:amount") as number) ?? 0;
        let canAddAmount = (entity.getDynamicProperty("farmersdelight:canAdd") as number) ?? 64;
        const cookData = JSON.parse((entity.getDynamicProperty("farmersdelight:cookData") as string) || "{}");

        const inventory = player.getComponent("inventory") as EntityInventoryComponent;
        const container = inventory?.container;
        if (!container) return;
        if (!itemStack) {
            if (currentItem == "undefined") return;
            for (const item of cookData.datas) {
                entity.dimension.spawnItem(new ItemStack(currentItem, item.count), entity.location);
            }
            entity.setDynamicProperty("farmersdelight:item", "undefined");
            entity.setDynamicProperty("farmersdelight:amount", 0);
            entity.setDynamicProperty("farmersdelight:canAdd", 64);
            entity.setDynamicProperty("farmersdelight:cookData", "{}");
            return;
        }
        const itemId = itemStack.typeId;
        const amount = itemStack.amount;
        const recipe = findCookingRecipe(itemStack);
        if (recipe) {
            const time = recipe.time ?? 200;
            if (currentItem == "undefined") {
                entity.setDynamicProperty("farmersdelight:item", itemId);
                entity.setDynamicProperty("farmersdelight:canAdd", itemStack.maxAmount - amount);
                entity.setDynamicProperty("farmersdelight:amount", amount);
                entity.setDynamicProperty("farmersdelight:cookData", JSON.stringify({ datas: [{ count: amount, time: time }] }));
                if (hasLimitedMaterials(player)) takeItem(container, player.selectedSlotIndex, amount);
            } else if (itemId == currentItem) {
                if (canAddAmount - amount >= 0) {
                    cookData.datas.push({ count: amount, time: time });
                    entity.setDynamicProperty("farmersdelight:canAdd", canAddAmount - amount);
                    entity.setDynamicProperty("farmersdelight:cookData", JSON.stringify(cookData));
                    entity.setDynamicProperty("farmersdelight:amount", totalAmount + amount);
                    if (hasLimitedMaterials(player)) takeItem(container, player.selectedSlotIndex, amount);
                }
                if (canAddAmount - amount < 0 && canAddAmount != 0) {
                    cookData.datas.push({ count: canAddAmount, time: time });
                    entity.setDynamicProperty("farmersdelight:canAdd", 0);
                    entity.setDynamicProperty("farmersdelight:amount", 64);
                    entity.setDynamicProperty("farmersdelight:cookData", JSON.stringify(cookData));
                    if (hasLimitedMaterials(player)) takeItem(container, player.selectedSlotIndex, canAddAmount);
                }
            }
            if (isHeated(args.block) && canAddAmount > 0) {
                entity.dimension.playSound("block.farmersdelight.skillet.add_food", entity.location);
            }
        } else {
            player.onScreenDisplay.setActionBar({ translate: "farmersdelight.skillet.invalid_item" });
        }
    }
}
