import { ItemStack, system, world } from "@minecraft/server";
import { BlockEntity } from "../../lib/BlockEntity";
import { isHeated } from "../../data/Heaters";
import { CookableComponentParams } from "../../customComponents/item/CookableComponent";
import { subscribeEvent } from "../../lib/EventSubscriber";

const skilletV2: any[] = [];
for (let i = 0; i < 5; i++) {
  const json: any = {};
  json.x = (Math.random() * 2 - 1) * 0.15 * 0.5;
  json.z = (Math.random() * 2 - 1) * 0.15 * 0.5;
  skilletV2.push(json);
}

//检查热源
export class SkilletEntity extends BlockEntity {
  @subscribeEvent(world.afterEvents.dataDrivenEntityTrigger, { entityTypes: ["farmersdelight:skillet"], eventTypes: ["farmersdelight:skillet_tick"] })
  tick(args: any) {
    const entityBlockData = super.blockEntityData(args.entity);
    if (!entityBlockData) return;
    const entity = entityBlockData.entity;
    const { x, y, z } = entity.location;
    const itemId = entity.getDynamicProperty("farmersdelight:item") as string;
    let totalAmount = entity.getDynamicProperty("farmersdelight:amount") as number;
    let canAddAmount = entity.getDynamicProperty("farmersdelight:canAdd") as number;
    super.blockEntityLoot(entityBlockData, "farmersdelight:skillet_block", itemId == "undefined" ? undefined : [itemId], totalAmount);
    const name: string[] = itemId.split(':');
    const dimension = entity.dimension
    const particleName: string = name[0] == 'minecraft' ? `farmersdelight:${name[0]}_skillet_${name[1]}` : `${name[0]}:skillet_${name[1]}`;
    const count = entity.getDynamicProperty("farmersdelight:amount") as number || 0;
    let particleCount = count > 48 ? 5 : (count > 32 ? 4 : (count > 16 ? 3 : (count > 1 ? 2 : count == 1 ? 1 : 0)));
    for (let index = 0; index < particleCount; index++) {
      dimension.spawnParticle(particleName, { x: x + skilletV2[index].x, y: y + 0.07 + 0.03 * (index + 1), z: z + skilletV2[index].z });
    }
    // 烹饪
      if (!isHeated(entityBlockData.block)) return;
    const cookDataProperty = entity.getDynamicProperty("farmersdelight:cookData") as string || "{}"
    if (cookDataProperty == "{}") return
    let cookData = JSON.parse(cookDataProperty);
    if (cookData.datas.length == 0) return
    if (system.currentTick % 80 == 0) entity.dimension.playSound("block.farmersdelight.skillet.sizzle",entity.location);
    if (system.currentTick % 4 == 0) {
      const random = Math.floor(Math.random() * 10);
      entity.dimension.spawnParticle(`farmersdelight:skillet_steam_${random}`, { x: x, y: y + 0.25, z: z });
  };
    for (let i = cookData.datas.length - 1; i >= 0; i--) {
      if (cookData.datas[i].time > 0) {
        cookData.datas[i].time -= 1
      }
      if (cookData.datas[i].time == 0) {
          if (itemId.startsWith("minecraft:")) {
              const path = itemId.substring(10);
              for (let a = 0; a <= cookData.datas[i].count; a++) {
                  entity.runCommand(`loot spawn ${x} ${y + 0.4} ${z} loot "minecraft/cook/${path}"`);
              }
          } else {
              const cookable = (new ItemStack(itemId)).getComponent("farmersdelight:cookable")?.customComponentParameters.params as CookableComponentParams;
              dimension.spawnItem(new ItemStack(cookable.result, cookData.datas[i].count), { x, y: y + 0.4, z });
          }
          entity.setDynamicProperty("farmersdelight:amount", totalAmount - cookData.datas[i].count);
          entity.setDynamicProperty("farmersdelight:canAdd", canAddAmount + cookData.datas[i].count);
          cookData.datas.splice(i, 1);
      }
    }
    if (cookData.datas.length == 0) entity.setDynamicProperty("farmersdelight:item", "undefined");
    entity.setDynamicProperty("farmersdelight:cookData", JSON.stringify(cookData));
  }
}
