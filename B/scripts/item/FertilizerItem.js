var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ItemUseOnAfterEvent, world, EntityInventoryComponent } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { ItemUtil } from "../lib/ItemUtil";
export class FertilizerItem {
    itemUseOn(args) {
        const player = args.source;
        const block = args.block;
        const itemStack = args.itemStack;
        const itemAllTag = itemStack.getTags();
        //取[0,100]的随机整数
        const random = Math.floor(Math.random() * 101);
        for (const itemFullTag of itemAllTag) {
            const itemTag = itemFullTag.split('.')[0];
            const probability = Number(itemFullTag.split('.')[1]);
            const container = player.getComponent(EntityInventoryComponent.componentId)?.container;
            if (!container)
                return;
            if (itemTag == "farmersdelight:is_fertilizer" && block.typeId == "minecraft:composter") {
                if (random <= probability) {
                    block.setPermutation(block.permutation.withState("composter_fill_level", Number(block.permutation.getState("composter_fill_level")) + 1));
                }
                block.dimension.spawnParticle("minecraft:crop_growth_emitter", { x: block.location.x + 0.5, y: block.location.y + 0.5, z: block.location.z + 0.5 });
                ItemUtil.clearItem(container, player.selectedSlot);
            }
        }
    }
}
__decorate([
    methodEventSub(world.afterEvents.itemUseOn),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ItemUseOnAfterEvent]),
    __metadata("design:returntype", void 0)
], FertilizerItem.prototype, "itemUseOn", null);
//# sourceMappingURL=FertilizerItem.js.map