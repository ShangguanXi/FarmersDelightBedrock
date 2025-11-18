import {
    Block,
    BlockPermutation,
    Container,
    ContainerSlot,
    Dimension,
    Entity,
    EntityEquippableComponent,
    EntityHealthComponent,
    EntityInventoryComponent,
    EntityOnFireComponent,
    EquipmentSlot,
    ItemEnchantableComponent,
    ItemStack,
    Player,
    PlayerInteractWithBlockBeforeEvent,
    system,
    Vector3,
    world,
} from "@minecraft/server";
import { EntityUtil } from "../lib/EntityUtil";
import { ItemUtil } from "../lib/ItemUtil";
import { subscribeEvent } from "../lib/EventSubscriber";

function spawnLoot(path: string, dimenion: Dimension, location: Vector3) {
    return dimenion.runCommand(`loot spawn ${location.x} ${location.y} ${location.z} loot "${path}"`);
}

function level(level: number | undefined) {
    if (!level) {
        return 0;
    } else {
        return level;
    }
}

const DROPS_CAKE_SLICE: Set<string> = new Set([
    "minecraft:cake",
    "minecraft:candle_cake",
    "minecraft:white_candle_cake",
    "minecraft:orange_candle_cake",
    "minecraft:magenta_candle_cake",
    "minecraft:light_blue_candle_cake",
    "minecraft:yellow_candle_cake",
    "minecraft:lime_candle_cake",
    "minecraft:pink_candle_cake",
    "minecraft:gray_candle_cake",
    "minecraft:light_gray_candle_cake",
    "minecraft:cyan_candle_cake",
    "minecraft:purple_candle_cake",
    "minecraft:blue_candle_cake",
    "minecraft:brown_candle_cake",
    "minecraft:green_candle_cake",
    "minecraft:red_candle_cake",
    "minecraft:black_candle_cake",
]);

export class Knife {
    //刀掉落物改变机制有关的战利品
    @subscribeEvent(world.afterEvents.entityHurt)
    hurt(args: any) {
        const entity: Entity = args.damageSource.damagingEntity;
        const hurt: Entity = args.hurtEntity;
        if (!entity || !hurt) return;
        try {
            const equipment = entity.getComponent(EntityEquippableComponent.componentId) as EntityEquippableComponent;
            const mainHand: ContainerSlot | undefined = equipment?.getEquipmentSlot(EquipmentSlot.Mainhand);
            if (!mainHand.getItem()) return;
            if (!mainHand.getItem()?.getComponent("farmersdelight:increase_production")) return;
            const Looting: number | undefined = (equipment?.getEquipmentSlot(EquipmentSlot.Mainhand).getItem()?.getComponent("minecraft:enchantable") as ItemEnchantableComponent)?.getEnchantment("looting")?.level;
            const health = hurt.getComponent(EntityHealthComponent.componentId) as EntityHealthComponent;
            const onFire = (hurt.getComponent("minecraft:onfire") as EntityOnFireComponent)?.onFireTicksRemaining;
            const random = Math.floor(Math.random() * 10);
            if (!health?.currentValue && hurt.typeId === "minecraft:pig" && random < (5 + level(Looting))) {
                if (!onFire) {
                    hurt.dimension.spawnItem(new ItemStack("farmersdelight:ham"), hurt.location);
                } else {
                    hurt.dimension.spawnItem(new ItemStack("farmersdelight:smoked_ham"), hurt.location);
                }
            }
            ;
            if (!health?.currentValue && hurt.typeId === "minecraft:chicken") {
                hurt.dimension.spawnItem(new ItemStack("minecraft:feather"), hurt.location);
            }
            ;
            if (!health?.currentValue && hurt.typeId === "minecraft:hoglin") {
                if (!onFire) {
                    hurt.dimension.spawnItem(new ItemStack("farmersdelight:ham"), hurt.location);
                } else {
                    hurt.dimension.spawnItem(new ItemStack("farmersdelight:smoked_ham"), hurt.location);
                }

            }
            ;
            const leatherAnimals = ["minecraft:cow", "minecraft:mooshroom", "minecraft:donkey", "minecraft:horse", "minecraft:mule", "minecraft:llama", "minecraft:trader_llama"];
            if (!health?.currentValue && hurt.typeId in leatherAnimals) {
                hurt.dimension.spawnItem(new ItemStack("minecraft:leather"), hurt.location);
            }
            ;
            if (!health?.currentValue && hurt.typeId === "minecraft:rabbit") {
                hurt.dimension.spawnItem(new ItemStack("minecraft:rabbit_hide"), hurt.location);
            }
            ;
            if (!health?.currentValue && hurt.typeId === "minecraft:shulker") {
                hurt.dimension.spawnItem(new ItemStack("minecraft:shulker_shell"), hurt.location);
            }
            ;
            if (!health?.currentValue && hurt.typeId in ["minecraft:spider", "minecraft:cave_spider"]) {
                hurt.dimension.spawnItem(new ItemStack("minecraft:trip_wire"), hurt.location);
            }
            ;
        } catch (error) {

        }

    }

