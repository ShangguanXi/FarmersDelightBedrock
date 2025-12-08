var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { blockComponent } from "../../lib/EventSubscriber";
import { resolveBlockEntityType, initBlockEntity } from "../../lib/BlockWithEntity";
let BlockEntityComponent = class BlockEntityComponent {
    onPlace(event, params) {
        const block = event.block;
        const typeId = resolveBlockEntityType(block, params.params)?.id;
        if (!typeId)
            throw new Error("Failed to init block entity for " + block.typeId);
        initBlockEntity(block, typeId).nameTag = `tile.${typeId}.name`;
    }
};
BlockEntityComponent = __decorate([
    blockComponent("farmersdelight:block_entity"),
    blockComponent("farmersdelight:cabinet")
], BlockEntityComponent);
export { BlockEntityComponent };
