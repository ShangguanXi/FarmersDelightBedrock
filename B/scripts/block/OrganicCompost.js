var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BlockPermutation, BlockVolume, system } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { organicCompostDetectList } from "../data/organicCompostDetect";
export class OrganicCompost {
    blockTick(args) {
        let transChance = 0.1;
        let hasWater = false;
        const compostBlock = args.sourceBlock;
        if (compostBlock?.typeId !== "farmersdelight:organic_compost")
            return;
        const currentProcess = compostBlock.permutation.getState("farmersdelight:process") ?? 0;
        const { x, y, z } = compostBlock.location;
        const dimension = compostBlock.dimension;
        const fromLocation = { x: x - 1, y: y - 1, z: z - 1 };
        const toLocation = { x: x + 1, y: y + 1, z: z + 1 };
        const detectLocs = new BlockVolume(fromLocation, toLocation).getBlockLocationIterator();
        for (const location of detectLocs) {
            const block = dimension.getBlock(location);
            if (!block)
                continue;
            if (organicCompostDetectList.includes(block.typeId)) {
                transChance += 0.02;
            }
            else if (block.hasTag('compost_activators')) {
                transChance += 0.02;
            }
            else if (block.typeId == 'minecraft:water') {
                hasWater = true;
            }
        }
        ;
        if (hasWater)
            transChance += 0.1;
        if (Math.random() < transChance) {
            if (currentProcess < 7) {
                compostBlock.setPermutation(compostBlock.permutation.withState('farmersdelight:process', currentProcess + 1));
            }
            else {
                compostBlock.setPermutation(BlockPermutation.resolve('farmersdelight:rich_soil'));
            }
        }
    }
}
__decorate([
    methodEventSub(system.afterEvents.scriptEventReceive, { namespaces: ["farmersdelight"] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrganicCompost.prototype, "blockTick", null);
//# sourceMappingURL=OrganicCompost.js.map