import {
    BlockPermutation,
    CustomComponentParameters,
    Direction,
    Entity,
    EntityComponentTypes,
    EquipmentSlot,
    GameMode,
    ItemComponentMineBlockEvent,
    ItemComponentTypes,
    ItemComponentUseOnEvent,
    ItemCustomComponent,
    ItemStack,
    Player,
    StartupEvent,
    system,
} from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { EntityUtil } from "../../lib/EntityUtil";
import { toVector3 } from "../../lib/DirectionUtil";

export type BlockLoot = (stack: ItemStack, state: BlockPermutation) => string | undefined;

function blockLoot(table: string): BlockLoot {
    return (_, __) => table;
}

const STRAW_FROM_GRASS: BlockLoot = blockLoot("farmersdelight/straw_from_grass");
const STRAW_FROM_WHEAT: BlockLoot = (_, state) =>
    state.getState("growth") === 7 ? "farmersdelight/straw" : undefined;
const STRAW_FROM_RICE: BlockLoot = (_, state) =>
    state.getState("farmersdelight:growth") === 3 ? "farmersdelight/straw" : undefined;

export const BLOCK_LOOT_TABLE: Map<string, BlockLoot> = new Map([
    ["minecraft:tallgrass", STRAW_FROM_GRASS],
    ["minecraft:short_grass", STRAW_FROM_GRASS],
    ["minecraft:fern", STRAW_FROM_GRASS],
    ["minecraft:wheat", STRAW_FROM_WHEAT],
    ["minecraft:rice_block_upper", STRAW_FROM_RICE],
    ["minecraft:sandy_shrub_block", blockLoot("farmersdelight/straw_from_sandy_shrub")],
]);

function hurtEquippedItem(entity: Entity, stack?: ItemStack, slot: EquipmentSlot = EquipmentSlot.Mainhand) {
    const durability = stack?.getComponent(ItemComponentTypes.Durability);
    if (durability && durability.maxDurability > durability.damage) {
        ++durability.damage;
        entity.getComponent(EntityComponentTypes.Equippable)?.setEquipment(slot, stack);
    } else {
        entity.getComponent(EntityComponentTypes.Equippable)?.setEquipment(slot, undefined);
    }
}

class KnifeComponent implements ItemCustomComponent {
    onMineBlock(event: ItemComponentMineBlockEvent, params: CustomComponentParameters) {
        const stack = event.itemStack;
        if (!stack) return;
        const entity = event.source;
        if (entity ! instanceof Player || (entity as Player).getGameMode() !== GameMode.Creative) {
            hurtEquippedItem(entity, stack);
            const permutation = event.minedBlockPermutation;
            const loot = BLOCK_LOOT_TABLE.get(permutation.type.id)?.(stack, permutation);
            if (loot) {
                const { dimension, x, y, z } = event.block;
                dimension.runCommand(`loot spawn ${x} ${y} ${z} loot "${loot}"`);
            }
        }
    }

    onUseOn(event: ItemComponentUseOnEvent, params: CustomComponentParameters) {
        const block = event.block;
        if (block.typeId !== "minecraft:pumpkin") return;
        const entity = event.source;
        if (entity ! instanceof Player || (entity as Player).getGameMode() !== GameMode.Creative) {
            hurtEquippedItem(entity, event.itemStack);
        }
        const face = event.blockFace;
        const direction = face === Direction.Up || face === Direction.Down
            ? EntityUtil.cardinalDirection(entity) ?? Direction.North
            : face;
        const vector = toVector3(direction);
        block.setPermutation(
            BlockPermutation.resolve("minecraft:carved_pumpkin", {
                "minecraft:cardinal_direction": direction.toLowerCase(),
            }),
        );
        const { dimension, x, y, z } = block;
        dimension.playSound("pumpkin.carve", block);
        const item = dimension.spawnItem(new ItemStack("minecraft:pumpkin_seeds", 4), {
            x: x + 0.5 + vector.x * 0.65,
            y: y + 0.1,
            z: z + 0.5 + vector.z * 0.65,
        });
        if (item) {
            item.clearVelocity();
            item.applyImpulse({
                x: 0.05 * vector.x + Math.random() * 0.02,
                y: 0.05,
                z: 0.05 * vector.z + Math.random() * 0.02,
            });
        }
    }

    @methodEventSub(system.beforeEvents.startup)
    static init(args: StartupEvent) {
        args.itemComponentRegistry.registerCustomComponent("farmersdelight:knife", new KnifeComponent());
    }
}

void KnifeComponent;
