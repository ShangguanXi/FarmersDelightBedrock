var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BlockPermutation, Direction, PlayerInteractWithBlockBeforeEvent, ScriptEventCommandMessageAfterEvent, system, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { ItemUtil } from "../lib/ItemUtil";
import { EntityUtil } from "../lib/EntityUtil";
export class TatamiMatBlock {
    //放置长榻榻米垫
    tryPlaceBlock(args) {
        const itemStack = args.itemStack;
        const block = args.block;
        const player = args.player;
        if (!itemStack || itemStack.typeId != 'farmersdelight:tatami_mat' || args.blockFace != Direction.Up)
            return;
        args.cancel = true;
        system.run(() => {
            const main = block.above();
            let other;
            const direction = EntityUtil.cardinalDirection(player, 180)?.toLowerCase();
            const otherDirection = EntityUtil.cardinalDirection(player)?.toLowerCase();
            switch (direction) {
                case 'east':
                    other = main?.east();
                    break;
                case 'west':
                    other = main?.west();
                    break;
                case 'north':
                    other = main?.north();
                    break;
                case 'south':
                    other = main?.south();
                    break;
            }
            if (!other?.isAir)
                return;
            const mainPerm = BlockPermutation.resolve('farmersdelight:tatami_mat_main', { 'minecraft:cardinal_direction': direction, 'farmersdelight:init': true });
            const otherPerm = BlockPermutation.resolve('farmersdelight:tatami_mat_other', { 'minecraft:cardinal_direction': otherDirection, 'farmersdelight:init': true });
            main?.setPermutation(mainPerm);
            other?.setPermutation(otherPerm);
            if (EntityUtil.gameMode(player))
                ItemUtil.clearItem(player.getComponent('inventory')?.container, player.selectedSlot);
        });
    }
    tick(args) {
        if (args.id == 'farmersdelight:tatami_mat_tick') {
            const main = args.sourceBlock;
            const direction = main.permutation.getState('minecraft:cardinal_direction');
            let other;
            switch (direction) {
                case 'east':
                    other = main?.east();
                    break;
                case 'west':
                    other = main?.west();
                    break;
                case 'north':
                    other = main?.north();
                    break;
                case 'south':
                    other = main?.south();
                    break;
            }
            if (main.typeId == 'farmersdelight:tatami_mat_main') {
                if (other?.typeId != 'farmersdelight:tatami_mat_other') {
                    main.dimension.runCommand(`setblock ${main.location.x} ${main.location.y} ${main.location.z} air destroy`);
                    main.dimension.runCommand(`setblock ${other?.location.x} ${other?.location.y} ${other?.location.z} air destroy`);
                }
            }
            else if (main.typeId == 'farmersdelight:tatami_mat_other') {
                if (other?.typeId != 'farmersdelight:tatami_mat_main') {
                    main.dimension.runCommand(`setblock ${main.location.x} ${main.location.y} ${main.location.z} air destroy`);
                    main.dimension.runCommand(`setblock ${other?.location.x} ${other?.location.y} ${other?.location.z} air destroy`);
                }
            }
        }
    }
}
__decorate([
    methodEventSub(world.beforeEvents.playerInteractWithBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerInteractWithBlockBeforeEvent]),
    __metadata("design:returntype", void 0)
], TatamiMatBlock.prototype, "tryPlaceBlock", null);
__decorate([
    methodEventSub(system.afterEvents.scriptEventReceive, { namespaces: ['farmersdelight'] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ScriptEventCommandMessageAfterEvent]),
    __metadata("design:returntype", void 0)
], TatamiMatBlock.prototype, "tick", null);
//# sourceMappingURL=TatamiMatBlock.js.map