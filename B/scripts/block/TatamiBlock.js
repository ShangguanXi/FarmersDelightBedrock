var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BlockPermutation, Direction, system, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
export class TatamiBlock {
    placeBlock(args) {
        const block = args.block;
        const item = args.itemStack;
        if (block.typeId != "farmersdelight:tatami")
            return;
        if (item.typeId != "farmersdelight:tatami")
            return;
        if (block.permutation.getState('farmersdelight:connection') != "none")
            return;
        let { x, y, z } = block.location;
        const dimension = args.dimension;
        const face = args.face;
        system.run(() => {
            let thisPerm = BlockPermutation.resolve('farmersdelight:tatami');
            let neighborPerm = block.permutation;
            switch (face) {
                case Direction.North:
                    thisPerm = thisPerm.withState('farmersdelight:connection', 'south');
                    neighborPerm = neighborPerm.withState('farmersdelight:connection', 'north');
                    z -= 1;
                    break;
                case Direction.South:
                    thisPerm = thisPerm.withState('farmersdelight:connection', 'north');
                    neighborPerm = neighborPerm.withState('farmersdelight:connection', 'south');
                    z += 1;
                    break;
                case Direction.East:
                    thisPerm = thisPerm.withState('farmersdelight:connection', 'west');
                    neighborPerm = neighborPerm.withState('farmersdelight:connection', 'east');
                    x += 1;
                    break;
                case Direction.West:
                    thisPerm = thisPerm.withState('farmersdelight:connection', 'east');
                    neighborPerm = neighborPerm.withState('farmersdelight:connection', 'west');
                    x -= 1;
                    break;
                case Direction.Up:
                    thisPerm = thisPerm.withState('farmersdelight:connection', 'down');
                    neighborPerm = neighborPerm.withState('farmersdelight:connection', 'up');
                    y += 1;
                    break;
                case Direction.Down:
                    thisPerm = thisPerm.withState('farmersdelight:connection', 'up');
                    neighborPerm = neighborPerm.withState('farmersdelight:connection', 'down');
                    y -= 1;
                    break;
                default:
                    break;
            }
            ;
            if (dimension.getEntitiesAtBlockLocation({ x, y, z }).length != 0)
                return;
            if (dimension.getBlock({ x, y, z })?.typeId != 'farmersdelight:tatami')
                return;
            block.setPermutation(neighborPerm);
            dimension.getBlock({ x, y, z })?.setPermutation(thisPerm);
        });
    }
}
__decorate([
    methodEventSub(world.beforeEvents.playerPlaceBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TatamiBlock.prototype, "placeBlock", null);
//# sourceMappingURL=TatamiBlock.js.map