import { Block, Entity, ScoreboardObjective, ScoreboardScoreInfo, Vector3, system, world } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { BlockEntity } from "./BlockEntity";


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
function itemStackArr(scores: ScoreboardScoreInfo[]): string[] {
    let arr: string[] = [];
    for (const itemStackData of scores) {
        const itemStack: string = itemStackData.participant.displayName;
        if (itemStack != 'amount') {
            const id: string[] = itemStack.split('/');
            arr.push(id[0]);
        }
    }
    return arr;
}


export class StoveBlockEntity extends BlockEntity {
    @methodEventSub(world.afterEvents.dataDrivenEntityTrigger, { entityTypes: ["farmersdelight:stove"], eventTypes: ["farmersdelight:stove_tick"] })
    tick(args: any) {
        const entityBlockData = super.blockEntityData(args.entity);
        if (!entityBlockData) return;
        const block: Block = entityBlockData.block;
        const entity: Entity = entityBlockData.entity;
        const sco: ScoreboardObjective | null = entityBlockData.scoreboardObjective;
        if (!sco) return;
        const { x, y, z }: Vector3 = entity.location;
        const itemStackScoresData = sco?.getScores();
        if (block.permutation.getState('minecraft:cardinal_direction') == "north" || block.permutation.getState('minecraft:cardinal_direction') == "south") {
            for (const itemStackData of itemStackScoresData) {
                const itemStack: string = itemStackData.participant.displayName;
                if (itemStack == 'amount') continue;
                const id: string[] = itemStack.split('/');
                const name: string[] = id[0].split(':');
                const particleName: string = name[0] == 'minecraft' ? `farmersdelight:${name[0]}_stove_${name[1]}` : `farmersdelight:stove_${name[1]}`;

                if (block.permutation?.getState('farmersdelight:is_working')) {

                    if ((system.currentTick % 20) == 0) {
                        entity.dimension.spawnParticle("farmersdelight:stove_smoke_particle", { x: x + stoveOffsets[parseInt(id[1]) - 1].x, y: y + 1.02, z: z + stoveOffsets[parseInt(id[1]) - 1].y });
                        entity.runCommandAsync("playsound block.campfire.crackle @a ~ ~ ~ 1 1")
                    }
                    const cookTime: number = itemStackData.score;
                    sco.setScore(itemStack, cookTime - (system.currentTick % 20 == 0 ? 1 : 0));
                    if (cookTime <= 0) {
                        sco.removeParticipant(itemStack);
                        sco.setScore('amount', (sco.getScore('amount') ?? 0) - 1);
                        entity.runCommandAsync(`loot spawn ${entity.location.x + 0.5} ${entity.location.y + 1} ${entity.location.z + 0.5} loot "${id[0]}/cook/${id[1]}"`);
                    }
                };

                entity.dimension.spawnParticle(particleName, { x: x + stoveOffsets[parseInt(id[1]) - 1].x, y: y + 1.02, z: z + stoveOffsets[parseInt(id[1]) - 1].y }
                );
            }
        };
        if (block.permutation.getState('minecraft:cardinal_direction') == "west" || block.permutation.getState('minecraft:cardinal_direction') == "east") {
            for (const itemStackData of itemStackScoresData) {
                const itemStack: string = itemStackData.participant.displayName;
                if (itemStack == 'amount') continue;
                const id: string[] = itemStack.split('/');
                const name: string[] = id[0].split(':');
                const particleName: string = name[0] == 'minecraft' ? `farmersdelight:${name[0]}_stove_${name[1]}` : `farmersdelight:stove_${name[1]}`;

                if (block.permutation?.getState('farmersdelight:is_working')) {

                    if ((system.currentTick % 20) == 0) {
                        entity.dimension.spawnParticle("farmersdelight:stove_smoke_particle", { x: x + stoveOffsets[parseInt(id[1]) - 1].y, y: y + 1.02, z: z + stoveOffsets[parseInt(id[1]) - 1].x });
                        entity.runCommandAsync("playsound block.campfire.crackle @a ~ ~ ~ 1 1")
                    }
                    const cookTime: number = itemStackData.score;
                    sco.setScore(itemStack, cookTime - (system.currentTick % 20 == 0 ? 1 : 0));
                    if (cookTime <= 0) {
                        sco.removeParticipant(itemStack);
                        sco.setScore('amount', (sco.getScore('amount') ?? 0) - 1);
                        entity.runCommandAsync(`loot spawn ${entity.location.x + 0.5} ${entity.location.y + 1} ${entity.location.z + 0.5} loot "${name[0]}/cook/${name[1]}"`);
                        console.warn(`loot spawn ${entity.location.x + 0.5} ${entity.location.y + 1} ${entity.location.z + 0.5} loot "${name[0]}/cook/${name[1]}"`)
                    }
                };

                entity.dimension.spawnParticle(particleName, { x: x + stoveOffsets[parseInt(id[1]) - 1].y, y: y + 1.02, z: z + stoveOffsets[parseInt(id[1]) - 1].x }
                );
            }
        }
        super.blockEntityLoot(entityBlockData, "farmersdelight:stove", itemStackArr(itemStackScoresData) ?? null);
    }
}