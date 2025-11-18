import { ItemCustomComponent, StartupEvent, system } from "@minecraft/server";
import { subscribeEvent } from "../../lib/EventSubscriber";

class IncreaseProductionComponent implements ItemCustomComponent {}
export class IncreaseProductionComponentRegister {
    @subscribeEvent(system.beforeEvents.startup)
    register(args: StartupEvent) {
        args.itemComponentRegistry.registerCustomComponent('farmersdelight:increase_production', new IncreaseProductionComponent())
    }

}
