import {
    BlockComponentOnPlaceEvent,
    BlockCustomComponent,
    CustomComponentParameters,
    StartupEvent,
    system,
} from "@minecraft/server";
import { subscribeEvent } from "../../lib/EventSubscriber";
import { getBlockEntityType, initBlockEntity } from "../../lib/BlockWithEntity";

export class BlockEntityComponent implements BlockCustomComponent {
    constructor() {
        this.onPlace = this.onPlace.bind(this);
    }

    onPlace(event: BlockComponentOnPlaceEvent, params: CustomComponentParameters): void {
        const block = event.block;
        const typeId = getBlockEntityType(block, params.params)?.id;
        if (!typeId) throw new Error("Failed to init block entity for "+ block.typeId);
        initBlockEntity(block, typeId).nameTag = `tile.${typeId}.name`;
    }

    @subscribeEvent(system.beforeEvents.startup)
    static init(event: StartupEvent) {
        const component = new BlockEntityComponent();
        event.blockComponentRegistry.registerCustomComponent("farmersdelight:cabinet", component);
        event.blockComponentRegistry.registerCustomComponent("farmersdelight:block_entity", component);
    }
}

void BlockEntityComponent;
