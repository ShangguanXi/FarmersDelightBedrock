import {
    BlockComponentPlayerInteractEvent,
    BlockCustomComponent,
    EntityInventoryComponent,
    ItemStack,
    StartupEvent,
    system,
} from "@minecraft/server";
import { consumeItem, hurtItem } from "../../lib/ItemUtil";
import { subscribeEvent } from "../../lib/EventSubscriber";

export class StoveComponent implements BlockCustomComponent {
    constructor() {
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
    }

    onPlayerInteract(args: BlockComponentPlayerInteractEvent): void {
        const player = args.player;
        const dimension = args.dimension;
        const block = args.block;
        const inventory = player?.getComponent("inventory") as EntityInventoryComponent;
        const container = inventory?.container;
        const { x, y, z } = args.block.location; if (!player) return;
        const itemStack = container?.getItem(player.selectedSlotIndex);
        if (!container) return
        if (!itemStack) return
        if (itemStack.typeId == "farmersdelight:skillet" ||itemStack.typeId == "farmersdelight:cooking_pot") return
        if (itemStack.typeId == "minecraft:water_bucket" && block.permutation.getState('farmersdelight:is_working') == true) {
            consumeItem(player, container, player.selectedSlotIndex, new ItemStack("minecraft:bucket"));
            block.setPermutation(block.permutation.withState('farmersdelight:is_working', false));
            dimension.playSound("random.fizz",{ x, y, z })
        };
        if (itemStack.hasTag("minecraft:is_shovel") && block.permutation.getState('farmersdelight:is_working') == true) {
            hurtItem(container, player.selectedSlotIndex, 1);
            block.setPermutation(block.permutation.withState('farmersdelight:is_working', false));
            dimension.playSound("random.fizz",{ x, y, z })
        };
        if (itemStack.typeId == "minecraft:flint_and_steel"&& block.permutation.getState('farmersdelight:is_working') == false) {
            hurtItem(container, player.selectedSlotIndex, 1);
            block.setPermutation(block.permutation.withState('farmersdelight:is_working', true));
            dimension.playSound("fire.ignite",{ x, y, z })
        };
    }
        
}
export class StoveComponentRegister{
    @subscribeEvent(system.beforeEvents.startup)
    register(args:StartupEvent){
        args.blockComponentRegistry.registerCustomComponent('farmersdelight:stove', new StoveComponent());
    }
  
}
