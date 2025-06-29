import { Block, DataDrivenEntityTriggerAfterEvent, Entity, ScoreboardObjective, ScoreboardScoreInfo, Vector3, system, world } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { BlockEntity } from "../../lib/BlockEntity";


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
    @methodEventSub(world.afterEvents.dataDrivenEntityTrigger, { eventTypes: ["farmersdelight:stove_tick"] })
    tick(args: DataDrivenEntityTriggerAfterEvent) {
        const entityBlockData = super.blockEntityData(args.entity);
        if (!entityBlockData) return;
        const block: Block = entityBlockData.block;
        const entity: Entity = entityBlockData.entity;

    }
}