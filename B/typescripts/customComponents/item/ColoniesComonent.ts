import { BlockPermutation, Container, Direction, ItemComponentUseOnEvent, ItemCustomComponent, Player, WorldInitializeBeforeEvent, system, world } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { EntityUtil } from "../../lib/EntityUtil";
import { ItemUtil } from "../../lib/ItemUtil";

class ColoniesComonent implements ItemCustomComponent{
    constructor() {
        this.onUseOn = this.onUseOn.bind(this);
    }
    onUseOn(args: ItemComponentUseOnEvent): void {
        const itemStack = args.itemStack;
        const block = args.block;
        if (
            !itemStack ||
            (itemStack.typeId != 'farmersdelight:brown_mushroom_colony_item' && itemStack.typeId != 'farmersdelight:red_mushroom_colony_item') ||
            args.blockFace != Direction.Up ||
            (block.typeId != 'minecraft:mycelium' && block.typeId != 'farmersdelight:rich_soil')
        ) return
        const player = args.source as Player
        const main = block.above();
        const mainPerm = BlockPermutation.resolve(itemStack.typeId.split('_item')[0], { 'farmersdelight:growth': 4 });
        main?.setPermutation(mainPerm);
        if (EntityUtil.gameMode(player)) ItemUtil.clearItem(player.getComponent('inventory')?.container as Container, player.selectedSlotIndex);
    }

}
export class ColoniesComonentRegister{
    @methodEventSub(world.beforeEvents.worldInitialize)
    register(args:WorldInitializeBeforeEvent){
        args.itemComponentRegistry.registerCustomComponent('farmersdelight:colonies', new ColoniesComonent())
    }
  
}
