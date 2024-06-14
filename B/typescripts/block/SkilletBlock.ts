import { Block, Container, ContainerSlot, Entity, EntityDamageCause, EntityEquippableComponent, EntityInventoryComponent, EquipmentSlot, ItemStack, ItemUseOnAfterEvent, Player, PlayerPlaceBlockAfterEvent, ScoreboardObjective, ScoreboardScoreInfo, Vector3, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { BlockWithEntity } from "./BlockWithEntity";
import { vanillaItemList } from "../data/recipe/cookRecipe";
import { EntityUtil } from "../lib/EntityUtil";
import { ItemUtil } from "../lib/ItemUtil";
import { BlockEntity } from "./entity/BlockEntity";


export class SKilletBlock extends BlockWithEntity {
    @methodEventSub(world.afterEvents.playerPlaceBlock)
    placeBlock(args: PlayerPlaceBlockAfterEvent) {
        const block: Block = args.block;
        if (block.typeId != "farmersdelight:skillet_block") return;
        const { x, y, z }: Vector3 = block.location;
        const entity: Entity = super.setBlock(args.block.dimension, { x: x + 0.5, y: y, z: z + 0.5 }, "farmersdelight:skillet");
        entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', '{"item":"undefined"}');
        world.scoreboard.addObjective(entity.typeId + entity.id, entity.id).setScore('amount', 0);
    }
    @methodEventSub(world.afterEvents.itemUseOn)
    useOnBlock(args: ItemUseOnAfterEvent) {
        if (args?.block?.typeId !== "farmersdelight:skillet_block") return;
        const data = super.entityBlockData(args.block, {
            type: 'farmersdelight:skillet',
            location: args.block.location
        });
        const player: Player = args.source;
        const itemStack: ItemStack = args.itemStack;
        const container: Container | undefined = player.getComponent(EntityInventoryComponent.componentId)?.container;
        if (!data || !container) return;
        const entity: Entity = data.entity;
        const { x, y, z }: Vector3 = args.block.location;
        const sco: ScoreboardObjective | null = data.scoreboardObjective;
        if (!sco) return;
        const invItemStack: string = JSON.parse(entity.getDynamicProperty("farmersdelight:blockEntityItemStackData") as string)["item"];
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
            } else if (itemStack.typeId == invItemStack) {
                const maxAmount = itemStack.maxAmount;
                const removeAmount = maxAmount - amount;
                if (itemAmount <= removeAmount) {
                    sco.setScore('amount', amount + itemAmount);
                    sco.setScore(`${sco.getScores().length}+${itemAmount}G`, 30);
                    if (EntityUtil.gameMode(player)) {
                        ItemUtil.clearItem(container, player.selectedSlotIndex, itemAmount);
                    }
                } else {
                    sco.setScore('amount', amount + removeAmount);
                    sco.setScore(`${sco.getScores().length}+${removeAmount}G`, 30);
                    if (EntityUtil.gameMode(player)) {
                        ItemUtil.clearItem(container, player.selectedSlotIndex, removeAmount);
                    }
                }
            }
            const stove = entity.dimension.getBlock({ x: x, y: y - 1, z: z })?.permutation?.getState("farmersdelight:is_working");
            if (!stove) return
            entity.runCommandAsync("playsound block.farmersdelight.skillet.add_food @a ~ ~ ~ 1 1");
        }
        if (vanillaItemList.includes(itemStack.typeId)==false && itemStack.hasTag('farmersdelight:can_cook')==false) {
            player.onScreenDisplay.setActionBar({ translate: 'farmersdelight.skillet.invalid_item' });
        }
        if (itemStack.typeId != invItemStack && invItemStack != 'undefined') {
            for (const itemStackData of sco.getScores()) {
                const displayName = itemStackData.participant.displayName;
                if (displayName == 'amount') continue;
                const reg: RegExpMatchArray | null = displayName.match(/\d*\+(\d*)G/);
                if (reg) {
                    const num = parseInt(reg[1]);
                    sco.removeParticipant(displayName);
                    sco.setScore('amount', (sco.getScore('amount') ?? 0) - num);
                    entity.dimension.spawnItem(new ItemStack(invItemStack, num), entity.location);
                }
            }
            BlockEntity.clearEntity(data);
            const newEntity: Entity = super.setBlock(args.block.dimension, { x: x + 0.5, y: y, z: z + 0.5 }, "farmersdelight:skillet");
            newEntity.setDynamicProperty('farmersdelight:blockEntityItemStackData', '{"item":"undefined"}');
            world.scoreboard.addObjective(newEntity.typeId + newEntity.id, newEntity.id).setScore('amount', 0);
        }
    }
    @methodEventSub(world.afterEvents.entityHurt)
    hurt(args: any) {
        const entity: Entity = args.damageSource.damagingEntity;
        const hurt: Entity = args.hurtEntity;
        if (!entity || !hurt) return
        const equipment: EntityEquippableComponent | undefined = entity.getComponent(EntityEquippableComponent.componentId);
        const mainHand: ContainerSlot | undefined = equipment?.getEquipmentSlot(EquipmentSlot.Mainhand);
        if (mainHand?.typeId == 'farmersdelight:skillet_block') {
            hurt.applyDamage(8, { damagingEntity: entity, cause: EntityDamageCause.entityAttack });
        }
    }
}