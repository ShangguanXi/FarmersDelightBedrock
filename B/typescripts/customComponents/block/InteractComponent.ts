import { BlockCustomComponent, BlockComponentPlayerInteractEvent, system, world, StartupEvent, Vector3 } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";

export class InteractComponent implements BlockCustomComponent {
    constructor() {
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
    }

    onPlayerInteract(args: BlockComponentPlayerInteractEvent): void {}
        
}
export class InteractComponentRegister{
    @methodEventSub(system.beforeEvents.startup)
    register(args: StartupEvent){
        args.blockComponentRegistry.registerCustomComponent('farmersdelight:interact', new InteractComponent());
    }
  
}
