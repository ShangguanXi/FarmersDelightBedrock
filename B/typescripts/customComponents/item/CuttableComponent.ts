import {
    CustomComponentParameters,
    ItemComponentUseOnEvent,
    ItemCustomComponent,
    StartupEvent,
    system,
} from "@minecraft/server";
import { subscribeEvent } from "../../lib/EventSubscriber";

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
    @subscribeEvent(system.beforeEvents.startup)
    register(args: StartupEvent) {
        args.itemComponentRegistry.registerCustomComponent('farmersdelight:cuttable', new CuttableComponent())
    }

}
