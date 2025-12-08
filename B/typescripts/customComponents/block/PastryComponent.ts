import {
    Block,
    BlockComponentPlayerBreakEvent,
    BlockComponentPlayerInteractEvent,
    BlockCustomComponent,
    BlockPermutation,
    CustomComponentParameters,
    EntityComponentTypes,
    EquipmentSlot,
    GameMode,
    ItemComponentTypes,
    ItemStack,
    Player,
    PlayerBreakBlockBeforeEvent,
    system,
    world,
} from "@minecraft/server";
import { blockComponent, subscribeEvent } from "../../lib/EventSubscriber";
import { KnownTypedBlockStateKeys } from "../../data/KnownBlockStates";
import { getEquipment, increaseAttribute } from "../../lib/EntityUtil";
import { resolveSpec } from "../../lib/ObjectUtil";
import { applyConsumeEffects, ConsumeEffectsSpec } from "../item/ConsumeEffectsComponent";
import { isEnchanted } from "../../lib/ItemUtil";

export type PastrySpec = {
    slice: string;
    counter: KnownTypedBlockStateKeys<number>;
    servings: number;
    seals?: number;
}

/**
 * TODO: use {@link Player#eatItem}
 */
function eatItem(player: Player, stack: ItemStack) {
    const food = stack.getComponent(ItemComponentTypes.Food);
    if (food) {
        const nutrition = food.nutrition;
        increaseAttribute(player, EntityComponentTypes.Hunger, nutrition);
        increaseAttribute(player, EntityComponentTypes.Saturation, 2 * nutrition * food.saturationModifier);
    }
    const effects = resolveSpec<ConsumeEffectsSpec>(stack, "farmersdelight:consume_effects");
    if (effects) {
        applyConsumeEffects(player, effects);
    }
}

function dropSlices(block: Block, permutation: BlockPermutation, spec: PastrySpec) {
    const amount = spec.servings + (spec.seals ?? 0) - (permutation.getState(spec.counter) ?? 0);
    if (amount > 0) {
        block.dimension.spawnItem(new ItemStack(spec.slice, amount), block.center());
    }
}

@blockComponent("farmersdelight:pastry")
export class PastryComponent implements BlockCustomComponent {
    onPlayerInteract(event: BlockComponentPlayerInteractEvent, param: CustomComponentParameters): void {
        const player = event.player;
        if (!player) return;
        const spec = param.params as PastrySpec;
        const block = event.block;
        const permutation = block.permutation;
        const state = permutation.getState(spec.counter) ?? 0;
        const bites = state - (spec.seals ?? 0);
        if (bites < 0) return;
        if (getEquipment(player, EquipmentSlot.Mainhand)?.hasTag("farmersdelight:is_knife")) {
            const dimension = event.dimension;
            const pos = block.center();
            dimension.spawnItem(new ItemStack(spec.slice), pos);
            dimension.playSound("use.cloth", pos);
        } else {
            eatItem(player, new ItemStack(spec.slice));
            event.dimension.playSound("random.eat", player.getHeadLocation());
        }
        if (bites + 1 < spec.servings) {
            block.setPermutation(permutation.withState(spec.counter, state + 1));
        } else {
            block.setType("minecraft:air");
        }
    }

    onPlayerBreak(event: BlockComponentPlayerBreakEvent, param: CustomComponentParameters): void {
        const player = event.player;
        if (!player || player.getGameMode() === GameMode.Creative) return;
        const stack = getEquipment(player, EquipmentSlot.Mainhand);
        if (stack?.hasTag("farmersdelight:is_knife")) {
            dropSlices(event.block, event.brokenBlockPermutation, param.params as PastrySpec);
        }
    }

    @subscribeEvent(world.beforeEvents.playerBreakBlock)
    static preventSilkTouch(event: PlayerBreakBlockBeforeEvent) {
        const stack = event.itemStack;
        if (!isEnchanted(stack, "silk_touch")) return;
        const block = event.block;
        const spec = resolveSpec<PastrySpec>(block, "farmersdelight:pastry");
        if (spec) {
            // 假装精准采集不存在
            if (stack?.hasTag("farmersdelight:is_knife")) {
                const permutation = block.permutation;
                system.run(() => {
                    dropSlices(block, permutation, spec);
                    block.setType("minecraft:air");
                });
            } else {
                system.run(() => block.setType("minecraft:air"));
            }
            event.cancel = true;
        }
    }
}