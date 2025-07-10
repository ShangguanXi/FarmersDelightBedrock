import { BlockCustomComponent, ItemComponentUseOnEvent, StartupEvent,ItemCustomComponent, system, EntityInventoryComponent, CustomComponentParameters } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";

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
    @methodEventSub(system.beforeEvents.startup)
    register(args: StartupEvent) {
        args.itemComponentRegistry.registerCustomComponent('farmersdelight:cookable', new CookableComonent())
    }

}
