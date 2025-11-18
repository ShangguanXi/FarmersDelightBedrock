import {
    CustomComponentParameters,
    ItemComponentUseOnEvent,
    ItemCustomComponent,
    StartupEvent,
    system,
} from "@minecraft/server";
import { subscribeEvent } from "../../lib/EventSubscriber";

export type CookableComponentParams = {
    result: string;
    time?: number
};
class CookableComonent implements ItemCustomComponent {

    constructor() {
        this.onUseOn = this.onUseOn.bind(this);
    }

    onUseOn(args: ItemComponentUseOnEvent, param: CustomComponentParameters): void {
        param.params as CookableComponentParams;
    }
}
export class CookableComonentRegister {
    @subscribeEvent(system.beforeEvents.startup)
    register(args: StartupEvent) {
        args.itemComponentRegistry.registerCustomComponent('farmersdelight:cookable', new CookableComonent())
    }

}
