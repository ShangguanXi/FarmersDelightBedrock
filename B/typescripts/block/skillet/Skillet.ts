import {
    EntityInventoryComponent,
    ItemStack,
    PlayerInteractWithBlockAfterEvent,
    PlayerPlaceBlockAfterEvent,
    world,
} from "@minecraft/server";
import { BlockWithEntity } from "../../lib/BlockWithEntity";
import { vanillaItemList, findCookingRecipe, isCookable } from "../../data/recipe/cookRecipe";
import { hasLimitedMaterials } from "../../lib/EntityUtil";
import { takeItem } from "../../lib/ItemUtil";

import { isHeated } from "../../data/Heaters";
import { subscribeEvent } from "../../lib/EventSubscriber";

export class Skillet extends BlockWithEntity {
  @subscribeEvent(world.afterEvents.playerPlaceBlock)
  placeBlock(args: PlayerPlaceBlockAfterEvent) {
    const block = args.block;
    if (block.typeId !== "farmersdelight:skillet_block") return;

    const pos = block.location;
    const entity = super.setBlock(args.block.dimension, { x: pos.x + 0.5, y: pos.y, z: pos.z + 0.5 }, "farmersdelight:skillet");

    entity.setDynamicProperty("farmersdelight:item", "undefined");
    entity.setDynamicProperty("farmersdelight:amount", 0);
    entity.setDynamicProperty("farmersdelight:canAdd", 64);
    entity.setDynamicProperty("farmersdelight:cookData", "{}");
  }

  @subscribeEvent(world.afterEvents.playerInteractWithBlock)
  useOnBlock(args: PlayerInteractWithBlockAfterEvent) {
    if (args?.block?.typeId !== "farmersdelight:skillet_block") return;

    const data = super.entityBlockData(args.block, {
      type: "farmersdelight:skillet",
      location: args.block.location
    });

    if (!data) return
    const player = args.player;
    const itemStack = args.itemStack;

    const entity = data.entity;
    let currentItem = entity.getDynamicProperty("farmersdelight:item") as string;
    let totalAmount = entity.getDynamicProperty("farmersdelight:amount") as number;
    let canAddAmount = entity.getDynamicProperty("farmersdelight:canAdd") as number;
    let cookData = JSON.parse(entity.getDynamicProperty("farmersdelight:cookData") as string || "{}");


    const inventory = player.getComponent("inventory") as EntityInventoryComponent;
    const container = inventory?.container;
    if (!container) return;
    if (!itemStack) {
      if (currentItem == "undefined") return
      for (const item of cookData.datas) {
        entity.dimension.spawnItem(new ItemStack(currentItem, item.count), entity.location)
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
      }

      else if (itemId == currentItem) {
        if (canAddAmount - amount >= 0) {
          cookData.datas.push({ count: amount, time: time });
          entity.setDynamicProperty("farmersdelight:canAdd", canAddAmount - amount);
          entity.setDynamicProperty("farmersdelight:cookData", JSON.stringify(cookData));
          entity.setDynamicProperty("farmersdelight:amount", totalAmount+amount);

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
        entity.dimension.playSound("block.farmersdelight.skillet.add_food",entity.location);
      }
    } 
    else {
      player.onScreenDisplay.setActionBar({ translate: "farmersdelight.skillet.invalid_item" });
    }
  }
}