var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { WorldInitializeBeforeEvent, world, ItemComponentTypes, EntityInventoryComponent } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { ItemUtil } from "../../lib/ItemUtil";
function spawnLoot(path, dimenion, location) {
    return dimenion.runCommand(`loot spawn ${location.x} ${location.y} ${location.z} loot "${path}"`);
}
export class RopeComponent {
    constructor() {
        this.onTick = this.onTick.bind(this);
        this.onRandomTick = this.onRandomTick.bind(this);
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
        this.onPlayerDestroy = this.onPlayerDestroy.bind(this);
    }
    onPlayerInteract(args) {
        const block = args.block;
        const player = args.player;
        const dimension = args.dimension;
        const itemId = player?.getComponent("inventory")?.container?.getSlot(player.selectedSlotIndex).typeId;
        const stage = Number(block.permutation.getState("farmersdelight:stage"));
        const random = Math.floor(Math.random() * 101);
        if (!player)
            return;
        const container = player.getComponent(EntityInventoryComponent.componentId)?.container;
        try {
            if (itemId == "minecraft:bone_meal" && stage < 4) {
                world.playSound("item.bone_meal.use", block.location);
                if (player?.getGameMode() == "creative") {
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
                    ItemUtil.clearItem(container, player?.selectedSlotIndex);
                }
            }
            if (stage == 4) {
                block.setPermutation(block.permutation.withState("farmersdelight:stage", 1));
                spawnLoot("farmersdelight/crops/farmersdelight_tomato_riped", dimension, { x: block.location.x, y: block.location.y, z: block.location.z });
            }
        }
        catch (error) {
        }
    }
    onPlayerDestroy(args) {
        const player = args.player;
        const blockPermutation = args.destroyedBlockPermutation;
        const container = player?.getComponent("inventory")?.container;
        const block = args.block;
        const dimension = args.dimension;
        if (!player)
            return;
        if (!container)
            return;
        const stage = blockPermutation.getState('farmersdelight:stage');
        const silkTouch = container?.getItem(player.selectedSlotIndex)?.getComponent(ItemComponentTypes.Enchantable)?.hasEnchantment("silk_touch");
        if (stage > 0) {
            try {
                if (!silkTouch) {
                    dimension.setBlockType(block.location, "farmersdelight:rope");
                }
            }
            catch (error) {
                dimension.setBlockType(block.location, "farmersdelight:rope");
            }
        }
    }
    onRandomTick(args) {
        const block = args.block;
        const location = block.location;
        const dimension = args.dimension;
        const stage = block.permutation.getState('farmersdelight:stage');
        const directions = [
            { x: 0, z: -1 }, // N
            { x: 0, z: 1 }, // S
            { x: -1, z: 0 }, // E
            { x: 1, z: 0 } // W
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
                const rope = dimension.getBlock(pos)?.hasTag('rope');
                block.setPermutation(block.permutation.withState(`farmersdelight:${pos.direction}_connected`, Boolean(rope)));
            });
            const players = dimension.getPlayers();
            for (const player of players) {
                const playerLocation = player.location;
                const blockId = dimension.getBlock(playerLocation)?.typeId;
                if (!blockId)
                    return;
                if (blockId == "farmersdelight:rope") {
                    if (player.getViewDirection().y > 0) {
                        player.addEffect('levitation', 1 * 5, { amplifier: 0 });
                    }
                    if (player.getViewDirection().y < 0) {
                        player.addEffect('slow_falling', 1 * 5, { amplifier: 0 });
                    }
                }
            }
        }
        if (stage > 0) {
            const pos = { x: location.x, y: location.y - 1, z: location.z };
            const tomatoCrop = dimension.getBlock(pos)?.hasTag('tomato_crop');
            const tomatoCropWithRope = dimension.getBlock(pos)?.hasTag('tomato_crop_with_rope');
            const canGrow = block.permutation.getState('farmersdelight:can_grow');
            if ((!tomatoCrop) && (!tomatoCropWithRope)) {
                block.setPermutation(block.permutation.withState('farmersdelight:stage', 0));
                block.setPermutation(block.permutation.withState('farmersdelight:can_grow', true));
            }
        }
    }
}
export class RopeComponentRegister {
    register(args) {
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:rope', new RopeComponent());
    }
}
__decorate([
    methodEventSub(world.beforeEvents.worldInitialize),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WorldInitializeBeforeEvent]),
    __metadata("design:returntype", void 0)
], RopeComponentRegister.prototype, "register", null);
//# sourceMappingURL=RopeComponent.js.map