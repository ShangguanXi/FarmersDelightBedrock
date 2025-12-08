var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BlockPermutation, Direction, StartupEvent, system, } from "@minecraft/server";
import { hasLimitedMaterials, horizontalDirectionOf } from "../../lib/EntityUtil";
import { takeItem } from "../../lib/ItemUtil";
import { oppositeOf } from "../../lib/DirectionUtil";
import { subscribeEvent } from "../../lib/EventSubscriber";
class TatamMatComponent {
    constructor() {
        this.onTick = this.onTick.bind(this);
        this.beforeOnPlayerPlace = this.beforeOnPlayerPlace.bind(this);
    }
    beforeOnPlayerPlace(args) {
        const block = args.block;
        const player = args.player;
        const dimension = args.dimension;
        const inventory = player?.getComponent("inventory");
        const container = inventory?.container;
        if (!player)
            return;
        const itemId = container?.getSlot(player.selectedSlotIndex).typeId;
        if (!itemId || itemId != 'farmersdelight:tatami_mat' || args.face != Direction.Up)
            return;
        args.cancel = true;
        system.run(() => {
            if (!player)
                return;
            let other;
            const direction = horizontalDirectionOf(player);
            switch (direction) {
                case Direction.East:
                    other = block?.east();
                    break;
                case Direction.West:
                    other = block?.west();
                    break;
                case Direction.North:
                    other = block?.north();
                    break;
                case Direction.South:
                    other = block?.south();
                    break;
            }
            if (!other?.isAir)
                return;
            const mainPerm = BlockPermutation.resolve("farmersdelight:tatami_mat_main", {
                "minecraft:cardinal_direction": direction.toLowerCase(),
                "farmersdelight:init": true,
            });
            const otherPerm = BlockPermutation.resolve("farmersdelight:tatami_mat_other", {
                "minecraft:cardinal_direction": oppositeOf(direction).toLowerCase(),
                "farmersdelight:init": true,
            });
            dimension.playSound("dig.cloth", block.location);
            block?.setPermutation(mainPerm);
            other?.setPermutation(otherPerm);
            if (hasLimitedMaterials(player))
                takeItem(container, player.selectedSlotIndex);
        });
    }
    onTick(args) {
        const main = args.block;
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
export class TatamMatComponentRegister {
    register(args) {
        args.blockComponentRegistry.registerCustomComponent('farmersdelight:tatami_mat', new TatamMatComponent());
    }
}
__decorate([
    subscribeEvent(system.beforeEvents.startup),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [StartupEvent]),
    __metadata("design:returntype", void 0)
], TatamMatComponentRegister.prototype, "register", null);
