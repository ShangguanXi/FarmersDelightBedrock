import {
    CustomComponentParameters,
    ItemComponentUseOnEvent,
    ItemCustomComponent,
    StartupEvent,
    system,
} from "@minecraft/server";
import { subscribeEvent } from "../../lib/EventSubscriber";


export class SeedComponent implements ItemCustomComponent {

    constructor() {
        this.onUseOn = this.onUseOn.bind(this);
    }

    onUseOn(args: ItemComponentUseOnEvent, param: CustomComponentParameters): void {
        param.params as string
    }

    @subscribeEvent(system.beforeEvents.startup)
    register(args: StartupEvent) {
        args.itemComponentRegistry.registerCustomComponent('farmersdelight:seed', new SeedComponent())
    }
}