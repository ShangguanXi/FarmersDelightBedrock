var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { EntityDamageCause, EntityEquippableComponent, EntityInventoryComponent, EquipmentSlot, ItemStack, ItemUseOnAfterEvent, PlayerPlaceBlockAfterEvent, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { BlockWithEntity } from "./BlockWithEntity";
import { vanillaItemList } from "../data/recipe/cookRecipe";
import { EntityUtil } from "../lib/EntityUtil";
import { ItemUtil } from "../lib/ItemUtil";
import { BlockEntity } from "./entity/BlockEntity";
export class SKilletBlock extends BlockWithEntity {
    placeBlock(args) {
        const block = args.block;
        if (block.typeId != "farmersdelight:skillet_block")
            return;
        const { x, y, z } = block.location;
        const entity = super.setBlock(args.block.dimension, { x: x + 0.5, y: y, z: z + 0.5 }, "farmersdelight:skillet");
        entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', '{"item":"undefined"}');
        world.scoreboard.addObjective(entity.typeId + entity.id, entity.id).setScore('amount', 0);
    }
    useOnBlock(args) {
        if (args?.block?.typeId !== "farmersdelight:skillet_block")
            return;
        const data = super.entityBlockData(args.block, {
            type: 'farmersdelight:skillet',
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
        if (!sco)
            return;
        const invItemStack = JSON.parse(entity.getDynamicProperty("farmersdelight:blockEntityItemStackData"))["item"];
        if (vanillaItemList.includes(itemStack.typeId) || itemStack.hasTag('farmersdelight:can_cook')) {
            const amount = sco.getScore('amount') ?? 0;
            const itemAmount = itemStack.amount;
            if (invItemStack == 'undefined') {
                entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', `{"item":"${itemStack.typeId}"}`);
                sco.setScore('amount', itemAmount);
                sco.setScore(`${sco.getScores().length}+${itemAmount}G`, 30);
                if (EntityUtil.gameMode(player)) {
                    ItemUtil.clearItem(container, player.selectedSlotIndex, itemAmount);
                }
            }
            else if (itemStack.typeId == invItemStack) {
                const maxAmount = itemStack.maxAmount;
                const removeAmount = maxAmount - amount;
                if (itemAmount <= removeAmount) {
                    sco.setScore('amount', amount + itemAmount);
                    sco.setScore(`${sco.getScores().length}+${itemAmount}G`, 30);
                    if (EntityUtil.gameMode(player)) {
                        ItemUtil.clearItem(container, player.selectedSlotIndex, itemAmount);
                    }
                }
                else {
                    sco.setScore('amount', amount + removeAmount);
                    sco.setScore(`${sco.getScores().length}+${removeAmount}G`, 30);
                    if (EntityUtil.gameMode(player)) {
                        ItemUtil.clearItem(container, player.selectedSlotIndex, removeAmount);
                    }
                }
            }
            const stove = entity.dimension.getBlock({ x: x, y: y - 1, z: z })?.permutation?.getState("farmersdelight:is_working");
            if (!stove)
                return;
            entity.runCommandAsync("playsound block.farmersdelight.skillet.add_food @a ~ ~ ~ 1 1");
        }
        if (vanillaItemList.includes(itemStack.typeId) == false && itemStack.hasTag('farmersdelight:can_cook') == false) {
            player.onScreenDisplay.setActionBar({ translate: 'farmersdelight.skillet.invalid_item' });
        }
        if (itemStack.typeId != invItemStack && invItemStack != 'undefined') {
            for (const itemStackData of sco.getScores()) {
                const displayName = itemStackData.participant.displayName;
                if (displayName == 'amount')
                    continue;
                const reg = displayName.match(/\d*\+(\d*)G/);
                if (reg) {
                    const num = parseInt(reg[1]);
                    sco.removeParticipant(displayName);
                    sco.setScore('amount', (sco.getScore('amount') ?? 0) - num);
                    entity.dimension.spawnItem(new ItemStack(invItemStack, num), entity.location);
                }
            }
            BlockEntity.clearEntity(data);
            const newEntity = super.setBlock(args.block.dimension, { x: x + 0.5, y: y, z: z + 0.5 }, "farmersdelight:skillet");
            newEntity.setDynamicProperty('farmersdelight:blockEntityItemStackData', '{"item":"undefined"}');
            world.scoreboard.addObjective(newEntity.typeId + newEntity.id, newEntity.id).setScore('amount', 0);
        }
    }
    hurt(args) {
        const entity = args.damageSource.damagingEntity;
        const hurt = args.hurtEntity;
        if (!entity || !hurt)
            return;
        const equipment = entity.getComponent(EntityEquippableComponent.componentId);
        const mainHand = equipment?.getEquipmentSlot(EquipmentSlot.Mainhand);
        if (mainHand?.typeId == 'farmersdelight:skillet_block') {
            hurt.applyDamage(8, { damagingEntity: entity, cause: EntityDamageCause.entityAttack });
        }
    }
}
__decorate([
    methodEventSub(world.afterEvents.playerPlaceBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerPlaceBlockAfterEvent]),
    __metadata("design:returntype", void 0)
], SKilletBlock.prototype, "placeBlock", null);
__decorate([
    methodEventSub(world.afterEvents.itemUseOn),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ItemUseOnAfterEvent]),
    __metadata("design:returntype", void 0)
], SKilletBlock.prototype, "useOnBlock", null);
__decorate([
    methodEventSub(world.afterEvents.entityHurt),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SKilletBlock.prototype, "hurt", null);
//# sourceMappingURL=SkilletBlock.js.map