    //草秆
    @subscribeEvent(world.afterEvents.playerBreakBlock)
    break(args: any) {
        const player: Player = args.player;
        const itemStack: ItemStack = args.itemStackAfterBreak;
        const block: Block = args.block;
        const permutation = args.brokenBlockPermutation;
        const blockTypeId: string = args.brokenBlockPermutation.type.id;
        // 使用刀组件的物品已经处理了掉落物
        if (!itemStack || !itemStack.hasTag("farmersdelight:is_knife") || itemStack.hasComponent("farmersdelight:knife")) return;
        if (EntityUtil.gameMode(player)) {
            const inventory = player?.getComponent("inventory") as EntityInventoryComponent;
            const container = inventory?.container as Container;
            if (!container) return;
            ItemUtil.damageItem(container, player.selectedSlotIndex);
            if (blockTypeId == "minecraft:tallgrass") {
                spawnLoot("farmersdelight/straw_from_grass", block.dimension, block.location);
            } else if (blockTypeId == "minecraft:short_grass" || blockTypeId == "minecraft:fern") {
                spawnLoot("farmersdelight/straw_from_grass", block.dimension, block.location);
            } else if (blockTypeId == "minecraft:wheat") {
                const age = permutation.getState("growth");
                if (age == 7) spawnLoot("farmersdelight/straw", block.dimension, block.location);
            } else if (blockTypeId == "farmersdelight:rice_block_upper") {
                const age = permutation.getState("farmersdelight:growth");
                if (age == 3) spawnLoot("farmersdelight/straw", block.dimension, block.location);
            } else if (blockTypeId == "farmersdelight:sandy_shrub_block") {
                spawnLoot("farmersdelight/straw_from_sandy_shrub", block.dimension, block.location);
            }
        }
    }

    @subscribeEvent(world.beforeEvents.playerInteractWithBlock)
    static sliceCake(event: PlayerInteractWithBlockBeforeEvent) {
        const stack = event.itemStack;
        if (!stack || !DROPS_CAKE_SLICE.has(event.block.typeId) || !stack.hasTag("farmersdelight:is_knife")) return;
        event.cancel = true;
        const block = event.block;
        system.run(() => {
            const pos = block.center();
            const dimension = block.dimension;
            dimension.spawnItem(new ItemStack("farmersdelight:cake_slice"), pos);
            dimension.playSound("dig.cloth", block);
            if (block.typeId === "minecraft:cake") {
                const permutation = block.permutation;
                const consumed = permutation.getState("bite_counter") ?? 0;
                if (consumed < 6) {
                    block.setPermutation(permutation.withState("bite_counter", consumed + 1));
                } else {
                    block.setType("minecraft:air");
                }
            } else {
                world.getLootTableManager()
                    .generateLootFromBlockPermutation(block.permutation)
                    ?.forEach((stack) => dimension.spawnItem(stack, pos));
                block.setPermutation(BlockPermutation.resolve("minecraft:cake", { "bite_counter": 1 }));
            }
        });
    }

    /* @methodEventSub(world.afterEvents.dataDrivenEntityTrigger, { entityTypes: ["minecraft:item"], eventTypes: ["minecraft:item_tick"] })
     tick(args: any) {
         const entity = args.entity as Entity
         const itemComp = entity.getComponent('minecraft:item')
         const typeId = itemComp?.itemStack.typeId
         if (typeId != "farmersdelight:netherite_knife") return
         entity.triggerEvent("minecraft:fire_resistance")
         console.warn(entity.getComponent('minecraft:health')?.currentValue);

     }*/
}