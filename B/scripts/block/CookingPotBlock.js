var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { EntityInventoryComponent, ItemStack, ItemUseOnBeforeEvent, PlayerPlaceBlockAfterEvent, system, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { BlockWithEntity } from "./BlockWithEntity";
const fireArrowEmpty = new ItemStack("farmersdelight:fire_0");
const emptyArrow = new ItemStack("farmersdelight:cooking_pot_arrow_0");
//potItem用于放置厨锅时暂时存储厨锅物品数据，方便读取lore
//别问我为啥不写类里面，因为写类里面的时候在constructor里还是正常的map，一到事件里就莫名其妙变成了undefined，ts也没报错，查不出来原因
let potItem = new Map();
export class CookingPotBlock extends BlockWithEntity {
    beforePlaceBlock(args) {
        potItem.set(args.source.id, args.itemStack);
    }
    placeBlock(args) {
        const itemStack = potItem.get(args.player.id);
        const block = args.block;
        if (block.typeId != "farmersdelight:cooking_pot")
            return;
        const lores = itemStack.getLore() ?? [];
        const { x, y, z } = block.location;
        const entity = super.setBlock(block.dimension, { x: x + 0.5, y: y, z: z + 0.5 }, "farmersdelight:cooking_pot");
        entity.nameTag = "farmersdelight厨锅";
        const container = entity.getComponent(EntityInventoryComponent.componentId)?.container;
        container?.setItem(9, emptyArrow);
        container?.setItem(10, fireArrowEmpty);
        if (!lores.length)
            return;
        for (const lore of lores) {
            const data = lore.match(/\d+|\S+:\S+/g);
            if (!data)
                continue;
            const slot = container?.getSlot(6);
            const cookingItemStack = new ItemStack(data[1]);
            cookingItemStack.amount = parseInt(data[0]);
            slot?.setItem(cookingItemStack);
        }
    }
    breakBlock(args) {
        const block = args.block;
        const location = block.location;
        args.cancel = true;
        system.run(() => {
            block.dimension.setBlockType(location, "minecraft:air");
        });
    }
}
__decorate([
    methodEventSub(world.beforeEvents.itemUseOn),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ItemUseOnBeforeEvent]),
    __metadata("design:returntype", void 0)
], CookingPotBlock.prototype, "beforePlaceBlock", null);
__decorate([
    methodEventSub(world.afterEvents.playerPlaceBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerPlaceBlockAfterEvent]),
    __metadata("design:returntype", void 0)
], CookingPotBlock.prototype, "placeBlock", null);
__decorate([
    methodEventSub(world.beforeEvents.playerBreakBlock, { blockTypes: ["farmersdelight:cooking_pot"] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CookingPotBlock.prototype, "breakBlock", null);
//# sourceMappingURL=CookingPotBlock.js.map