import {
    Block,
    BlockComponentPlayerBreakEvent,
    BlockComponentPlayerInteractEvent,
    BlockComponentPlayerPlaceBeforeEvent,
    BlockComponentRandomTickEvent,
    BlockCustomComponent,
    CustomComponentParameters,
    EquipmentSlot,
    GameMode,
    ItemStack,
    world,
} from "@minecraft/server";
import { hurtItemInSlot, isEnchanted } from "../../lib/ItemUtil";
import { blockComponent } from "../../lib/EventSubscriber";
import { volumeAround } from "../../lib/BlockUtil";
import { randomInt } from "../../lib/RandomUtil";
import { getEquipment, getEquipmentSlot } from "../../lib/EntityUtil";
import { playBoneMealEffect } from "./CropComponent";

type MushroomClusterSpec = {
    readonly maturity: number;
    readonly mushroom: string;
    readonly harvest?: string;
    readonly mushtree?: string;
    readonly offset?: [number, number, number];
}

const MUSHROOM_GROW_BLOCK: Set<string> = new Set([
    "minecraft:mycelium",
    "minecraft:podzol",
    "minecraft:crimson_nylium",
    "minecraft:warped_nylium",
]);

function getMaturity(spec: MushroomClusterSpec) {
    return spec.maturity ?? 4;
}

function growMushtree(block: Block, mushtree: string, offset?: [number, number, number]) {
    world.structureManager.place(mushtree, block.dimension, offset ? {
        x: block.x + offset[0],
        y: block.y + offset[1],
        z: block.z + offset[2],
    } : block);
}

function canPlaceAt(block: Block): boolean | undefined {
    const field = block.below();
    return field && (MUSHROOM_GROW_BLOCK.has(field.typeId) || field.hasTag("mushroom_grow_block"));
}

@blockComponent("farmersdelight:mushroom_cluster")
export class MushroomClusterComponent implements BlockCustomComponent {
    beforeOnPlayerPlace(event: BlockComponentPlayerPlaceBeforeEvent, params: CustomComponentParameters): void {
        if (canPlaceAt(event.block)) {
            event.permutationToPlace = event.permutationToPlace.withState(
                "farmersdelight:growth",
                getMaturity(params.params as MushroomClusterSpec),
            );
        } else {
            event.cancel = true;
        }
    }

    onPlayerInteract(event: BlockComponentPlayerInteractEvent, params: CustomComponentParameters): void {
        const { block, player } = event;
        const slot = getEquipmentSlot(player, EquipmentSlot.Mainhand);
        const stack = slot?.getItem();
        switch (stack?.typeId) { // assert player && slot && stack
            case "minecraft:bone_meal": {
                const spec = params.params as MushroomClusterSpec;
                const permutation = block.permutation;
                const age = permutation.getState("farmersdelight:growth");
                if (age === 0) {
                    const mushtree = spec.mushtree;
                    if (mushtree) {
                        if (Math.random() < 0.4) {
                            growMushtree(block, mushtree, spec.offset);
                        }
                        break;
                    }
                }
                const maturity = getMaturity(spec);
                if (age === undefined || age >= maturity) return;
                block.setPermutation(permutation.withState(
                    "farmersdelight:growth",
                    Math.min(Math.random() < 0.5 ? age + 2 : age + 1, maturity),
                ));
                break;
            }
            case "minecraft:rapid_fertilizer": {
                const spec = params.params as MushroomClusterSpec;
                const permutation = block.permutation;
                const age = permutation.getState("farmersdelight:growth");
                if (age === 0) {
                    const mushtree = spec.mushtree;
                    if (mushtree) {
                        growMushtree(block, mushtree, spec.offset);
                        break;
                    }
                }
                const maturity = getMaturity(spec);
                if (age === undefined || age >= maturity) return;
                block.setPermutation(permutation.withState("farmersdelight:growth", maturity));
                break;
            }
            default:
                const mushroom = (params.params as MushroomClusterSpec).mushroom;
                if (mushroom && stack?.hasTag("minecraft:is_shears")) {
                    const permutation = block.permutation;
                    const age = permutation.getState("farmersdelight:growth");
                    if (age) {
                        const dimension = block.dimension;
                        dimension.spawnItem(new ItemStack(mushroom), block.bottomCenter());
                        block.setPermutation(permutation.withState("farmersdelight:growth", age - 1));
                        dimension.playSound("mob.sheep.shear", block.center());
                        if (player!!.getGameMode() !== GameMode.Creative) {
                            hurtItemInSlot(slot!!, stack);
                        }
                    }
                }
                return;
        }
        playBoneMealEffect(block);
        if (player!!.getGameMode() === GameMode.Creative) return;
        const amount = stack!!.amount - 1;
        if (amount) {
            slot!!.amount = amount;
        } else {
            slot!!.setItem(undefined);
        }
    }

    onPlayerBreak(event: BlockComponentPlayerBreakEvent, params: CustomComponentParameters): void {
        const player = event.player;
        if (!player || player.getGameMode() === GameMode.Creative) return;
        const stack = getEquipment(player, EquipmentSlot.Mainhand);
        if (isEnchanted(stack, "silk_touch")) return; // 原版强行处理了精准采集
        const age = event.brokenBlockPermutation.getState("farmersdelight:growth") ?? 0;
        const spec = params.params as MushroomClusterSpec;
        if (stack && age === getMaturity(spec) && stack.hasTag("minecraft:is_shears")) {
            const harvest = spec.harvest;
            if (harvest) {
                event.dimension.spawnItem(new ItemStack(harvest), event.block.bottomCenter());
                // 原版剪刀的耐久是原版扣的
                return;
            }
        }
        const mushroom = spec.mushroom;
        if (mushroom) {
            event.dimension.spawnItem(new ItemStack(mushroom, age + 1), event.block.bottomCenter());
        }
    }

    onRandomTick(event: BlockComponentRandomTickEvent, params: CustomComponentParameters): void {
        const block = event.block;
        const age = block.permutation.getState("farmersdelight:growth");
        if (!age) {
            if (Math.random() >= 0.04) return;
            const dimension = block.dimension;
            const mushroom = (params.params as MushroomClusterSpec).mushroom;
            if (block.dimension.getBlocks(
                volumeAround(block, 4, 1, 4),
                { includeTypes: mushroom ? [block.typeId, mushroom] : [block.typeId] },
                true,
            ).getCapacity() >= 5) return;
            let destination: Block | undefined = undefined;
            const pos = block.location;
            for (let i = 0, { x, y, z } = pos; i < 5; ++i) {
                pos.x = x + randomInt(3) - 1;
                pos.y = y + randomInt(2) - randomInt(2);
                pos.z = z + randomInt(3) - 1;
                destination = dimension.getBlock(pos);
                if (destination?.isAir && canPlaceAt(destination)) {
                    x = pos.x;
                    y = pos.y;
                    z = pos.z;
                } else {
                    destination = undefined;
                }
            }
            if (destination) {
                const field = destination.below();
                if (field?.typeId?.startsWith("minecraft:")) {
                    destination.setType(mushroom);
                } else {
                    destination.setPermutation(block.permutation);
                }
            }
        } else if (age < getMaturity(params.params as MushroomClusterSpec)
            && Math.random() < 0.25
            && block.below()?.hasTag("farmersdelight:mushroom_cluster_habitat")
        ) {
            console.info("grow");
            block.setPermutation(block.permutation.withState("farmersdelight:growth", age + 1));
        }
    }
}
