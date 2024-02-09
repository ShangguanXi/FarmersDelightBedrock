import { Block, BlockPermutation, Container, ContainerSlot, Dimension, Direction, Entity, EntityEquippableComponent, EntityHealthComponent, EntityInventoryComponent, EquipmentSlot, ItemStack, ItemUseOnAfterEvent, Player, PlayerBreakBlockAfterEvent, PlayerInteractWithBlockAfterEvent, Vector3, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { EntityUtil } from "../lib/EntityUtil";
import { ItemUtil } from "../lib/ItemUtil";

function spawnLoot(path: string, dimenion: Dimension, location: Vector3) {
    return dimenion.runCommand(`loot spawn ${location.x} ${location.y} ${location.z} loot "${path}"`)
}

export class Knife {
    //杀猪掉火腿
    @methodEventSub(world.afterEvents.entityHurt)
    hurt(args: any) {
        const entity: Entity = args.damageSource.damagingEntity;
        const hurt: Entity = args.hurtEntity;
        if (!entity || !hurt) return
        const equipment: EntityEquippableComponent | undefined = entity.getComponent(EntityEquippableComponent.componentId);
        const mainHand: ContainerSlot | undefined = equipment?.getEquipmentSlot(EquipmentSlot.Mainhand);
        if (!mainHand?.hasTag('farmersdelight:is_knife')) return;
        const health: EntityHealthComponent | undefined = hurt.getComponent(EntityHealthComponent.componentId);
        const random = Math.floor(Math.random() * 10);
        if (!health?.currentValue && hurt.typeId === 'minecraft:pig' && random < 5) {
            hurt.dimension.spawnItem(new ItemStack('farmersdelight:ham'), hurt.location);
        }
    }
    //草秆
    @methodEventSub(world.afterEvents.playerBreakBlock)
    break(args: any) {
        const player: Player = args.player;
        const itemStack: ItemStack = args.itemStackAfterBreak;
        const block: Block = args.block;
        const permutation = args.brokenBlockPermutation;
        const blockTypeId: string = args.brokenBlockPermutation.type.id;
        if (!itemStack?.hasTag("farmersdelight:is_knife")) return;
        if (EntityUtil.gameMode(player)) {
            const container: Container | undefined = player.getComponent(EntityInventoryComponent.componentId)?.container;
            if (!container) return;
            ItemUtil.damageItem(container, player.selectedSlot);
            if (blockTypeId == "minecraft:tallgrass") {
                spawnLoot('farmersdelight/straw_from_grass', block.dimension, block.location);
            }
            else if (blockTypeId == "minecraft:double_plant") {
                const type = permutation.getState('double_plant_type');
                if (type == 'grass' || type == 'fern') spawnLoot('farmersdelight/straw_from_grass', block.dimension, block.location);
            }
            else if (blockTypeId == "minecraft:wheat") {
                const age = permutation.getState('growth');
                if (age == 7) spawnLoot('farmersdelight/straw', block.dimension, block.location);
            }
            else if (blockTypeId == "farmersdelight:rice_block_upper") {
                const age = permutation.getState('farmersdelight:growth');
                if (age == 3) spawnLoot('farmersdelight/straw', block.dimension, block.location);
            }
            else if (blockTypeId == "farmersdelight:sandy_shrub_block") {
                spawnLoot('farmersdelight/straw_from_sandy_shrub', block.dimension, block.location);
            }
        }
    }
    //与南瓜互动
    @methodEventSub(world.afterEvents.playerInteractWithBlock)
    useOn(args: PlayerInteractWithBlockAfterEvent) {
        const player: Player = args.player;
        const itemStack: ItemStack | undefined = args.itemStack;
        const block: Block = args.block;
        if (!itemStack || !itemStack?.hasTag("farmersdelight:is_knife") || block.typeId != "minecraft:pumpkin") return;
        const face = args.blockFace
        const dimenion: Dimension = args.block.dimension;
        if (EntityUtil.gameMode(player)) {
            const container: Container | undefined = player.getComponent(EntityInventoryComponent.componentId)?.container;
            if (!container) return;
            ItemUtil.damageItem(container, player.selectedSlot);
        }
        if (face == Direction.Up || face == Direction.Down){
            const direction = EntityUtil.cardinalDirection(player);
            block.setPermutation(BlockPermutation.resolve('minecraft:carved_pumpkin', { 'minecraft:cardinal_direction': direction?.toLocaleLowerCase() as string }));
            dimenion.spawnItem(new ItemStack('minecraft:pumpkin_seeds', 4), block.location);
        }
        else {
            block.setPermutation(BlockPermutation.resolve('minecraft:carved_pumpkin', { 'minecraft:cardinal_direction': face?.toLocaleLowerCase() as string }));
            dimenion.spawnItem(new ItemStack('minecraft:pumpkin_seeds', 4), block.location);
        }
    }
}