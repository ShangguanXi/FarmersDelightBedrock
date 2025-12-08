import {
    BlockComponentPlayerInteractEvent,
    BlockCustomComponent,
    CustomComponentParameters,
    EntityComponentTypes,
    EquipmentSlot,
    ItemStack,
} from "@minecraft/server";
import { blockComponent } from "../../lib/EventSubscriber";
import { KnownTypedBlockStateKeys } from "../../data/KnownBlockStates";
import { getEquipment, increaseAttribute } from "../../lib/EntityUtil";

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

/**
 * @deprecated
 */
@blockComponent("farmersdelight:pie")
export class PieComponent implements BlockCustomComponent {
    onPlayerInteract(args: BlockComponentPlayerInteractEvent, param: CustomComponentParameters): void {
        const player = args.player;
        if (!player) return;
        const params = param.params as PieSpec;
        const block = args.block
        const state = block.permutation.getState(params.state.name) ?? 0;
        if (state < (params.state.min_use ?? 0)) return;
        if (getEquipment(player, EquipmentSlot.Mainhand)?.hasTag("farmersdelight:is_knife")) {
            block.dimension.spawnItem(new ItemStack(params.item), block.center());
            block.dimension.playSound("use.cloth", block);
        } else {
            const nutrition= params.nutrition
            increaseAttribute(player, EntityComponentTypes.Hunger, nutrition);
            increaseAttribute(player, EntityComponentTypes.Saturation, 2 * nutrition * params.saturation_modifier);
            for (const [id, time, amplifier = 0] of params.effects) {
                player.addEffect(id, time, { amplifier: amplifier })
            }
            block.dimension.playSound("random.eat", block);
        }
        if (state < params.state.max_use) {
            block.setPermutation(block.permutation.withState(params.state.name, state + 1));
        } else {
            block.setType("minecraft:air");
        }
    }
}