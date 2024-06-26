import { Block, BlockComponentTickEvent, BlockCustomComponent, BlockComponentPlayerPlaceBeforeEvent, BlockPermutation, Container, Direction, system, EntityInventoryComponent, WorldInitializeBeforeEvent, world } from "@minecraft/server";
import { EntityUtil } from "../../lib/EntityUtil";
import { ItemUtil } from "../../lib/ItemUtil";
import { methodEventSub } from "../../lib/eventHelper";

class TatamMatComponent implements BlockCustomComponent {
    constructor() {
        this.onTick = this.onTick.bind(this);
        this.beforeOnPlayerPlace = this.beforeOnPlayerPlace.bind(this);
    }
    beforeOnPlayerPlace(args: BlockComponentPlayerPlaceBeforeEvent): void {
        const block = args.block;
        const player = args.player;
        const itemId = player?.getComponent("inventory")?.container?.getSlot(player.selectedSlotIndex).typeId
        if (!player) return;
        if (!itemId || itemId != 'farmersdelight:tatami_mat' || args.face != Direction.Up) return
        
        args.cancel = true
        system.run(() => {
            if (!player) return
            let other: Block | undefined;
            const direction = EntityUtil.cardinalDirection(player, 180)?.toLowerCase() as string;
            const otherDirection = EntityUtil.cardinalDirection(player)?.toLowerCase() as string;
            switch (direction) {
                case 'east':
                    other = block?.east();
                    break;
                case 'west':
                    other = block?.west();
                    break;
                case 'north':
                    other = block?.north();
                    break;
                case 'south':
                    other = block?.south();
                    break;
            }
            if (!other?.isAir) return
            const mainPerm = BlockPermutation.resolve('farmersdelight:tatami_mat_main', { 'minecraft:cardinal_direction': direction, 'farmersdelight:init': true });
            const otherPerm = BlockPermutation.resolve('farmersdelight:tatami_mat_other', { 'minecraft:cardinal_direction': otherDirection, 'farmersdelight:init': true });
            world.playSound("dig.cloth", block.location)
            
            block?.setPermutation(mainPerm);
            other?.setPermutation(otherPerm);
            if (EntityUtil.gameMode(player)) ItemUtil.clearItem(player.getComponent('inventory')?.container as Container, player.selectedSlotIndex);
        })
    }

    onTick(args: BlockComponentTickEvent): void {
        const main = args.block
        const direction = main.permutation.getState('minecraft:cardinal_direction');
        let other: Block | undefined;
        switch (direction) {
            case 'east':
                other = main?.east();
                break;
            case 'west':
                other = main?.west();
                break;
            case 'north':
                other = main?.north();
                break;
            case 'south':
                other = main?.south();
                break;
        }
        if (main.typeId == 'farmersdelight:tatami_mat_main') {
            if (other?.typeId != 'farmersdelight:tatami_mat_other') {
                main.dimension.runCommand(`setblock ${main.location.x} ${main.location.y} ${main.location.z} air destroy`)
                main.dimension.runCommand(`setblock ${other?.location.x} ${other?.location.y} ${other?.location.z} air destroy`)
            }
        }
        else if (main.typeId == 'farmersdelight:tatami_mat_other') {
            if (other?.typeId != 'farmersdelight:tatami_mat_main') {
                main.dimension.runCommand(`setblock ${main.location.x} ${main.location.y} ${main.location.z} air destroy`)
                main.dimension.runCommand(`setblock ${other?.location.x} ${other?.location.y} ${other?.location.z} air destroy`)
            }
        }
    }
}
export class TatamMatComponentRegister {
    @methodEventSub(world.beforeEvents.worldInitialize)
    register(args: WorldInitializeBeforeEvent) {
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:tatami_mat', new TatamMatComponent());
    }

}
