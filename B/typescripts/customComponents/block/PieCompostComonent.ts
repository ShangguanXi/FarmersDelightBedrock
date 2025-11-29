import {
    BlockComponentPlayerInteractEvent,
    BlockCustomComponent,
    CustomComponentParameters, EntityComponentTypes,
    ItemStack,
    PlayerBreakBlockBeforeEvent,
    system,
    world,
} from "@minecraft/server";
import { hurtEquippedItem, isEnchanted, spawnStack } from "../../lib/ItemUtil";
import { blockComponent, subscribeEvent } from "../../lib/EventSubscriber";
import { KnownTypedBlockStateKeys } from "../../data/KnownBlockStates";
import { resolveSpec } from "../../lib/ObjectUtil";

type Identifier = string;
type Duration = number;
type Amplifier = number
type Effect = [Identifier, Duration, Amplifier?]
export type PieSpec = {
    item: string;
    nutrition:number;
    saturation_modifier:number;
    effects: Effect[];
    state: {
        name: KnownTypedBlockStateKeys<number>;
        max_use: number
        min_use?: number
    }
}

@blockComponent("farmersdelight:pie")
export class PieComponent implements BlockCustomComponent {
    onPlayerInteract(args: BlockComponentPlayerInteractEvent, param: CustomComponentParameters): void {
        const params = param.params as PieSpec;
        const player = args.player
        if (!player) return
        const isSneaking = player?.isSneaking
        if (isSneaking) return
        const inventory = player?.getComponent("inventory");
        if (!inventory) return
        const block = args.block
        const container = inventory?.container;
        const itemStack = container.getItem(player.selectedSlotIndex)
        const state = block.permutation.getState(params.state.name) as number
        if (!itemStack?.hasTag("farmersdelight:is_knife")) {
            block.dimension.playSound("random.eat", block);
            if (state != (params.state.max_use)) block.setPermutation(block.permutation.withState(params.state.name, state + 1));
            else block.setType("minecraft:air");
            const hunger = player.getComponent(EntityComponentTypes.Hunger);
            const saturation = player.getComponent(EntityComponentTypes.Saturation);
            const nutrition= params.nutrition
            const saturation_modifier= params.saturation_modifier
            hunger?.setCurrentValue(hunger.currentValue + nutrition > hunger.effectiveMax
                ? hunger.effectiveMax
                : hunger.currentValue + nutrition,
            );
            saturation?.setCurrentValue(saturation.currentValue + saturation_modifier * nutrition * 2 > saturation.effectiveMax
                ? saturation.effectiveMax
                : saturation.currentValue + saturation_modifier * nutrition * 2,
            );
            for (const [id, time, amplifier = 0] of params.effects) {
                player.addEffect(id, time, { amplifier: amplifier })
            }
            return
        }
        block.dimension.playSound("use.cloth", block);
        block.dimension.spawnItem(new ItemStack(params.item), block.center());
        if (state != (params.state.max_use)) block.setPermutation(block.permutation.withState(params.state.name, state + 1));
        else block.setType("minecraft:air");
    }

    @subscribeEvent(world.beforeEvents.playerBreakBlock)
    static performSilkTouch(event: PlayerBreakBlockBeforeEvent) {
        const block = event.block;
        const limit = resolveSpec<PieSpec>(block, "farmersdelight:pie")?.state;
        if (!limit) return;
        const stack = event.itemStack;
        if (!isEnchanted(stack, "silk_touch")) return;
        if ((block.permutation.getState(limit.name) ?? 0) > (limit.min_use ?? 0)) return;
        const player = event.player;
        system.run(() => {
            spawnStack(new ItemStack(block.typeId), block);
            block.setType("minecraft:air");
            hurtEquippedItem(player, stack);
        });
        event.cancel = true;
    }
}