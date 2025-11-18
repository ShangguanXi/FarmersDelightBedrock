import { BlockComponentPlayerInteractEvent, BlockCustomComponent, StartupEvent, system } from "@minecraft/server";
import { subscribeEvent } from "../../lib/EventSubscriber";

export class InteractComponent implements BlockCustomComponent {
    constructor() {
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
    }

    onPlayerInteract(args: BlockComponentPlayerInteractEvent): void {}
        
}
export class InteractComponentRegister{
    @subscribeEvent(system.beforeEvents.startup)
    register(args: StartupEvent){
        args.blockComponentRegistry.registerCustomComponent('farmersdelight:interact', new InteractComponent());
    }
  
}
