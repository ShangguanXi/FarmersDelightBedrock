var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { EquipmentSlot, GameMode, Player, } from "@minecraft/server";
import { isEnchanted, takeItem } from "../../lib/ItemUtil";
import { blockComponent, subscribeEvent } from "../../lib/EventSubscriber";
import { spawnLootAtBlock } from "../../lib/LootUtil";
import { getEquipment } from "../../lib/EntityUtil";
import { PlayerTickEvent } from "../../lib/Events";
let RopeComponent = class RopeComponent {
    constructor() {
        this.onTick = this.onTick.bind(this);
        this.onRandomTick = this.onRandomTick.bind(this);
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
        this.onPlayerBreak = this.onPlayerBreak.bind(this);
    }
    onPlayerInteract(args) {
        const block = args.block;
        const player = args.player;
        const dimension = args.dimension;
        if (!player)
            return;
        const inventory = player?.getComponent("inventory");
        const container = inventory?.container;
        const itemId = container?.getSlot(player.selectedSlotIndex).typeId;
        const stage = Number(block.permutation.getState("farmersdelight:stage"));
        const random = Math.floor(Math.random() * 101);
        try {
            if (itemId == "minecraft:bone_meal" && stage < 4) {
                dimension.playSound("item.bone_meal.use", block.location);
                if (player?.getGameMode() == GameMode.Creative) {
                    block.dimension.spawnParticle("minecraft:crop_growth_emitter", { x: block.location.x + 0.5, y: block.location.y + 0.5, z: block.location.z + 0.5 });
                    block.setPermutation(block.permutation.withState("farmersdelight:stage", 4));
                }
                else {
                    if (random <= 60) {
                        block.setPermutation(block.permutation.withState("farmersdelight:stage", stage + 1));
                    }
                    block.dimension.spawnParticle("minecraft:crop_growth_emitter", { x: block.location.x + 0.5, y: block.location.y + 0.5, z: block.location.z + 0.5 });
                    if (!container)
                        return;
                    takeItem(container, player?.selectedSlotIndex, 1);
                }
            }
            if (stage == 4) {
                block.setPermutation(block.permutation.withState("farmersdelight:stage", 1));
                spawnLootAtBlock(block, "farmersdelight/crops/farmersdelight_tomato_riped");
            }
        }
        catch (error) {
        }
    }
    onPlayerBreak(args) {
        const player = args.player;
        if (!player)
            return;
        if ((args.brokenBlockPermutation.getState("farmersdelight:stage") ?? 0) > 0 && !isEnchanted(getEquipment(player, EquipmentSlot.Mainhand), "silk_touch")) {
            args.block.setType("farmersdelight:rope");
        }
    }
    onRandomTick(args) {
        const block = args.block;
        const location = block.location;
        const dimension = args.dimension;
        const stage = block.permutation.getState('farmersdelight:stage');
        const directions = [
            { x: 0, z: -1 },
            { x: 0, z: 1 },
            { x: -1, z: 0 },
            { x: 1, z: 0 }
        ];
        const hasRopeAround = directions.some(({ x, z }) => dimension.getBlock({ x: location.x + x, y: location.y, z: location.z + z })?.hasTag("rope"));
        const blockBelow = dimension.getBlock({ x: location.x, y: location.y - 1, z: location.z });
        const tomatoCrop = blockBelow?.hasTag('tomato_crop');
        const tomatoCropWithRope = blockBelow?.hasTag('tomato_crop_with_rope');
        const canGrow = dimension.getBlock({ x: location.x, y: location.y - 1, z: location.z })?.permutation.getState('farmersdelight:can_grow');
        if (stage > 0 && stage < 4) {
            block.setPermutation(block.permutation.withState('farmersdelight:stage', stage + 1));
        }
        if (tomatoCrop && (stage == 0) && !hasRopeAround) {
            block.setPermutation(block.permutation.withState('farmersdelight:stage', 1));
        }
        if (canGrow && tomatoCropWithRope && (stage == 0) && !hasRopeAround) {
            block.setPermutation(block.permutation.withState('farmersdelight:stage', 1));
            block.setPermutation(block.permutation.withState('farmersdelight:can_grow', false));
        }
    }
    onTick(args) {
        const block = args.block;
        const location = block.location;
        const dimension = args.dimension;
        const stage = block.permutation.getState('farmersdelight:stage');
        if (stage == 0) {
            const ropePositions = [
                { x: location.x, y: location.y, z: location.z - 1, direction: 'north' },
                { x: location.x, y: location.y, z: location.z + 1, direction: 'south' },
                { x: location.x - 1, y: location.y, z: location.z, direction: 'east' },
                { x: location.x + 1, y: location.y, z: location.z, direction: 'west' }
            ];
            ropePositions.forEach(pos => {
                const rope = dimension.getBlock(pos)?.hasTag("rope") ?? false;
                block.setPermutation(block.permutation.withState(`farmersdelight:${pos.direction}_connected`, rope));
            });
        }
        else {
            const tomato = block.below();
            if (!tomato || !tomato.hasTag("tomato_crop") && !tomato.hasTag("tomato_crop_with_rope")) {
                block.setPermutation(block.permutation.withState('farmersdelight:stage', 0));
                block.setPermutation(block.permutation.withState('farmersdelight:can_grow', true));
            }
        }
    }
    static simulateClimbing(player) {
        if (player.dimension.getBlock(player.location)?.getComponent("farmersdelight:rope")) {
            const pitch = player.getViewDirection().y;
            if (pitch > 0) {
                player.addEffect("levitation", 5, { showParticles: false });
            }
            else if (pitch < 0) {
                player.addEffect("slow_falling", 5, { showParticles: false });
            }
        }
    }
};
__decorate([
    subscribeEvent(PlayerTickEvent),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Player]),
    __metadata("design:returntype", void 0)
], RopeComponent, "simulateClimbing", null);
RopeComponent = __decorate([
    blockComponent("farmersdelight:rope"),
    __metadata("design:paramtypes", [])
], RopeComponent);
export { RopeComponent };
