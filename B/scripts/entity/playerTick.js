import { world, MolangVariableMap, system } from "@minecraft/server";
import { loot, location, getMap } from "../lib/BlockEntity";

const molang = new MolangVariableMap();
// const skilletV2 = [
//     {
//         x: (Math.random() * 2 - 1) * 0.15 * 0.5,
//         z: (Math.random() * 2 - 1) * 0.15 * 0.5
//     },
//     {
//         x: (Math.random() * 2 - 1) * 0.15 * 0.5,
//         z: (Math.random() * 2 - 1) * 0.15 * 0.5
//     },
//     {
//         x: (Math.random() * 2 - 1) * 0.15 * 0.5,
//         z: (Math.random() * 2 - 1) * 0.15 * 0.5
//     },
//     {
//         x: (Math.random() * 2 - 1) * 0.15 * 0.5,
//         z: (Math.random() * 2 - 1) * 0.15 * 0.5
//     },
//     {
//         x: (Math.random() * 2 - 1) * 0.15 * 0.5,
//         z: (Math.random() * 2 - 1) * 0.15 * 0.5
//     }
// ]

const skilletV2 = [];
for (let i = 0; i < 5; i++) {
    const json = {};
    json.x = (Math.random() * 2 - 1) * 0.15 * 0.5;
    json.z = (Math.random() * 2 - 1) * 0.15 * 0.5;
    skilletV2.push(json);
}


function blockTick(dimension) {
    // console.warn(currentTick % 20);
    const worldEntities = dimension.getEntities({ families: ['farmersdelight_tick_block_entity'] });
    for (const entity of worldEntities) {
        const currentTick = system.currentTick % 20;
        const entityDimension = entity.dimension
        // entity.triggerEvent('farmersdelight:despawn');
        const block = entityDimension.getBlock(entity.location);
        const stove = entityDimension.getBlock({ x: entity.location.x, y: entity.location.y - 1, z: entity.location.z })?.permutation?.getState('farmersdelight:is_working');
        switch (entity.typeId) {
            case 'farmersdelight:cutting_board':
                if (block) {
                    const itemStack = getMap(entity, 'item')?.get('item');
                    const blockLocation = location(entity);
                    const oldBlock = entityDimension.getBlock(blockLocation);
                    if (itemStack) {
                        const id = itemStack.split(':');
                        const name = id[0] == 'minecraft' ? `farmersdelight:${id[0]}_${id[1]}` : itemStack;
                        entityDimension.spawnParticle(name, { x: blockLocation.x + 0.5, y: blockLocation.y + 0.07, z: blockLocation.z + 0.5 }, molang);
                    }
                    loot(itemStack, oldBlock.typeId, entity, blockLocation, 'farmersdelight:cutting_board');

                }
                break;
            case 'farmersdelight:skillet':
                if (block) {
                    const inventory = getMap(entity, 'nbt').get('nbt');
                    console.warn(entity.getTags());
                    const itemStack = inventory.item;
                    const amount = inventory.amount;
                    const blockLocation = location(entity);
                    const oldBlock = entityDimension.getBlock(blockLocation);
                    if (itemStack) {
                        let particleCount = 1;
                        if (amount > 48) {
                            particleCount = 5;
                        } else if (amount > 32) {
                            particleCount = 4;
                        } else if (amount > 16) {
                            particleCount = 3;
                        } else if (amount > 1) {
                            particleCount = 2;
                        }
                        const id = itemStack.split(':');
                        const name = id[0] == 'minecraft' ? `farmersdelight:${id[0]}_${id[1]}` : itemStack;
                        for (let index = 0; index < particleCount; index++) {
                            entityDimension.spawnParticle(name, { x: blockLocation.x + 0.5 + skilletV2[index].x, y: blockLocation.y + 0.07 + 0.03 * (index + 1), z: blockLocation.z + 0.5 + skilletV2[index].z }, molang);
                        }
                        if (stove) {
                            const recipes = inventory.inventory;
                            recipes.forEach((cook, index) => {
                                entity.removeTag(`{"nbt":${JSON.stringify(inventory)}}`);
                                const cooking = JSON.parse(cook);
                                const cookTime = cooking.cookTime - (!currentTick ? 1 : 0);
                                recipes[index] = `{"number" : ${cooking.number},"cookTime":${cookTime}}`;
                                entity.addTag(`{"nbt":${JSON.stringify(inventory)}}`);
                                if (!cooking.cookTime) {
                                    for (let j = 0; j < cooking.number; j++) {
                                        entity.runCommandAsync(`loot spawn ${entity.location.x + 0.5} ${entity.location.y + 0.4} ${entity.location.z + 0.5} loot "farmersdelight/cook/farmersdelight_cook_${id[1]}"`);
                                    }
                                    inventory.amount -= cooking.number;
                                    recipes.shift();
                                    entity.removeTag(`{"nbt":${JSON.stringify(inventory)}}`);
                                    entity.addTag(`{"nbt":${JSON.stringify(inventory)}}`);
                                }
                            });
                            if (!recipes.length) {
                                entity.removeTag(`{"nbt":${JSON.stringify(inventory)}}`);
                                entity.addTag('{"nbt":{"item":"undefined","amount":0,"inventory":[]}}');
                            }
                        }
                    }
                    loot(itemStack, oldBlock.typeId, entity, blockLocation, 'farmersdelight:skillet_block', amount);
                }
                break;
        }
    }
}

function rope(player) {
    const rope = player.dimension.getBlock(player.location).typeId === 'farmersdelight:rope';
    const RY = player.getRotation().y;
    if (rope) {
        // player.addEffect('levitation', 2, { amplifier: 10, showParticles: false });
        // player.applyImpulse({ x: location.x, y: location.y += 1, z: location.z });
        if (RY <= -20) {
            player.addEffect('levitation', 2, { amplifier: 10, showParticles: false });
        }
        if (RY >= 20) {
            player.addEffect('slow_falling', 2, { amplifier: 10, showParticles: false });
        }

    }
    console.warn(player.getRotation().x, player.getRotation().y);
}

system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        // block tick
        blockTick(player.dimension);
        // rope(player);
    }
})
