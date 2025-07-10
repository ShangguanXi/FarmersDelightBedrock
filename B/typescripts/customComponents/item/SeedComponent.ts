import { BlockCustomComponent, ItemComponentUseOnEvent, StartupEvent,ItemCustomComponent, system, EntityInventoryComponent, CustomComponentParameters } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";


export class SeedComponent implements ItemCustomComponent {

    constructor() {
        this.onUseOn = this.onUseOn.bind(this);
    }

    onUseOn(args: ItemComponentUseOnEvent, param: CustomComponentParameters): void {
        param.params as string
    }

    @methodEventSub(system.beforeEvents.startup)
    register(args: StartupEvent) {
        args.itemComponentRegistry.registerCustomComponent('farmersdelight:seed', new SeedComponent())
    }
}