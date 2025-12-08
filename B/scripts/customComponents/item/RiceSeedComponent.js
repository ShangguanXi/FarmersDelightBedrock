var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Direction, Player, StartupEvent, system, } from "@minecraft/server";
import { takeItem } from "../../lib/ItemUtil";
import { hasLimitedMaterials } from "../../lib/EntityUtil";
import { subscribeEvent } from "../../lib/EventSubscriber";
class RiceSeedComponent {
    constructor() {
        this.onUseOn = this.onUseOn.bind(this);
    }
    onUseOn(args) {
        const itemStack = args.itemStack;
        const block = args.block;
        const source = args.source;
        if (source instanceof Player) {
            if (!itemStack || args.blockFace != Direction.Up || (!block.getTags().includes("dirt")))
                return;
            system.run(() => {
                const water = block.above();
                if (!(water?.typeId == 'minecraft:water' && water?.permutation.getState('liquid_depth') == 0))
                    return;
                block.dimension.setBlockType(water.location, "farmersdelight:rice_block");
                const inventory = source?.getComponent("inventory");
                const container = inventory?.container;
                if (hasLimitedMaterials(source))
                    takeItem(container, source.selectedSlotIndex, 1);
            });
        }
    }
}
export class RiceSeedComponentRegister {
    register(args) {
        args.itemComponentRegistry.registerCustomComponent('farmersdelight:rice_seed', new RiceSeedComponent());
    }
}
__decorate([
    subscribeEvent(system.beforeEvents.startup),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [StartupEvent]),
    __metadata("design:returntype", void 0)
], RiceSeedComponentRegister.prototype, "register", null);
