import { Block, Container, ContainerSlot, Dimension, Entity, EntityDamageCause, EntityEquippableComponent, EntityInventoryComponent, EquipmentSlot, ItemStack, Player, PlayerInteractWithBlockAfterEvent, PlayerPlaceBlockAfterEvent, ScoreboardObjective, ScoreboardScoreInfo, Vector3, world } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { BlockWithEntity } from "../../lib/BlockWithEntity";
import { vanillaItemList } from "../../data/recipe/cookRecipe";
import { EntityUtil } from "../../lib/EntityUtil";
import { ItemUtil } from "../../lib/ItemUtil";
import { BlockEntity } from "../../lib/BlockEntity";

import { heatConductors, heatSources } from "../../data/heatBlocks";
import { CookableComonentRegister, CookableComponentParams } from "../../customComponents/item/CookableComonent";

export class Skillet extends BlockWithEntity {
  @methodEventSub(world.afterEvents.playerPlaceBlock)
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

  @methodEventSub(world.afterEvents.playerInteractWithBlock)
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
    const cookable  = itemStack.getComponent("farmersdelight:cookable")
    if (vanillaItemList.includes(itemId) || cookable) {
      const time = cookable? ((cookable.customComponentParameters.params as CookableComponentParams).time? (cookable.customComponentParameters.params as CookableComponentParams).time : 200):200
      if (currentItem == "undefined") {
        entity.setDynamicProperty("farmersdelight:item", itemId);
        entity.setDynamicProperty("farmersdelight:canAdd", itemStack.maxAmount - amount);
        entity.setDynamicProperty("farmersdelight:amount", amount);
        entity.setDynamicProperty("farmersdelight:cookData", JSON.stringify({ datas: [{ count: amount, time: time }] }));
        if (EntityUtil.gameMode(player)) ItemUtil.clearItem(container, player.selectedSlotIndex, amount);
      }

      else if (itemId == currentItem) {
        if (canAddAmount - amount >= 0) {
          cookData.datas.push({ count: amount, time: time });
          entity.setDynamicProperty("farmersdelight:canAdd", canAddAmount - amount);
          entity.setDynamicProperty("farmersdelight:cookData", JSON.stringify(cookData));
          entity.setDynamicProperty("farmersdelight:amount", totalAmount+amount);

          if (EntityUtil.gameMode(player)) ItemUtil.clearItem(container, player.selectedSlotIndex, amount);
        }
        if (canAddAmount - amount < 0 && canAddAmount != 0) {
          cookData.datas.push({ count: canAddAmount, time: time });
          entity.setDynamicProperty("farmersdelight:canAdd", 0);
          entity.setDynamicProperty("farmersdelight:amount", 64);
          entity.setDynamicProperty("farmersdelight:cookData", JSON.stringify(cookData));
          if (EntityUtil.gameMode(player)) ItemUtil.clearItem(container, player.selectedSlotIndex, canAddAmount);
        }
      }
      
      if (Skillet.heatCheck(args.block) && canAddAmount > 0) {
        entity.runCommand("playsound block.farmersdelight.skillet.add_food @a ~ ~ ~ 1 1");
      }
    } else {
      player.onScreenDisplay.setActionBar({ translate: "farmersdelight.skillet.invalid_item" });
    }
  }


  static heatCheck(block: Block) {
    const blockBelow = block.below()
    if (heatSources.includes(blockBelow?.typeId as string) || blockBelow?.hasTag('farmersdelight:heat_source')) return true
    if (heatConductors.includes(blockBelow?.typeId as string) || blockBelow?.hasTag('farmersdelight:heat_conductors')) {
      const blockBelow2 = block.below(2)
      if (heatSources.includes(blockBelow2?.typeId as string) || blockBelow2?.hasTag('farmersdelight:heat_source')) return true
    }
    return false
  }
}