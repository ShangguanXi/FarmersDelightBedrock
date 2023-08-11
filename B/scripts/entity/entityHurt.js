import { world } from "@minecraft/server";

// let a = world.scoreboard;
// a.addObjective('test','test')
// let b = a.getObjective('test');
// let str = '{"type":"farmersdelight:cooking","container":{ "item": "minecraft:bowl" }, "cookingtime": 200, "experience": 1.0, "ingredients": [{ "item": "minecraft:baked_potato" }, { "item": "minecraft:rabbit"},{"item": "minecraft:carrot"},[ { "item": "minecraft:brown_mushroom"},{"item": "minecraft:red_mushroom"}]], "recipe_book_tab": "meals", "result": { "item": "minecraft:rabbit_stew" }}'
// for (let index = 0; index < 114514; index++) {
//     b.setScore(str + index, 0);
// }
// console.warn(str.length);
// b.setScore('{"type":"farmersdelight:cooking","container":{ "item": "minecraft:bowl" }, "cookingtime": 200, "experience": 1.0, "ingredients": [{ "item": "minecraft:baked_potato" }, { "item": "minecraft:rabbit"},{"item": "minecraft:carrot"},[ { "item": "minecraft:brown_mushroom"},{"item": "minecraft:red_mushroom"}]], "recipe_book_tab": "meals", "result": { "item": "minecraft:rabbit_stew" }}', 0);

function hurt(args) {
    const entity = args.damageSource.damagingEntity;
    const hurt = args.hurtEntity;
    if (entity?.typeId == 'minecraft:player') {
        const equipment = entity.getComponent('equipment_inventory');
        const mainHand = equipment.getEquipmentSlot('mainhand');
        if (mainHand.typeId == 'farmersdelight:skillet_block') {
            hurt.runCommandAsync(`damage @s 8 entity_attack entity ${entity.nameTag}`);
        }
    }
}

world.afterEvents.entityHurt.subscribe(hurt);