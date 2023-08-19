import { MolangVariableMap, system, world } from "@minecraft/server";
import { getMap, location, loot } from "../../lib/BlockEntity";

const molang = new MolangVariableMap();

const options = { entityTypes: ['farmersdelight:skillet'], eventTypes: ['farmersdelight:skillet_tick'] };

const skilletV2 = [];
for (let i = 0; i < 5; i++) {
    const json = {};
    json.x = (Math.random() * 2 - 1) * 0.15 * 0.5;
    json.z = (Math.random() * 2 - 1) * 0.15 * 0.5;
    skilletV2.push(json);
}

function working(args) {
    const entity = args.entity;
    try {
        const dimension = entity?.dimension;
        const block = dimension.getBlock(entity.location);
        const stove = dimension.getBlock({ x: entity.location.x, y: entity.location.y - 1, z: entity.location.z })?.permutation?.getState('farmersdelight:is_working');
        const data = world.scoreboard.getObjective(entity.id);
        if (block && data) {
            const currentTick = system.currentTick % 2;
            const itemStack = getMap(entity, 'item')?.get('item');
            const amount = data.getScore('amount');
            const itemStackScoresData = data.getScores();
            const blockLocation = location(entity);
            const oldBlock = dimension.getBlock(blockLocation);
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
                if (!currentTick % 2) {
                    for (let index = 0; index < particleCount; index++) {
                        dimension.spawnParticle(name, { x: blockLocation.x + skilletV2[index].x, y: blockLocation.y + 0.07 + 0.03 * (index + 1), z: blockLocation.z + skilletV2[index].z }, molang);
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
            loot(amount ? itemStack : null, oldBlock.typeId, entity, blockLocation, 'farmersdelight:skillet_block', amount, entity.id);
        }
    } catch (e) {
        
    }
}
world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(working, options);

