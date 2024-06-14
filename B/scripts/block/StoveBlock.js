var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { EntityInventoryComponent, ItemStack, ItemUseOnAfterEvent, PlayerPlaceBlockAfterEvent, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { BlockWithEntity } from "./BlockWithEntity";
import { vanillaItemList } from "../data/recipe/cookRecipe";
import { EntityUtil } from "../lib/EntityUtil";
import { ItemUtil } from "../lib/ItemUtil";
export class StoveBlock extends BlockWithEntity {
    placeBlock(args) {
        const block = args.block;
        if (block.typeId != "farmersdelight:stove")
            return;
        //放置直接为点燃状态
        block.setPermutation(block.permutation.withState('farmersdelight:is_working', true));
        const { x, y, z } = block.location;
        const entity = super.setBlock(args.block.dimension, { x: x + 0.5, y: y, z: z + 0.5 }, "farmersdelight:stove");
        world.scoreboard.addObjective(entity.typeId + entity.id, entity.id).setScore('amount', 0);
    }
    useOnBlock(args) {
        if (args?.block?.typeId !== "farmersdelight:stove")
            return;
        const data = super.entityBlockData(args.block, {
            type: 'farmersdelight:stove',
            location: args.block.location
        });
        const player = args.source;
        const itemStack = args.itemStack;
        const container = player.getComponent(EntityInventoryComponent.componentId)?.container;
        if (!data || !container)
            return;
        const entity = data.entity;
        const { x, y, z } = args.block.location;
        const sco = data.scoreboardObjective;
        const air = player.dimension.getBlock({ x: x, y: y + 1, z: z });
        if (entity && sco && air?.typeId == "minecraft:air") {
            const amount = sco.getScore('amount') ?? 0;
            if (itemStack.typeId == "farmersdelight:cooking_pot") {
                ItemUtil.clearItem(container, player.selectedSlotIndex);
            }
            else {
                if (vanillaItemList.includes(itemStack.typeId) || itemStack.hasTag('farmersdelight:can_cook')) {
                    if (amount < 6) {
                        sco.setScore('amount', amount + 1);
                        sco.setScore(`${itemStack.typeId}/${amount + 1}`, 30);
                        if (EntityUtil.gameMode(player))
                            ItemUtil.clearItem(container, player.selectedSlotIndex);
                    }
                }
                else {
                    const arr = [];
                    const itemStackScoresData = sco.getScores();
                    for (const itemStackData of itemStackScoresData) {
                        const itemStack = itemStackData.participant.displayName;
                        if (itemStack == 'amount')
                            continue;
                        arr.push(itemStack);
                    }
                    for (let i = 0; i < arr.length - 1; i++) {
                        for (let j = 0; j < arr.length - 1 - i; j++) {
                            const num1 = parseInt(arr[j].split('/')[1]);
                            const num2 = parseInt(arr[j + 1].split('/')[1]);
                            if (num1 > num2) {
                                [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]];
                            }
                        }
                    }
                    if (arr.length && sco) {
                        const itemStackData = arr[amount - 1];
                        const itemStack = itemStackData.split('/')[0];
                        sco.removeParticipant(itemStackData);
                        sco.setScore('amount', (sco.getScore('amount') ?? 0) - 1);
                        entity.dimension.spawnItem(new ItemStack(itemStack), entity.location);
                    }
                }
            }
        }
    }
}
__decorate([
    methodEventSub(world.afterEvents.playerPlaceBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerPlaceBlockAfterEvent]),
    __metadata("design:returntype", void 0)
], StoveBlock.prototype, "placeBlock", null);
__decorate([
    methodEventSub(world.afterEvents.itemUseOn),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ItemUseOnAfterEvent]),
    __metadata("design:returntype", void 0)
], StoveBlock.prototype, "useOnBlock", null);
//# sourceMappingURL=StoveBlock.js.map