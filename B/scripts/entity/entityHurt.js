import { EntityDamageCause, EntityEquippableComponent, EquipmentSlot, world } from "@minecraft/server";

function hurt(args) {
    const entity = args.damageSource.damagingEntity;
    const hurt = args.hurtEntity;
    if (entity?.typeId == 'minecraft:player') {
        const equipment = entity.getComponent(EntityEquippableComponent.componentId);
        const mainHand = equipment.getEquipmentSlot(EquipmentSlot.Mainhand);
        if (mainHand.typeId == 'farmersdelight:skillet_block') {
            hurt.applyDamage(8, { damagingEntity: entity, cause: EntityDamageCause.entityAttack });
        }
    }
}

world.afterEvents.entityHurt.subscribe(hurt);