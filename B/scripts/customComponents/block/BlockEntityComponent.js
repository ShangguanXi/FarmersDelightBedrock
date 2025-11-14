var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { StartupEvent, system, } from "@minecraft/server";
import { subscribeEvent } from "../../lib/EventSubscriber";
import { getBlockEntityType, initBlockEntity } from "../../lib/BlockWithEntity";
export class BlockEntityComponent {
    constructor() {
        this.onPlace = this.onPlace.bind(this);
    }
    onPlace(event, params) {
        const block = event.block;
        const typeId = getBlockEntityType(block, params.params)?.id;
        if (!typeId)
            throw new Error("Failed to init block entity for " + block.typeId);
        initBlockEntity(block, typeId).nameTag = `tile.${typeId}.name`;
    }
    static init(event) {
        const component = new BlockEntityComponent();
        event.blockComponentRegistry.registerCustomComponent("farmersdelight:cabinet", component);
        event.blockComponentRegistry.registerCustomComponent("farmersdelight:block_entity", component);
    }
}
__decorate([
    subscribeEvent(system.beforeEvents.startup),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [StartupEvent]),
    __metadata("design:returntype", void 0)
], BlockEntityComponent, "init", null);
void BlockEntityComponent;
