import { world, MolangVariableMap, system, ItemStack } from "@minecraft/server";
import { loot, location, getMap } from "../lib/BlockEntity";
import { vanillaCookingPotRecipe } from "../data/recipe/cookingPotRecipe";
import { RecipeHolder } from "../lib/RecipeHolder";

const molang = new MolangVariableMap();
const scoreboard = world.scoreboard;

const skilletV2 = [];
for (let i = 0; i < 5; i++) {
    const json = {};
    json.x = (Math.random() * 2 - 1) * 0.15 * 0.5;
    json.z = (Math.random() * 2 - 1) * 0.15 * 0.5;
    skilletV2.push(json);
}

const xOffset = 0.3;
const yOffset = 0.2;
const stoveOffsets = [
    {
        x: xOffset,
        y: yOffset
    },
    {
        x: 0,
        y: yOffset
    },
    {
        x: -xOffset,
        y: yOffset
    },
    {
        x: xOffset,
        y: -yOffset
    },
    {
        x: 0,
        y: -yOffset
    }
    , {
        x: -xOffset,
        y: -yOffset
    }
];

function itemStackArr(scores) {
    let arr = [];
    for (const itemStackData of scores) {
        const itemStack = itemStackData.participant.displayName;
        if (itemStack != 'amount') {
            const id = itemStack.split('/');
            arr.push(id[0]);
        }
    }
    return arr;
}

function potLoot(container, block, entity, blockLocation, id) {
    const cookingPotblock = new ItemStack('farmersdelight:cooking_pot');
    if (block) {
        if (JSON.stringify(entity.location) !== JSON.stringify(blockLocation)) {
            entity.teleport(blockLocation);
        }
    }
    if (block != id) {
        const itemStack = container.getItem(6);
        if (itemStack) {
            const typeId = itemStack.typeId;
            const amount = itemStack.amount;
            container.setItem(6, null);
            cookingPotblock.setLore([`§r§f目前的 ${amount} 份食物: ${typeId}`]);
        }
        entity.dimension.spawnItem(cookingPotblock, blockLocation);
        entity.triggerEvent('farmersdelight:despawn');
    }
}

function blockTick(dimension) {
    const worldEntities = dimension.getEntities({ families: ['farmersdelight_tick_block_entity'] });
    for (const entity of worldEntities) {
        const currentTick = system.currentTick % 20;
        const entityDimension = entity.dimension
        const data = scoreboard.getObjective(entity.id);
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
                        if (!currentTick % 20) entityDimension.spawnParticle(name, blockLocation, molang);
                    }
                    loot(itemStack, oldBlock.typeId, entity, blockLocation, 'farmersdelight:cutting_board');

                }
                break;
            case 'farmersdelight:skillet':
                if (block && data) {
                    const itemStack = getMap(entity, 'item')?.get('item');
                    const amount = data.getScore('amount');
                    const itemStackScoresData = data.getScores();
                    const blockLocation = location(entity);
                    const oldBlock = entityDimension.getBlock(blockLocation);
                    if (itemStack !== 'undefined') {
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
                        if (!currentTick % 20) {
                            for (let index = 0; index < particleCount; index++) {
                                entityDimension.spawnParticle(name, { x: blockLocation.x + skilletV2[index].x, y: blockLocation.y + 0.07 + 0.03 * (index + 1), z: blockLocation.z + skilletV2[index].z }, molang);
                            }
                        }
                        if (stove) {
                            for (const itemStackData of itemStackScoresData) {
                                const amountId = itemStackData.participant.displayName;
                                if (amountId !== 'amount') {
                                    const num = parseInt(amountId.split('G')[0]);
                                    const cookTime = itemStackData.score;
                                    data.setScore(amountId, cookTime - (!currentTick ? 1 : 0));
                                    if (cookTime <= 0) {
                                        for (let j = 0; j < parseInt(num); j++) {
                                            entity.runCommandAsync(`loot spawn ${entity.location.x} ${entity.location.y + 0.4} ${entity.location.z} loot "farmersdelight/cook/farmersdelight_cook_${id[1]}"`);
                                        }
                                        data.removeParticipant(amountId);
                                        data.setScore('amount', data.getScore('amount') - num);
                                    }
                                }
                            }
                        }
                    }
                    if (!data.getScore('amount')) {
                        entity.removeTag(JSON.stringify(getMap(entity, 'item')));
                        entity.addTag('{"item":"undefined"}');
                    }
                    console.warn(entity.getTags(), data.getScore('amount'));
                    loot(amount ? itemStack : null, oldBlock.typeId, entity, blockLocation, 'farmersdelight:skillet_block', amount, entity.id);
                }
                break;
            case 'farmersdelight:stove':
                if (block && data) {
                    // const data = scoreboard.getObjective(entity.id);
                    const blockLocation = location(entity);
                    const oldBlock = entityDimension.getBlock(blockLocation);
                    const itemStackScoresData = data.getScores();
                    for (const itemStackData of itemStackScoresData) {
                        const itemStack = itemStackData.participant.displayName;
                        if (itemStack != 'amount') {
                            const id = itemStack.split('/');
                            const name = id[0].split(':');
                            const particleName = name[0] == 'minecraft' ? `farmersdelight:${name[0]}_cook_${name[1]}` : `farmersdelight:cook_${name[1]}`;
                            if (oldBlock.permutation?.getState('farmersdelight:is_working')) {
                                const cookTime = itemStackData.score;
                                data.setScore(itemStack, cookTime - (!currentTick ? 1 : 0));
                                if (cookTime <= 0) {
                                    data.removeParticipant(itemStack);
                                    data.setScore('amount', data.getScore('amount') - 1);
                                    entity.runCommandAsync(`loot spawn ${entity.location.x + 0.5} ${entity.location.y + 1} ${entity.location.z + 0.5} loot "farmersdelight/cook/farmersdelight_cook_${name[1]}"`);
                                }
                            }
                            if (!currentTick % 20) entityDimension.spawnParticle(particleName, { x: blockLocation.x + 0.5 + stoveOffsets[id[1] - 1].x, y: blockLocation.y + 1.02, z: blockLocation.z + 0.5 + stoveOffsets[id[1] - 1].y }, molang);

                        }
                    }
                    for (const item of itemStackArr(itemStackScoresData)) {
                        loot(item, oldBlock.typeId, entity, blockLocation, 'farmersdelight:stove', 1);
                    }
                    loot(null, oldBlock.typeId, entity, blockLocation, 'farmersdelight:stove', 1, entity.id);
                }
                break;
            case 'farmersdelight:cooking_pot':
                if (block) {
                    const blockLocation = location(entity);
                    const oldBlock = entityDimension.getBlock(blockLocation);
                    const container = entity.getComponent('inventory').container;
                    if (stove) {
                        const recipes = vanillaCookingPotRecipe.recipe;
                        const holder = new RecipeHolder(container, recipes);
                        holder.consume()
                    }
                    potLoot(container, oldBlock.typeId, entity, blockLocation, 'farmersdelight:cooking_pot');
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
    const firstPlayer = world.getAllPlayers()[0]
    blockTick(firstPlayer.dimension);
    for (const player of world.getAllPlayers()) {
        // block tick
        // rope(player);
    }
})
