var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { WorldInitializeBeforeEvent, world } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
function spawnLoot(path, dimenion, location) {
    return dimenion.runCommand(`loot spawn ${location.x} ${location.y} ${location.z} loot "${path}"`);
}
class CookingPotComponent {
    constructor() {
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
    }
    onPlayerInteract(args) {
        const block = args.block;
        const location = args.block.location;
        if (block.typeId == "farmersdelight:rice_roll_medley_block") {
            if (Number(block.permutation.getState("farmersdelight:food_block_stage")) <= 2) {
                spawnLoot("farmersdelight/food_block/kelp_roll_slice", block.dimension, { x: location.x + 0.5, y: location.y + 1, z: location.z + 0.5 });
            }
            if (Number(block.permutation.getState("farmersdelight:food_block_stage")) > 2 && Number(block.permutation.getState("farmersdelight:food_block_stage")) <= 5) {
                spawnLoot("farmersdelight/food_block/salmon_roll", block.dimension, { x: location.x + 0.5, y: location.y + 1, z: location.z + 0.5 });
            }
            if (Number(block.permutation.getState("farmersdelight:food_block_stage")) > 5 && Number(block.permutation.getState("farmersdelight:food_block_stage")) <= 7) {
                spawnLoot("farmersdelight/food_block/cod_roll", block.dimension, { x: location.x + 0.5, y: location.y + 1, z: location.z + 0.5 });
            }
            if (Number(block.permutation.getState("farmersdelight:food_block_stage")) == 8) {
                spawnLoot("farmersdelight/food_block/rice_roll_medley_block_over", block.dimension, { x: location.x + 0.5, y: location.y + 1, z: location.z + 0.5 });
                block.dimension.setBlockType({ x: location.x, y: location.y, z: location.z }, "minecraft:air");
            }
            if (Number(block.permutation.getState("farmersdelight:food_block_stage")) < 8) {
                block.setPermutation(block.permutation.withState("farmersdelight:food_block_stage", Number(block.permutation.getState("farmersdelight:food_block_stage")) + 1));
            }
        }
    }
}
export class RiceRollMedleyComponentRegister {
    register(args) {
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:rice_roll_medley', new CookingPotComponent());
    }
}
__decorate([
    methodEventSub(world.beforeEvents.worldInitialize),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WorldInitializeBeforeEvent]),
    __metadata("design:returntype", void 0)
], RiceRollMedleyComponentRegister.prototype, "register", null);
//# sourceMappingURL=CookingPot.js.map