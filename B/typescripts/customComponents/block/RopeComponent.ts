import {
    BlockComponentPlayerBreakEvent,
    BlockComponentPlayerInteractEvent,
    BlockComponentRandomTickEvent,
    BlockComponentTickEvent,
    BlockCustomComponent,
    EntityInventoryComponent,
    EquipmentSlot,
    GameMode,
    Player,
} from "@minecraft/server";
import { isEnchanted, takeItem } from "../../lib/ItemUtil";
import { blockComponent, subscribeEvent } from "../../lib/EventSubscriber";
import { spawnLootAtBlock } from "../../lib/LootUtil";
import { getEquipment } from "../../lib/EntityUtil";
import { KnownBlockStates } from "../../data/KnownBlockStates";
import { PlayerTickEvent } from "../../lib/Events";

@blockComponent("farmersdelight:rope")
export class RopeComponent implements BlockCustomComponent {
    constructor() {
        this.onTick = this.onTick.bind(this);
        this.onRandomTick = this.onRandomTick.bind(this);
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
        this.onPlayerBreak = this.onPlayerBreak.bind(this);
    }
    onPlayerInteract(args: BlockComponentPlayerInteractEvent): void {
        const block = args.block;
        const player = args.player;
        const dimension = args.dimension
        
        if (!player) return;
        const inventory = player?.getComponent("inventory") as EntityInventoryComponent;
        const container = inventory?.container;
        const itemId = container?.getSlot(player.selectedSlotIndex).typeId
        const stage = Number(block.permutation.getState("farmersdelight:stage"))
        const random = Math.floor(Math.random() * 101)
        try {
            if (itemId == "minecraft:bone_meal" && stage < 4) {
                dimension.playSound("item.bone_meal.use", block.location)
                if (player?.getGameMode() ==  GameMode.Creative) {
                    block.dimension.spawnParticle("minecraft:crop_growth_emitter", { x: block.location.x + 0.5, y: block.location.y + 0.5, z: block.location.z + 0.5 });
                    block.setPermutation(block.permutation.withState("farmersdelight:stage", 4))
                }
                else {
                    if (random <= 60) {
                        block.setPermutation(block.permutation.withState("farmersdelight:stage", stage + 1))
                    }
                    block.dimension.spawnParticle("minecraft:crop_growth_emitter", { x: block.location.x + 0.5, y: block.location.y + 0.5, z: block.location.z + 0.5 });
                    if (!container) return;
                    takeItem(container, player?.selectedSlotIndex, 1);
                }

            }
            if (stage == 4) {
                block.setPermutation(block.permutation.withState("farmersdelight:stage", 1))
                spawnLootAtBlock(block, "farmersdelight/crops/farmersdelight_tomato_riped")
            }
        } catch (error) {

        }

    }
    onPlayerBreak(args: BlockComponentPlayerBreakEvent): void {
        const player = args.player;
        if (!player) return;
        if ((args.brokenBlockPermutation.getState("farmersdelight:stage") ?? 0) > 0 && !isEnchanted(getEquipment(player, EquipmentSlot.Mainhand), "silk_touch")) {
            args.block.setType("farmersdelight:rope");
        }
       
    }
    onRandomTick(args: BlockComponentRandomTickEvent): void {
        const block = args.block;
        const location = block.location;
        const dimension = args.dimension;
        const stage = block.permutation.getState('farmersdelight:stage') as number;
        const directions = [
            { x: 0, z: -1 },  // N
            { x: 0, z: 1 },   // S
            { x: -1, z: 0 },  // E
            { x: 1, z: 0 }    // W
        ];

        const hasRopeAround = directions.some(({ x, z }) =>
            dimension.getBlock({ x: location.x + x, y: location.y, z: location.z + z })?.hasTag("rope")
        );
        const blockBelow = dimension.getBlock({ x: location.x, y: location.y - 1, z: location.z });
        const tomatoCrop = blockBelow?.hasTag('tomato_crop');
        const tomatoCropWithRope = blockBelow?.hasTag('tomato_crop_with_rope');
        
        const canGrow = dimension.getBlock({ x: location.x, y: location.y - 1, z: location.z })?.permutation.getState('farmersdelight:can_grow') as boolean;


        if (stage > 0 && stage < 4) {
            block.setPermutation(block.permutation.withState('farmersdelight:stage', stage + 1));
        }

        if (tomatoCrop && (stage == 0 )&& !hasRopeAround) {
            block.setPermutation(block.permutation.withState('farmersdelight:stage', 1));
        }
        if (canGrow && tomatoCropWithRope&&(stage == 0) && !hasRopeAround) {
            block.setPermutation(block.permutation.withState('farmersdelight:stage', 1));
            block.setPermutation(block.permutation.withState('farmersdelight:can_grow', false));
        }

    }
    onTick(args: BlockComponentTickEvent): void {
        const block = args.block;
        const location = block.location;
        const dimension = args.dimension;
        const stage = block.permutation.getState('farmersdelight:stage') as number;
        if (stage == 0) {
            const ropePositions = [
                { x: location.x, y: location.y, z: location.z - 1, direction: 'north' },
                { x: location.x, y: location.y, z: location.z + 1, direction: 'south' },
                { x: location.x - 1, y: location.y, z: location.z, direction: 'east' },
                { x: location.x + 1, y: location.y, z: location.z, direction: 'west' }
            ];

            ropePositions.forEach(pos => {
                const rope = dimension.getBlock(pos)?.hasTag("rope") ?? false;
                block.setPermutation(block.permutation.withState(`farmersdelight:${pos.direction}_connected` as keyof KnownBlockStates, rope));
            })
        } else {
            const tomato = block.below();
            if (!tomato || !tomato.hasTag("tomato_crop") && !tomato.hasTag("tomato_crop_with_rope")) {
                block.setPermutation(block.permutation.withState('farmersdelight:stage', 0));
                block.setPermutation(block.permutation.withState('farmersdelight:can_grow', true));
            }
        }
    }

    @subscribeEvent(PlayerTickEvent)
    static simulateClimbing(player: Player) {
        if (player.dimension.getBlock(player.location)?.getComponent("farmersdelight:rope")) {
            const pitch = player.getViewDirection().y;
            if (pitch > 0) {
                player.addEffect("levitation", 5, { showParticles: false });
            } else if (pitch < 0) {
                player.addEffect("slow_falling", 5, { showParticles: false });

            }
        }
    }
}
