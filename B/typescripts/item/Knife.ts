import {
    Block,
    BlockPermutation,
    Container,
    ContainerSlot,
    Entity, EntityComponentTypes,
    EntityEquippableComponent,
    EntityHealthComponent,
    EntityInventoryComponent,
    EntityOnFireComponent,
    EquipmentSlot,
    GameMode,
    ItemEnchantableComponent,
    ItemStack,
    Player, PlayerBreakBlockAfterEvent,
    PlayerInteractWithBlockBeforeEvent,
    system,
    world,
} from "@minecraft/server";
import { ItemUtil } from "../lib/ItemUtil";
import { subscribeEvent } from "../lib/EventSubscriber";
import { spawnLootAtBlock } from "../lib/LootUtil";

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

class Knife {
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
            if (!health?.currentValue && hurt.typeId === "minecraft:pig" && random < 5 + (Looting ?? 0)) {
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


    /**
     * @deprecated
     */
    @subscribeEvent(world.afterEvents.playerBreakBlock)
    break(args: PlayerBreakBlockAfterEvent) {
        const player: Player = args.player;
        if (player.getGameMode() === GameMode.Creative) return;
        const stack = args.itemStackAfterBreak;
        // 使用刀组件的物品已经处理了掉落物
        if (!stack || !stack.hasTag("farmersdelight:is_knife") || stack.hasComponent("farmersdelight:knife")) return;
        const container = player.getComponent(EntityComponentTypes.Inventory)?.container;
        if (container) {
            ItemUtil.damageItem(container, player.selectedSlotIndex);
        }
        const permutation = args.brokenBlockPermutation;
        switch (permutation.type.id) {
            case "minecraft:tallgrass":
            case "minecraft:short_grass":
            case  "minecraft:fern":
                spawnLootAtBlock(args.block, "farmersdelight/straw_from_grass");
                break;
            case "minecraft:wheat":
                if (permutation.getState("growth") === 7) {
                    spawnLootAtBlock(args.block, "farmersdelight/straw");
                }
                break;
            case "farmersdelight:rice_block_upper":
                if (permutation.getState("farmersdelight:growth") === 3) {
                    spawnLootAtBlock(args.block, "farmersdelight/straw");
                }
                break;
            case "farmersdelight:sandy_shrub_block":
                spawnLootAtBlock(args.block, "farmersdelight/straw_from_sandy_shrub");
                break;
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
}

void Knife;