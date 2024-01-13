import { Container, Entity, EntityInventoryComponent, ItemStack, world } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { BlockEntity } from "./BlockEntity";


const emptyArrow = new ItemStack("farmersdelight:cooking_pot_arrow_0");
// 意义不明的进度函数
function arrowheadUtil(oldItemStack: ItemStack, slot: number, container: Container) {
    const itemStack: ItemStack | undefined = container.getItem(slot);
    if (itemStack?.typeId != oldItemStack.typeId) {
        container.setItem(slot, oldItemStack);
    }
}
export class CookingPotBlockEntity extends BlockEntity {
    @methodEventSub(world.afterEvents.dataDrivenEntityTriggerEvent, { entityTypes: ["farmersdelight:cooking_pot"], eventTypes: ["farmersdelight:cooking_pot_tick"] })
    tick(args: any) {
        const entityBlockData = super.blockEntityData(args);
        if (!entityBlockData) return;
        const entity: Entity = entityBlockData.entity;
        const container: Container | undefined = entity.getComponent(EntityInventoryComponent.componentId)?.container;
        if (!container) return;
        arrowheadUtil(emptyArrow, 9, container);
        super.blockEntityLoot(entityBlockData, "farmersdelight:cooking_pot", []);
    }
}