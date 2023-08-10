import { world } from "@minecraft/server";


function hurt(args) {
    const entity = args.damageSource.damagingEntity;
    const hurt = args.hurtEntity;
    if (entity.typeId == 'minecraft:player') {
        const equipment = entity.getComponent('equipment_inventory');
        const mainHand = equipment.getEquipmentSlot('mainhand');
        if (mainHand.typeId == 'farmersdelight:skillet_block') {
            hurt.runCommandAsync(`damage @s 8 entity_attack entity ${entity.nameTag}`);
        }
    }
}

world.afterEvents.entityHurt.subscribe(hurt);