import { ContainerSlot, Entity, EntityEquippableComponent, EntityHealthComponent, EquipmentSlot, ItemStack, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";


export class Knife {
    @methodEventSub(world.afterEvents.entityHurt)
    hurt(args: any) {
        const entity: Entity = args.damageSource.damagingEntity;
        const hurt: Entity = args.hurtEntity;
        if (!entity || !hurt) return
        const equipment: EntityEquippableComponent | undefined = entity.getComponent(EntityEquippableComponent.componentId);
        const mainHand: ContainerSlot | undefined = equipment?.getEquipmentSlot(EquipmentSlot.Mainhand);
        if (!mainHand?.hasTag('farmersdelight:is_knife')) return;
        const health: EntityHealthComponent | undefined = hurt.getComponent(EntityHealthComponent.componentId);
        const random = Math.floor(Math.random() * 10);
        if (!health?.currentValue && hurt.typeId === 'minecraft:pig' && random < 5) {
            hurt.dimension.spawnItem(new ItemStack('farmersdelight:ham'), hurt.location);
        }
    }
}