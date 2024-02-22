import { Block, BlockPermutation, Container, Direction, PlayerInteractWithBlockBeforeEvent, ScriptEventCommandMessageAfterEvent, system, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { ItemUtil } from "../lib/ItemUtil";
import { EntityUtil } from "../lib/EntityUtil";

export class TatamiMatBlock {
    //放置长榻榻米垫
    @methodEventSub(world.beforeEvents.playerInteractWithBlock)
    tryPlaceBlock(args: PlayerInteractWithBlockBeforeEvent) {
        const itemStack = args.itemStack;
        const block = args.block;
        const player = args.player;
        if (!itemStack || itemStack.typeId != 'farmersdelight:tatami_mat' || args.blockFace != Direction.Up) return
        args.cancel = true
        system.run(() => {
            const main = block.above();
            let other: Block | undefined;
            const direction = EntityUtil.cardinalDirection(player, 180)?.toLowerCase() as string;
            const otherDirection = EntityUtil.cardinalDirection(player)?.toLowerCase() as string;
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
            if (!other?.isAir) return
            const mainPerm = BlockPermutation.resolve('farmersdelight:tatami_mat_main', { 'minecraft:cardinal_direction': direction, 'farmersdelight:init': true });
            const otherPerm = BlockPermutation.resolve('farmersdelight:tatami_mat_other', { 'minecraft:cardinal_direction': otherDirection, 'farmersdelight:init': true });
            main?.setPermutation(mainPerm);
            other?.setPermutation(otherPerm);
            if (EntityUtil.gameMode(player)) ItemUtil.clearItem(player.getComponent('inventory')?.container as Container, player.selectedSlot);
        })
    }
    @methodEventSub(system.afterEvents.scriptEventReceive, { namespaces: ['farmersdelight'] })
    tick(args: ScriptEventCommandMessageAfterEvent) {
        if (args.id == 'farmersdelight:tatami_mat_tick') {
            const main = args.sourceBlock as Block;
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
}