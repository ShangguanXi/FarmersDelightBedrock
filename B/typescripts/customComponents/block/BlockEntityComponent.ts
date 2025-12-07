import {
    BlockComponentOnPlaceEvent,
    BlockCustomComponent,
    CustomComponentParameters,
} from "@minecraft/server";
import { blockComponent } from "../../lib/EventSubscriber";
import { resolveBlockEntityType, initBlockEntity } from "../../lib/BlockWithEntity";

@blockComponent("farmersdelight:block_entity")
@blockComponent("farmersdelight:cabinet") // deprecated alias
export class BlockEntityComponent implements BlockCustomComponent {
    onPlace(event: BlockComponentOnPlaceEvent, params: CustomComponentParameters): void {
        const block = event.block;
        const typeId = resolveBlockEntityType(block, params.params)?.id;
        if (!typeId) throw new Error("Failed to init block entity for "+ block.typeId);
        initBlockEntity(block, typeId).nameTag = `tile.${typeId}.name`;
    }
}
