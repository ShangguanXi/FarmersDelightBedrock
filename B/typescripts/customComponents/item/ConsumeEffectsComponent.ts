import { itemComponent } from "../../lib/EventSubscriber";
import {
    CustomComponentParameters, EffectType,
    Entity,
    EntityEffectOptions,
    ItemComponentConsumeEvent,
    ItemCustomComponent,
} from "@minecraft/server";

export interface EffectEntrySpec extends EntityEffectOptions {
    effect: EffectType | string;
    duration: number;
    chance?: number;
}

export type ConsumeEffectsSpec = EffectEntrySpec[]

export function applyConsumeEffects(entity: Entity, spec: ConsumeEffectsSpec) {
    for (const entry of spec) {
        const chance = entry.chance ?? 1;
        if (chance >= 1 || Math.random() < chance) {
            entity.addEffect(entry.effect, entry.duration, entry);
        }
    }
}

@itemComponent("farmersdelight:consume_effects")
export class ConsumeEffectsComponent implements ItemCustomComponent {
    onConsume(event: ItemComponentConsumeEvent, params: CustomComponentParameters) {
        applyConsumeEffects(event.source, params.params as ConsumeEffectsSpec);
    }
}