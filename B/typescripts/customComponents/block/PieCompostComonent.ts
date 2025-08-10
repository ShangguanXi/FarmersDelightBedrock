import { BlockCustomComponent, BlockComponentOnPlaceEvent, Vector3, BlockComponentPlayerBreakEvent, system, StartupEvent, world, PlayerBreakBlockBeforeEvent, ItemComponentTypes, BlockComponentPlayerPlaceBeforeEvent, BlockComponentTickEvent, EntityInventoryComponent, ItemEnchantableComponent, Dimension, CustomComponentParameters, BlockComponentPlayerInteractEvent, Effect, ItemStack } from "@minecraft/server";
import { ItemUtil } from "../../lib/ItemUtil";
import { methodEventSub } from "../../lib/eventHelper";
import type * as minecraftvanilladata from '@minecraft/vanilla-data';

type effect = [string, number, number?]
export type Params = {
    item: string;
    nutrition:number;
    saturation_modifier:number;
    effects:effect[];
    state: {
        name: keyof minecraftvanilladata.BlockStateSuperset;
        max_use: number
        min_use?: number
    }
}

export class PieComponent implements BlockCustomComponent {
    constructor() {
        this.onPlayerInteract = this.onPlayerInteract.bind(this);

    }
    onPlayerInteract(args: BlockComponentPlayerInteractEvent, param: CustomComponentParameters): void {
        const params = param.params as Params;
        const player = args.player
        if (!player) return
        const isSneaking = player?.isSneaking
        if (isSneaking) return
        const inventory = player?.getComponent("inventory");
        if (!inventory) return
        const block = args.block
        const { x, y, z } = args.block.location;
        const container = inventory?.container;
        const itemStack = container.getItem(player.selectedSlotIndex)
        const state = block.permutation.getState(params.state.name) as number
        if (!itemStack||!itemStack.hasTag("farmersdelight:is_knife")){
            block.dimension.playSound("random.eat",{ x, y, z })
            if (state != (params.state.max_use)) block.setPermutation(block.permutation.withState(params.state.name, state + 1));
            else block.dimension.setBlockType({ x, y, z }, "minecraft:air")
            const hunger = player.getComponent('minecraft:player.hunger')
            const saturation = player.getComponent('minecraft:player.saturation')
            const nutrition= params.nutrition
            const saturation_modifier= params.saturation_modifier
            hunger?.setCurrentValue(hunger.currentValue+nutrition>hunger.effectiveMax?hunger.effectiveMax:hunger.currentValue+nutrition)
            saturation?.setCurrentValue(saturation.currentValue+saturation_modifier*nutrition*2>saturation.effectiveMax?saturation.effectiveMax:saturation.currentValue+saturation_modifier*nutrition*2)
            for (const [id, time, amplifier = 0] of params.effects) {
                player.addEffect(id, time, { amplifier: amplifier })
            }
            return
        }
        if (!itemStack.hasTag("farmersdelight:is_knife")) return
        block.dimension.playSound("use.cloth",{ x, y, z })
        block.dimension.spawnItem(new ItemStack(params.item),{ x:x+0.5, y:y+0.5, z:z+0.5 })
        if (state != (params.state.max_use)) block.setPermutation(block.permutation.withState(params.state.name, state + 1));
        else block.dimension.setBlockType({ x, y, z }, "minecraft:air")
    }


    @methodEventSub(world.beforeEvents.playerBreakBlock)
    break(args: PlayerBreakBlockBeforeEvent) {
        const block = args.block
        const pie = block.getComponent('farmersdelight:pie')
        if (!pie) return
        const params = pie.customComponentParameters.params as Params;
        const itemStack = args.itemStack
        const player = args.player
        const { x, y, z } = args.block.location;
        const state = block.permutation.getState(params.state.name) as number
        const minUse = params.state.min_use || 0
        if (state==minUse) return
        if (!itemStack) return
        const enchant = itemStack.getComponent(ItemComponentTypes.Enchantable)
        const silkTouch = enchant?.getEnchantment('silk_touch');
        if (silkTouch) {
            const container = player.getComponent("inventory")?.container;
            if (!container) return;
            args.cancel = true
            system.runTimeout(() => {
                ItemUtil.damageItem(container, player.selectedSlotIndex)
                ItemUtil.spawnItem(block, block.typeId)
                block.dimension.runCommand(`/setblock ${x} ${y} ${z} air`)

            })
        }
    }

    @methodEventSub(system.beforeEvents.startup)
    register(args: StartupEvent) {
        args.blockComponentRegistry.registerCustomComponent('farmersdelight:pie', new PieComponent());
    }

}