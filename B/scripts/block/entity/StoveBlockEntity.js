var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { system, world } from "@minecraft/server";
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
    },
    {
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
export class StoveBlockEntity extends BlockEntity {
    tick(args) {
        const entityBlockData = super.blockEntityData(args.entity);
        if (!entityBlockData)
            return;
        const block = entityBlockData.block;
        const entity = entityBlockData.entity;
        const sco = entityBlockData.scoreboardObjective;
        if (!sco)
            return;
        const { x, y, z } = entity.location;
        const itemStackScoresData = sco?.getScores();
        if (block.permutation.getState('minecraft:cardinal_direction') == "north" || block.permutation.getState('minecraft:cardinal_direction') == "south") {
            for (const itemStackData of itemStackScoresData) {
                const itemStack = itemStackData.participant.displayName;
                if (itemStack == 'amount')
                    continue;
                const id = itemStack.split('/');
                const name = id[0].split(':');
                const particleName = name[0] == 'minecraft' ? `farmersdelight:${name[0]}_stove_${name[1]}` : `farmersdelight:stove_${name[1]}`;
                if (block.permutation?.getState('farmersdelight:is_working')) {
                    if ((system.currentTick % 20) == 0) {
                        entity.dimension.spawnParticle("farmersdelight:stove_smoke_particle", { x: x + stoveOffsets[parseInt(id[1]) - 1].x, y: y + 1.02, z: z + stoveOffsets[parseInt(id[1]) - 1].y });
                        entity.runCommandAsync("playsound block.campfire.crackle @a ~ ~ ~ 1 1");
                    }
                    const cookTime = itemStackData.score;
                    sco.setScore(itemStack, cookTime - (system.currentTick % 20 == 0 ? 1 : 0));
                    if (cookTime <= 0) {
                        sco.removeParticipant(itemStack);
                        sco.setScore('amount', (sco.getScore('amount') ?? 0) - 1);
                        entity.runCommandAsync(`loot spawn ${entity.location.x + 0.5} ${entity.location.y + 1} ${entity.location.z + 0.5} loot "${id[0]}/cook/${id[1]}"`);
                    }
                }
                ;
                entity.dimension.spawnParticle(particleName, { x: x + stoveOffsets[parseInt(id[1]) - 1].x, y: y + 1.02, z: z + stoveOffsets[parseInt(id[1]) - 1].y });
            }
        }
        ;
        if (block.permutation.getState('minecraft:cardinal_direction') == "west" || block.permutation.getState('minecraft:cardinal_direction') == "east") {
            for (const itemStackData of itemStackScoresData) {
                const itemStack = itemStackData.participant.displayName;
                if (itemStack == 'amount')
                    continue;
                const id = itemStack.split('/');
                const name = id[0].split(':');
                const particleName = name[0] == 'minecraft' ? `farmersdelight:${name[0]}_stove_${name[1]}` : `farmersdelight:stove_${name[1]}`;
                if (block.permutation?.getState('farmersdelight:is_working')) {
                    if ((system.currentTick % 20) == 0) {
                        entity.dimension.spawnParticle("farmersdelight:stove_smoke_particle", { x: x + stoveOffsets[parseInt(id[1]) - 1].y, y: y + 1.02, z: z + stoveOffsets[parseInt(id[1]) - 1].x });
                        entity.runCommandAsync("playsound block.campfire.crackle @a ~ ~ ~ 1 1");
                    }
                    const cookTime = itemStackData.score;
                    sco.setScore(itemStack, cookTime - (system.currentTick % 20 == 0 ? 1 : 0));
                    if (cookTime <= 0) {
                        sco.removeParticipant(itemStack);
                        sco.setScore('amount', (sco.getScore('amount') ?? 0) - 1);
                        entity.runCommandAsync(`loot spawn ${entity.location.x + 0.5} ${entity.location.y + 1} ${entity.location.z + 0.5} loot "${name[0]}/cook/${name[1]}"`);
                    }
                }
                ;
                entity.dimension.spawnParticle(particleName, { x: x + stoveOffsets[parseInt(id[1]) - 1].y, y: y + 1.02, z: z + stoveOffsets[parseInt(id[1]) - 1].x });
            }
        }
        super.blockEntityLoot(entityBlockData, "farmersdelight:stove", itemStackArr(itemStackScoresData) ?? null);
    }
}
__decorate([
    methodEventSub(world.afterEvents.dataDrivenEntityTrigger, { entityTypes: ["farmersdelight:stove"], eventTypes: ["farmersdelight:stove_tick"] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StoveBlockEntity.prototype, "tick", null);
//# sourceMappingURL=StoveBlockEntity.js.map