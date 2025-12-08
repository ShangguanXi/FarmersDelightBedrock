var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { EntityComponentTypes, GameMode, ItemStack, ItemTypes, world, } from "@minecraft/server";
import { blockComponent } from "../../lib/EventSubscriber";
function requiresItem(tagOrId) {
    return "farmersdelight.blockfood." + (tagOrId[0] === "#" ? tagOrId.substring(1) : tagOrId);
}
function isInvalidItem(slot, tagOrId) {
    const stack = slot.getItem();
    if (!stack)
        return true;
    return tagOrId[0] === "#" ? !stack.hasTag(tagOrId.substring(1)) : stack.typeId !== tagOrId;
}
let DishComponent = class DishComponent {
    onPlayerInteract(event, params) {
        const spec = params.params;
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
        if (spec.utensil) {
            if (!player)
                return;
            const slot = container?.getSlot(player.selectedSlotIndex);
            if (!slot || isInvalidItem(slot, spec.utensil)) {
                player.onScreenDisplay.setActionBar({ translate: requiresItem(spec.utensil) });
                return;
            }
            if (player.getGameMode() !== GameMode.Creative) {
                const amount = slot.amount - 1;
                if (amount) {
                    slot.amount = amount;
                }
                else {
                    slot.setItem(undefined);
                }
            }
        }
        let content = spec.contents;
        if (Array.isArray(content)) {
            content = content[consumed];
            if (!content) {
                content = spec.contents[0];
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
        }
        else {
            block.dimension.spawnItem(new ItemStack(item), block.bottomCenter());
        }
        if (consumed + 1 < servings || spec.has_leftovers) {
            block.setPermutation(permutation.withState("farmersdelight:food_block_stage", consumed + 1));
        }
        else {
            block.setType("minecraft:air");
        }
    }
};
DishComponent = __decorate([
    blockComponent("farmersdelight:dish")
], DishComponent);
export { DishComponent };
