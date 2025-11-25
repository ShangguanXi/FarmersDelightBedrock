import {
    BlockComponentOnPlaceEvent,
    BlockCustomComponent,
    CustomComponentParameters,
    StartupEvent,
    system,
} from "@minecraft/server";
import { blockComponent, subscribeEvent } from "../../lib/EventSubscriber";
import { getBlockEntityType, initBlockEntity } from "../../lib/BlockWithEntity";

@blockComponent("farmersdelight:block_entity")
@blockComponent("farmersdelight:cabinet") // deprecated alias
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
}
