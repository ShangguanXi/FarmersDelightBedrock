import { MolangVariableMap, system, world } from "@minecraft/server";
import BlockEntity from "../../lib/BlockEntity";

const molang = new MolangVariableMap();

const options = { entityTypes: ['farmersdelight:stove'], eventTypes: ['farmersdelight:stove_tick'] };

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

function working(args) {
    const entity = args.entity;
    try {
        const blockEntity = new BlockEntity(entity);
        const data = blockEntity.scoreboardObjective;
        if (blockEntity.block && data) {
            const itemStackScoresData = data.getScores();
            const blockLocation = blockEntity.blockEntityDataLocation;
            for (const itemStackData of itemStackScoresData) {
                const itemStack = itemStackData.participant.displayName;
                if (itemStack != 'amount') {
                    const id = itemStack.split('/');
                    const name = id[0].split(':');
                    const particleName = name[0] == 'minecraft' ? `farmersdelight:${name[0]}_stove_${name[1]}` : `farmersdelight:stove_${name[1]}`;
                    if (blockEntity.block.permutation?.getState('farmersdelight:is_working')) {
                        const cookTime = itemStackData.score;
                        data.setScore(itemStack, cookTime - (system.currentTick % 20 == 0 ? 1 : 0));
                        if (cookTime <= 0) {
                            data.removeParticipant(itemStack);
                            data.setScore('amount', data.getScore('amount') - 1);
                            entity.runCommandAsync(`loot spawn ${entity.location.x + 0.5} ${entity.location.y + 1} ${entity.location.z + 0.5} loot "farmersdelight/cook/farmersdelight_cook_${name[1]}"`);
                        }
                    }
                    blockEntity.dimension.spawnParticle(particleName, { x: blockLocation.x + stoveOffsets[id[1] - 1].x, y: blockLocation.y + 1.02, z: blockLocation.z + stoveOffsets[id[1] - 1].y }, molang);
                }
            }
            blockEntity.blockEntityLoot(itemStackArr(itemStackScoresData) ?? null, 'farmersdelight:stove', 1);
        }
    } catch (e) {

    }
}
world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(working, options);