import { BlockCustomComponent, ItemComponentUseOnEvent, StartupEvent,ItemCustomComponent, system, EntityInventoryComponent, CustomComponentParameters } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";

class IncreaseProductionComponent implements ItemCustomComponent {}
export class IncreaseProductionComponentRegister {
    @methodEventSub(system.beforeEvents.startup)
    register(args: StartupEvent) {
        args.itemComponentRegistry.registerCustomComponent('farmersdelight:increase_production', new IncreaseProductionComponent())
    }

}
