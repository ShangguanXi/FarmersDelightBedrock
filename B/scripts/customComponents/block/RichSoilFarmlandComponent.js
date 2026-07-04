var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BlockPermutation, BlockVolume, } from "@minecraft/server";
import { takeItem } from "../../lib/ItemUtil";
import { blockComponent } from "../../lib/EventSubscriber";
import { resolveSpec } from "../../lib/ObjectUtil";
function handlePlanting(seedId, crop, topLocation, container, player, block) {
    if (!player)
        return;
    if (!container)
        return;
    const selectedSlot = container?.getSlot(player.selectedSlotIndex);
    const itemId = selectedSlot?.typeId;
    if (itemId == seedId) {
        player.dimension.playSound("dig.grass", block.location);
        block.dimension.setBlockType(topLocation, crop);
        takeItem(container, player.selectedSlotIndex, 1);
    }
    return;
}
let RichSoilFarmlandComponent = class RichSoilFarmlandComponent {
    constructor() {
        this.onRandomTick = this.onRandomTick.bind(this);
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
    }
    onPlayerInteract(args) {
        const player = args.player;
        const face = args.face;
        const inventory = player?.getComponent("inventory");
        const container = inventory?.container;
        const block = args.block;
        const dimension = args.dimension;
        if (!player)
            return;
        if (!container)
            return;
        const selectedSlot = container?.getSlot(player.selectedSlotIndex);
        const itemStack = selectedSlot.getItem();
        if (!itemStack)
            return;
        const topLocation = { x: block.location.x, y: block.location.y + 1, z: block.location.z };
        const topBlockId = dimension.getBlock(topLocation)?.typeId;
        if (face == 'Up' && topBlockId == "minecraft:air") {
            handlePlanting("minecraft:wheat_seeds", "farmersdelight:rich_soil_wheat", topLocation, container, player, block);
            handlePlanting("minecraft:potato", "farmersdelight:rich_soil_potato", topLocation, container, player, block);
            handlePlanting("minecraft:carrot", "farmersdelight:rich_soil_carrot", topLocation, container, player, block);
            handlePlanting("minecraft:beetroot_seeds", "farmersdelight:rich_soil_beetroot", topLocation, container, player, block);
            handlePlanting("minecraft:torchflower_seeds", "farmersdelight:rich_soil_torchflower_crop", topLocation, container, player, block);
            handlePlanting("minecraft:torchflower", "farmersdelight:rich_soil_torchflower", topLocation, container, player, block);
            const crop = resolveSpec(itemStack, "farmersdelight:seed");
            if (crop) {
                handlePlanting(itemStack.typeId, crop, topLocation, container, player, block);
            }
        }
    }
    onRandomTick(args) {
        const block = args.block;
        if (block?.typeId !== "farmersdelight:rich_soil_farmland")
            return;
        const { x, y, z } = block.location;
        const dimension = block.dimension;
        const fromLocation = { x: x - 4, y: y, z: z - 4 };
        const toLocation = { x: x + 4, y: y + 1, z: z + 4 };
        const detectLocs = new BlockVolume(fromLocation, toLocation).getBlockLocationIterator();
        const moisturizedAmount = block.permutation.getState('farmersdelight:moisturized_amount');
        let hasWater = false;
        for (const location of detectLocs) {
            const water = dimension.getBlock(location)?.typeId === "minecraft:water";
            if (water) {
                hasWater = true;
                break;
            }
        }
        ;
        if (hasWater) {
            if (moisturizedAmount < 7)
                block.setPermutation(block.permutation.withState('farmersdelight:moisturized_amount', moisturizedAmount + 1));
        }
        else {
            if (moisturizedAmount > 0) {
                block.setPermutation(block.permutation.withState('farmersdelight:moisturized_amount', moisturizedAmount - 1));
            }
            else {
                block.setPermutation(BlockPermutation.resolve('farmersdelight:rich_soil'));
            }
        }
        ;
        const cropBlock = dimension.getBlock({ x: x, y: y + 1, z: z });
        if (!cropBlock)
            return;
        const params = resolveSpec(cropBlock, "farmersdelight:crop");
        if (!params)
            return;
        const growth = cropBlock.permutation.getState(params.state.name);
        if (growth < params.state.age) {
            cropBlock.setPermutation(cropBlock.permutation.withState(params.state.name, growth + 1));
            dimension.spawnParticle("minecraft:crop_growth_emitter", { x: block.location.x + 0.5, y: block.location.y + 1.5, z: block.location.z + 0.5 });
        }
    }
};
RichSoilFarmlandComponent = __decorate([
    blockComponent("farmersdelight:rich_soil_farmland"),
    __metadata("design:paramtypes", [])
], RichSoilFarmlandComponent);
export { RichSoilFarmlandComponent };
