import { BlockCustomComponent, CustomComponentParameters, system, world, StartupEvent, Vector3, BlockComponentOnPlaceEvent } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";


export class CabinetComponent implements BlockCustomComponent {
    constructor() {
        this.onPlace = this.onPlace.bind(this);
    }

    onPlace(args: BlockComponentOnPlaceEvent, param: CustomComponentParameters): void {
        param.params as string;
    }
        
}
export class CabinetComponentRegister{
    @methodEventSub(system.beforeEvents.startup)
    register(args: StartupEvent){
        args.blockComponentRegistry.registerCustomComponent('farmersdelight:cabinet', new CabinetComponent());
    }
  
}
