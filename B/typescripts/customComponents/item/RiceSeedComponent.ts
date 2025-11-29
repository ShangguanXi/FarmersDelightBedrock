import {
    Container,
    Direction,
    EntityInventoryComponent,
    ItemComponentUseOnEvent,
    ItemCustomComponent,
    Player,
    StartupEvent,
    system,
} from "@minecraft/server";
import { ItemUtil } from "../../lib/ItemUtil";
import { EntityUtil } from "../../lib/EntityUtil";
import { subscribeEvent } from "../../lib/EventSubscriber";

/**
 * @deprecated
 */
class RiceSeedComponent implements ItemCustomComponent {
    constructor() {
        this.onUseOn = this.onUseOn.bind(this);
    }

    onUseOn(args: ItemComponentUseOnEvent): void {
        const itemStack = args.itemStack;
        const block = args.block;
        const source = args.source;
        if (source instanceof Player) {
            if (!itemStack || args.blockFace != Direction.Up || (!block.getTags().includes("dirt"))) return;
            system.run(() => {
                const water = block.above();
                if (!(water?.typeId == 'minecraft:water' && water?.permutation.getState('liquid_depth') == 0)) return
                block.dimension.setBlockType(water.location,"farmersdelight:rice_block")
                const inventory = source?.getComponent("inventory") as EntityInventoryComponent;
                const container: Container = inventory?.container as Container
                if (EntityUtil.gameMode(source)) ItemUtil.clearItem(container, source.selectedSlotIndex)
            })
        }


    }
}
export class RiceSeedComponentRegister {
    @subscribeEvent(system.beforeEvents.startup)
    register(args: StartupEvent) {
        args.itemComponentRegistry.registerCustomComponent('farmersdelight:rice_seed', new RiceSeedComponent())
    }

}
