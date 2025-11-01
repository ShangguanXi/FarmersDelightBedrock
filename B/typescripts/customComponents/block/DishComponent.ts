import {
    BlockComponentPlayerInteractEvent,
    BlockCustomComponent,
    ContainerSlot,
    CustomComponentParameters,
    EntityComponentTypes,
    GameMode,
    ItemStack, ItemTypes,
    StartupEvent,
    system, world,
} from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";

interface DishSpec {
    has_leftovers?: boolean,
    servings?: number
    contents?: string | string[],
    utensil?: string // allows #tag
}

function requiresItem(tagOrId: string): string {
    return "farmersdelight.blockfood." + (tagOrId[0] === "#" ? tagOrId.substring(1) : tagOrId); // sic
}

function isInvalidItem(slot: ContainerSlot, tagOrId: string): boolean {
    const stack = slot.getItem();
    if (!stack) return true;
    return tagOrId[0] === "#" ? !stack.hasTag(tagOrId.substring(1)) : stack.typeId !== tagOrId;
}

export class DishComponent implements BlockCustomComponent {
    onPlayerInteract(event: BlockComponentPlayerInteractEvent, params: CustomComponentParameters) {
        const spec = params.params as DishSpec;
        const servings = spec.servings ?? 1;
        const player = event.player;
        const container = player?.getComponent(EntityComponentTypes.Inventory)?.container;
        const block = event.block;
        const permutation = block.permutation;
        const consumed = permutation.getState("farmersdelight:food_block_stage") ?? servings;
        if (consumed >= servings && spec.has_leftovers) {
            const stacks = world.getLootTableManager().generateLootFromBlockPermutation(permutation);
            if (stacks) {
                const dimension = block.dimension;
                const pos = block.bottomCenter();
                for (const stack of stacks) {
                    dimension.spawnItem(stack, pos);
                }
            }
            block.setType("minecraft:air");
            return;
        }
        let slot: ContainerSlot | undefined;
        if (spec.utensil) {
            if (!player) return;
            slot = container?.getSlot(player.selectedSlotIndex);
            if (!slot || isInvalidItem(slot, spec.utensil)) {
                player.onScreenDisplay.setActionBar({ translate: requiresItem(spec.utensil) });
                return;
            }
        }
        let content = spec.contents;
        if (Array.isArray(content)) {
            content = content[consumed];
            if (!content) {
                // 这里要不要打个日志
                content = (spec.contents as string[])[0];
            }
        }
        const item = content ? ItemTypes.get(content) : undefined;
        if (!item) {
            console.warn("Filed to fetch item indexed", consumed);
            return;
        }
        if (container) {
            const remaining = container.addItem(new ItemStack(item));
            if (remaining) {
                block.dimension.spawnItem(remaining, block.bottomCenter());
            }
        } else {
            block.dimension.spawnItem(new ItemStack(item), block.bottomCenter());
        }
        if (consumed + 1 < servings || spec.has_leftovers) {
            block.setPermutation(permutation.withState("farmersdelight:food_block_stage", consumed + 1));
        } else {
            block.setType("minecraft:air");
        }
        if (!slot || player?.getGameMode() === GameMode.Creative) return;
        const amount = slot.amount - 1;
        if (amount) {
            slot.amount = amount;
        } else {
            slot.setItem(undefined);
        }
    }

    @methodEventSub(system.beforeEvents.startup)
    static init(event: StartupEvent) {
        event.blockComponentRegistry.registerCustomComponent("farmersdelight:dish", new DishComponent());
    }
}

void DishComponent;