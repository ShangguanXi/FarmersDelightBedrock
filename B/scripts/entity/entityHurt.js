import { EntityDamageCause, EntityEquippableComponent, EntityHealthComponent, EquipmentSlot, ItemStack, world } from "@minecraft/server";

function hurt(args) {
    const entity = args.damageSource.damagingEntity;
    const hurt = args.hurtEntity;
    const cause = args.damageSource.cause;
    if (entity?.typeId == 'minecraft:player') {
        const equipment = entity.getComponent(EntityEquippableComponent.componentId);
        const mainHand = equipment.getEquipmentSlot(EquipmentSlot.Mainhand);
        if (mainHand.typeId == 'farmersdelight:skillet_block') {
            hurt.applyDamage(8, { damagingEntity: entity, cause: EntityDamageCause.entityAttack });
        }
        if (mainHand.hasTag('farmersdelight:is_knife')) {
            const health = hurt.getComponent(EntityHealthComponent.componentId);
            const random = Math.floor(Math.random() * 10);
            if (!health.currentValue && hurt.typeId === 'minecraft:pig' && random < 5) {
                hurt.dimension.spawnItem(new ItemStack('farmersdelight:ham'), hurt.location);
            }
        }
    }
}

world.afterEvents.entityHurt.subscribe(hurt);