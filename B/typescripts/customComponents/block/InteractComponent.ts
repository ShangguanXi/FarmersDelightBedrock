import { BlockCustomComponent, BlockComponentPlayerInteractEvent, WorldInitializeBeforeEvent, world, Dimension, Vector3 } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";

export class InteractComponent implements BlockCustomComponent {
    constructor() {
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
    }

    onPlayerInteract(args: BlockComponentPlayerInteractEvent): void {}
        
}
export class InteractComponentRegister{
    @methodEventSub(world.beforeEvents.worldInitialize)
    register(args:WorldInitializeBeforeEvent){
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:interact', new InteractComponent());
    }
  
}
