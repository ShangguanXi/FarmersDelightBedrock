import {
    BlockComponentPlayerInteractEvent,
    BlockComponentPlayerPlaceBeforeEvent,
    CustomComponentParameters,
    EntityComponentTypes,
    GameMode,
    ItemStack,
} from "@minecraft/server";
import { convertItemInSlot, giveItem, hurtItem } from "../../lib/ItemUtil";
import { blockComponent } from "../../lib/EventSubscriber";
import { BlockEntityComponent } from "./BlockEntityComponent";

@blockComponent("farmersdelight:stove")
export class StoveComponent extends BlockEntityComponent {
    beforeOnPlayerPlace(event: BlockComponentPlayerPlaceBeforeEvent, _: CustomComponentParameters): void {
        event.permutationToPlace = event.permutationToPlace.withState("farmersdelight:is_working", true);
    }

    onPlayerInteract(event: BlockComponentPlayerInteractEvent): void {
        const player = event.player;
        const container = player?.getComponent(EntityComponentTypes.Inventory)?.container;
        if (!container) return;
        const selected = container!!.getSlot(player!!.selectedSlotIndex);
        const stack = selected.getItem();
        const block = event.block;
        const lit = block.permutation.getState("farmersdelight:is_working");
        const dimension = event.dimension;
        if (stack?.typeId == "minecraft:water_bucket" && lit) {
            const limited = player!!.getGameMode() !== GameMode.Creative;
            let remaining: ItemStack | undefined = new ItemStack("minecraft:bucket");
            if (limited) {
                remaining = convertItemInSlot(selected, remaining);
            }
            giveItem(player, remaining, container);
            block.setPermutation(block.permutation.withState('farmersdelight:is_working', false));
            dimension.playSound("random.fizz", block);
        };
        if (stack?.hasTag("minecraft:is_shovel") && lit) {
            hurtItem(container, player.selectedSlotIndex, 1);
            block.setPermutation(block.permutation.withState('farmersdelight:is_working', false));
            dimension.playSound("random.fizz", block);
        };
        if (stack?.typeId == "minecraft:flint_and_steel" && !lit) {
            hurtItem(container, player.selectedSlotIndex, 1);
            block.setPermutation(block.permutation.withState('farmersdelight:is_working', true));
            dimension.playSound("fire.ignite", block);
        };
    }
        
}
