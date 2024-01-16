var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Direction, EntityInventoryComponent, ItemStack, system, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { BlockWithEntity } from "./BlockWithEntity";
const fireArrowEmpty = new ItemStack("farmersdelight:fire_0");
const emptyArrow = new ItemStack("farmersdelight:cooking_pot_arrow_0");
export class CookingPotBlock extends BlockWithEntity {
    placeBlock(args) {
        const itemStack = args.itemStack;
        const block = args.block;
        if (itemStack.typeId != "farmersdelight:cooking_pot")
            return;
        const { x, y, z } = block.location;
        const lores = itemStack.getLore() ?? [];
        let V3;
        const faceLocation = args.blockFace;
        switch (faceLocation) {
            case Direction.Up:
                V3 = { x: x + 0.5, y: y + 1, z: z + 0.5 };
                break;
            case Direction.Down:
                V3 = { x: x + 0.5, y: y - 1, z: z + 0.5 };
                break;
            case Direction.East:
                V3 = { x: x + 0.5 + 1, y: y, z: z + 0.5 };
                break;
            case Direction.North:
                V3 = { x: x + 0.5, y: y, z: z + 0.5 - 1 };
                break;
            case Direction.South:
                V3 = { x: x + 0.5, y: y, z: z + 0.5 + 1 };
                break;
            case Direction.West:
                V3 = { x: x + 0.5 - 1, y: y, z: z + 0.5 };
                break;
        }
        const entity = super.setBlock(args, V3, "farmersdelight:cooking_pot");
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
            block.dimension.fillBlocks(location, location, "minecraft:air");
        });
    }
}
__decorate([
    methodEventSub(world.afterEvents.itemUseOn),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CookingPotBlock.prototype, "placeBlock", null);
__decorate([
    methodEventSub(world.beforeEvents.playerBreakBlock, { blockTypes: ["farmersdelight:cooking_pot"] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CookingPotBlock.prototype, "breakBlock", null);
//# sourceMappingURL=CookingPotBlock.js.map