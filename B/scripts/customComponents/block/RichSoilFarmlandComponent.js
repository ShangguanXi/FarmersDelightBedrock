var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { WorldInitializeBeforeEvent, world, BlockVolume, BlockPermutation } from "@minecraft/server";
import { ItemUtil } from "../../lib/ItemUtil";
import { methodEventSub } from "../../lib/eventHelper";
class RichSoilFarmlandComponent {
    constructor() {
        this.onRandomTick = this.onRandomTick.bind(this);
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
        this.onEntityFallOn = this.onEntityFallOn.bind(this);
    }
    onEntityFallOn(args) {
        const block = args.block;
        const dimension = args.dimension;
        const entity = args.entity;
        entity?.teleport({ x: entity.location.x, y: entity.location.y + 0.125, z: entity.location.z });
        dimension.setBlockType(block.location, "farmersdelight:rich_soil");
    }
    onPlayerInteract(args) {
        const player = args.player;
        const face = args.face;
        const container = player?.getComponent("inventory")?.container;
        const block = args.block;
        const dimension = args.dimension;
        if (!player)
            return;
        if (!container)
            return;
        const selectedSlot = container?.getSlot(player.selectedSlotIndex);
        try {
            const itemId = selectedSlot?.typeId;
            const topLocation = { x: block.location.x, y: block.location.y + 1, z: block.location.z };
            const topBlockId = dimension.getBlock(topLocation)?.typeId;
            if (face == 'Up' && topBlockId == "minecraft:air") {
                if (itemId == "minecraft:wheat_seeds") {
                    world.playSound("dig.grass", block.location);
                    dimension.setBlockType(topLocation, "farmersdelight:rich_soil_wheat");
                    ItemUtil.clearItem(container, player.selectedSlotIndex);
                }
                if (itemId == "minecraft:potato") {
                    world.playSound("dig.grass", block.location);
                    dimension.setBlockType(topLocation, "farmersdelight:rich_soil_potato");
                    ItemUtil.clearItem(container, player.selectedSlotIndex);
                }
                if (itemId == "minecraft:carrot") {
                    world.playSound("dig.grass", block.location);
                    dimension.setBlockType(topLocation, "farmersdelight:rich_soil_carrot");
                    ItemUtil.clearItem(container, player.selectedSlotIndex);
                }
                if (itemId == "minecraft:beetroot_seeds") {
                    world.playSound("dig.grass", block.location);
                    dimension.setBlockType(topLocation, "farmersdelight:rich_soil_beetroot");
                    ItemUtil.clearItem(container, player.selectedSlotIndex);
                }
                if (itemId == "minecraft:torchflower_seeds") {
                    world.playSound("dig.grass", block.location);
                    ItemUtil.clearItem(container, player.selectedSlotIndex);
                    dimension.setBlockType(topLocation, "farmersdelight:rich_soil_torchflower_crop");
                }
                if (itemId == "minecraft:torchflower") {
                    world.playSound("dig.grass", block.location);
                    dimension.setBlockType(topLocation, "farmersdelight:rich_soil_torchflower");
                    ItemUtil.clearItem(container, player.selectedSlotIndex);
                }
            }
        }
        catch (error) {
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
        if (!cropBlock?.hasTag('crop'))
            return;
        let maxGrowth, growthProperty;
        for (const tag of cropBlock.getTags()) {
            const growthTag = tag.match(/max_growth:([0-9]+)/);
            const propertyTag = tag.match(/growth_property:(.*)/);
            if (growthTag) {
                maxGrowth = Number(growthTag[1]);
            }
            if (propertyTag) {
                growthProperty = propertyTag[1];
            }
        }
        if (maxGrowth && growthProperty) {
            const growth = cropBlock.permutation.getState(growthProperty);
            if (growth < maxGrowth) {
                cropBlock.setPermutation(cropBlock.permutation.withState(growthProperty, growth + 1));
            }
        }
    }
}
export class RichSoilFarmlandComponentRegister {
    register(args) {
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:rich_soil_farmland', new RichSoilFarmlandComponent());
    }
}
__decorate([
    methodEventSub(world.beforeEvents.worldInitialize),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WorldInitializeBeforeEvent]),
    __metadata("design:returntype", void 0)
], RichSoilFarmlandComponentRegister.prototype, "register", null);
//# sourceMappingURL=RichSoilFarmlandComponent.js.map