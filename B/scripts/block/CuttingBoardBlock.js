var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { EntityInventoryComponent, ItemStack, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { BlockWithEntity } from "./BlockWithEntity";
import { EntityUtil } from "../lib/EntityUtil";
import { farmersdelightBlockList, vanillaItemList } from "../data/recipe/cuttingBoardRecipe";
import { ItemUtil } from "../lib/ItemUtil";
export class CuttingBoardBlock extends BlockWithEntity {
    placeBlock(args) {
        const block = args.block;
        if (block.typeId != "farmersdelight:cutting_board")
            return;
        const { x, y, z } = block.location;
        const entity = super.setBlock(args, { x: x + 0.5, y: y, z: z + 0.5 }, "farmersdelight:cutting_board");
        entity.setDynamicProperty("farmersdelight:blockEntityItemStackData", '{"item":"undefined"}');
    }
    useOnBlock(args) {
        if (args?.block?.typeId !== "farmersdelight:cutting_board")
            return;
        const data = super.entityBlockData(args, {
            type: 'farmersdelight:cutting_board',
            location: args.block.location
        });
        const player = args.source;
        const container = player.getComponent(EntityInventoryComponent.componentId)?.container;
        if (!data || !container)
            return;
        const entity = data.entity;
        const mainHand = args.itemStack;
        const itemStack = JSON.parse(entity.getDynamicProperty("farmersdelight:blockEntityItemStackData"))["item"];
        if (itemStack != "undefined" && !mainHand.hasTag('farmersdelight:is_knife')) {
            entity.dimension.spawnItem(new ItemStack(itemStack), entity.location);
            entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', '{"item":"undefined"}');
        }
        if (farmersdelightBlockList.includes(mainHand.typeId) || vanillaItemList.includes(mainHand.typeId) || mainHand.hasTag('farmersdelight:can_cut') || mainHand.hasTag('farmersdelight:is_knife')) {
            if (itemStack != 'undefined') {
                if (mainHand.hasTag('farmersdelight:is_knife')) {
                    const id = itemStack.split(':')[1];
                    entity.runCommandAsync(`loot spawn ${entity.location.x} ${entity.location.y} ${entity.location.z} loot "farmersdelight/cutting_board/farmersdelight_${id}"`);
                    entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', '{"item":"undefined"}');
                    if (EntityUtil.gameMode(player)) {
                        ItemUtil.damageItem(container, player.selectedSlot);
                    }
                }
            }
            else if (!mainHand.hasTag('farmersdelight:is_knife')) {
                entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', `{"item":"${mainHand.typeId}"}`);
                if (EntityUtil.gameMode(player)) {
                    ItemUtil.claerItem(container, player.selectedSlot);
                }
            }
        }
    }
}
__decorate([
    methodEventSub(world.afterEvents.playerPlaceBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CuttingBoardBlock.prototype, "placeBlock", null);
__decorate([
    methodEventSub(world.afterEvents.itemUseOn),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CuttingBoardBlock.prototype, "useOnBlock", null);
//# sourceMappingURL=CuttingBoardBlock.js.map