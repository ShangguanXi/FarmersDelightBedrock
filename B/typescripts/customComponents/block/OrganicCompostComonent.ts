import {
    BlockComponentPlayerInteractEvent,
    BlockComponentRandomTickEvent,
    BlockCustomComponent,
    BlockVolume, CustomComponentParameters,
    Direction,
    EntityComponentTypes,
    EquipmentSlot,
    GameMode,
    StartupEvent,
    system,
} from "@minecraft/server";
import { COMPOST_ACTIVATORS } from "../../data/organicCompostDetect";
import { takeItemInSlot } from "../../lib/ItemUtil";
import { subscribeEvent } from "../../lib/EventSubscriber";

class OrganicCompostComponent implements BlockCustomComponent {
    onPlayerInteract(event: BlockComponentPlayerInteractEvent, _: CustomComponentParameters): void {
        if (event.face !== Direction.Up) return;
        const player = event.player;
        const slot = player?.getComponent(EntityComponentTypes.Equippable)?.getEquipmentSlot(EquipmentSlot.Mainhand);
        if (!slot) return; // assert player
        const stack = slot.getItem();
        let block: string;
        switch (stack?.typeId) {
            case "minecraft:brown_mushroom":
                block = "farmersdelight:brown_mushroom_colony";
                break;
            case "minecraft:red_mushroom":
                block = "farmersdelight:red_mushroom_colony";
                break;
            default:
                return;
        }
        const pos = event.block;
        const { dimension, x, y, z } = pos;
        dimension.playSound("dig.grass", pos);
        dimension.setBlockType({ x: x, y: y + 1, z: z }, block);
        if (player!!.getGameMode() === GameMode.Creative) return;
        takeItemInSlot(slot);
    }

    onRandomTick(event: BlockComponentRandomTickEvent, _: CustomComponentParameters): void {
        const center = event.block;
        const { dimension, x, y, z } = center;
        let moisturized = false;
        let chance = 0.05;
        let maxLight = 0;
        for (const location of new BlockVolume(
            { x: x - 1, y: y - 1, z: z - 1 },
            { x: x + 1, y: y + 1, z: z + 1 },
        ).getBlockLocationIterator()) {
            const block = dimension.getBlock(location);
            if (!block) continue;
            if (COMPOST_ACTIVATORS.has(block.typeId) || block.hasTag("compost_activators")) {
                chance += 0.02;
            }
            if (block.isWaterlogged || block.typeId === "minecraft:water") { // 为什么水不含水
                moisturized = true;
            }
            const light = dimension.getSkyLightLevel({
                x: location.x,
                y: location.y + 1,
                z: location.z,
            });
            if (light > maxLight) {
                maxLight = light;
            }
        }
        if (maxLight > 12) {
            chance += 0.05;
        }
        if (moisturized) {
            chance += 0.1;
        }
        if (Math.random() < chance) {
            const process = center.permutation.getState("farmersdelight:process") ?? 0;
            if (process < 7) {
                center.setPermutation(center.permutation.withState("farmersdelight:process", process + 1));
            } else {
                center.setType("farmersdelight:rich_soil");
            }
        }
    }

    @subscribeEvent(system.beforeEvents.startup)
    static init(event: StartupEvent) {
        event.blockComponentRegistry.registerCustomComponent("farmersdelight:organic_compost", new OrganicCompostComponent());
    }
}

void OrganicCompostComponent;