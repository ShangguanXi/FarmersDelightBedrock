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
import { heatConductors, heatSources } from "../../data/heatBlocks";
const skilletV2 = [];
for (let i = 0; i < 5; i++) {
    const json = {};
    json.x = (Math.random() * 2 - 1) * 0.15 * 0.5;
    json.z = (Math.random() * 2 - 1) * 0.15 * 0.5;
    skilletV2.push(json);
}
//检查热源
function heatCheck(block) {
    const blockBelow = block.below();
    if (heatSources.includes(blockBelow?.typeId) || blockBelow?.hasTag('farmersdelight:heat_source'))
        return true;
    if (heatConductors.includes(blockBelow?.typeId) || blockBelow?.hasTag('farmersdelight:heat_conductors')) {
        const blockBelow2 = block.below(2);
        if (heatSources.includes(blockBelow2?.typeId) || blockBelow2?.hasTag('farmersdelight:heat_source'))
            return true;
    }
    return false;
}
export class SkilletBlockEntity extends BlockEntity {
    tick(args) {
        const entityBlockData = super.blockEntityData(args.entity);
        if (!entityBlockData)
            return;
        const entity = entityBlockData.entity;
        const sco = entityBlockData.scoreboardObjective;
        if (!sco)
            return;
        const itemStack = JSON.parse(entity.getDynamicProperty('farmersdelight:blockEntityItemStackData'))["item"];
        const itemStackScoresData = sco.getScores();
        const amount = sco.getScore("amount") ?? 0;
        if (amount <= 0)
            entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', `{"item":"undefined"}`);
        super.blockEntityLoot(entityBlockData, "farmersdelight:skillet_block", itemStack !== "undefined" ? [itemStack] : undefined, amount);
        if (!itemStack || itemStack == 'undefined')
            return;
        const { x, y, z } = entity.location;
        let particleCount = 1;
        if (amount > 48) {
            particleCount = 5;
        }
        else if (amount > 32) {
            particleCount = 4;
        }
        else if (amount > 16) {
            particleCount = 3;
        }
        else if (amount > 1) {
            particleCount = 2;
        }
        const id = itemStack.split(':');
        const name = id[0] === 'minecraft' ? `farmersdelight:${id[0]}_skillet_${id[1]}` : `farmersdelight:skillet_${id[1]}`;
        for (let index = 0; index < particleCount; index++) {
            entity.dimension.spawnParticle(name, { x: x + skilletV2[index].x, y: y + 0.07 + 0.03 * (index + 1), z: z + skilletV2[index].z });
        }
        const heated = heatCheck(entityBlockData.block);
        if (!heated)
            return;
        for (const itemStackData of itemStackScoresData) {
            const amountId = itemStackData.participant.displayName;
            const reg = amountId.match(/\d*\+(\d*)G/);
            if (amountId == 'amount' || !reg)
                continue;
            if (system.currentTick % 80 == 0) {
                entity.runCommandAsync("playsound block.farmersdelight.skillet.sizzle @a ~ ~ ~ 1 1");
            }
            ;
            if (system.currentTick % 4 == 0) {
                const random = Math.floor(Math.random() * 10);
                entity.dimension.spawnParticle(`farmersdelight:skillet_steam_${random}`, { x: x, y: y + 0.25, z: z });
            }
            ;
            const num = parseInt(reg[1]);
            const cookTime = itemStackData.score;
            sco?.setScore(amountId, cookTime - (system.currentTick % 20 == 0 ? 1 : 0));
            if (num == 0) {
                sco.removeParticipant(amountId);
            }
            if (cookTime <= 0) {
                for (let j = 0; j < num; j++) {
                    entity.runCommandAsync(`loot spawn ${entity.location.x} ${entity.location.y + 0.4} ${entity.location.z} loot "${id[0]}/cook/${id[1]}"`);
                }
                sco.removeParticipant(amountId);
                sco.setScore('amount', (sco.getScore("amount") ?? 0) - num);
            }
        }
    }
}
__decorate([
    methodEventSub(world.afterEvents.dataDrivenEntityTrigger, { entityTypes: ["farmersdelight:skillet"], eventTypes: ["farmersdelight:skillet_tick"] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SkilletBlockEntity.prototype, "tick", null);
//# sourceMappingURL=SkilletBlockEntity.js.map