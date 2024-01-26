import { Block, BlockPermutation, Container, ContainerSlot, Entity, EntityEquippableComponent, EntityHealthComponent, EntityInventoryComponent, EquipmentSlot, ItemStack, Player, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { EntityUtil } from "../lib/EntityUtil";
import { ItemUtil } from "../lib/ItemUtil";


export class Knife {
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
    @methodEventSub(world.afterEvents.playerBreakBlock)
    break(args: any) {
        const player: Player = args.player;
        const itemStack: ItemStack = args.itemStackAfterBreak;
        const block: Block = args.block;
        const blockTypeId: string = args.brokenBlockPermutation.type.id;
        if (!itemStack?.hasTag("farmersdelight:is_knife")) return;
        if (EntityUtil.gameMode(player)) {
            const container: Container | undefined = player.getComponent(EntityInventoryComponent.componentId)?.container;
            if (!container) return;
            ItemUtil.damageItem(container, player.selectedSlot)
        }
        if (blockTypeId == "minecraft:tallgrass") {
            const R = Math.floor(Math.random() * 10);
            if (R > 2) return;
            player.dimension.spawnItem(new ItemStack("farmersdelight:straw"), block.location);
        }
    }
}