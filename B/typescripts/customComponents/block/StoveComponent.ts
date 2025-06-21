import { BlockCustomComponent, BlockComponentPlayerInteractEvent, StartupEvent, system, world, Dimension, Vector3, Block, ItemStack, Player, EntityInventoryComponent } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { ItemUtil } from "../../lib/ItemUtil";

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
            const bucket = new ItemStack("minecraft:bucket")
            ItemUtil.replaceItem(player, player.selectedSlotIndex, bucket)
            block.setPermutation(block.permutation.withState('farmersdelight:is_working', false));
            dimension.playSound("random.fizz",{ x, y, z })
        };
        if (itemStack.hasTag("minecraft:is_shovel") && block.permutation.getState('farmersdelight:is_working') == true) {
            ItemUtil.damageItem(container,player.selectedSlotIndex)
            block.setPermutation(block.permutation.withState('farmersdelight:is_working', false));
            dimension.playSound("random.fizz",{ x, y, z })
        };
        if (itemStack.typeId == "minecraft:flint_and_steel"&& block.permutation.getState('farmersdelight:is_working') == false) {
            ItemUtil.damageItem(container,player.selectedSlotIndex)
            block.setPermutation(block.permutation.withState('farmersdelight:is_working', true));
            dimension.playSound("fire.ignite",{ x, y, z })
        };
    }
        
}
export class StoveComponentRegister{
    @methodEventSub(system.beforeEvents.startup)
    register(args:StartupEvent){
        args.blockComponentRegistry.registerCustomComponent('farmersdelight:stove', new StoveComponent());
    }
  
}
