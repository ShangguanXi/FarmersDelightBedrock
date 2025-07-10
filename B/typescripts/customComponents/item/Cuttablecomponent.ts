import { BlockCustomComponent, ItemComponentUseOnEvent, StartupEvent, world, Dimension, Vector3, ItemCustomComponentAlreadyRegisteredError, ItemCustomComponent, Direction, Container, system, Player, EntityInventoryComponent, CustomComponentParameters } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { ItemUtil } from "../../lib/ItemUtil";
import { EntityUtil } from "../../lib/EntityUtil";

type LootItem = [string, number, number?]
export type CuttingBroadComponentParams = {
    loot: LootItem[];
    is_block?: boolean
    tool: {
        type:  "tag" | "item",
        name: string

    }
};
class CuttableComponent implements ItemCustomComponent {

    constructor() {
        this.onUseOn = this.onUseOn.bind(this);
    }

    onUseOn(args: ItemComponentUseOnEvent, param: CustomComponentParameters): void {
        param.params as CuttingBroadComponentParams;
    }
}
export class CuttableComponentRegister {
    @methodEventSub(system.beforeEvents.startup)
    register(args: StartupEvent) {
        args.itemComponentRegistry.registerCustomComponent('farmersdelight:cuttable', new CuttableComponent())
    }

}
