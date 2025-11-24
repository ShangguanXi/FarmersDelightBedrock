import {
    BlockComponentPlayerInteractEvent,
    BlockComponentRandomTickEvent,
    BlockComponentTickEvent,
    BlockCustomComponent,
    CustomComponentParameters,
    Direction,
    EntityInventoryComponent,
    GameMode,
    StartupEvent,
    system,
} from "@minecraft/server";
import { ItemUtil } from "../../lib/ItemUtil";
import { subscribeEvent } from "../../lib/EventSubscriber";
import { KnownBlockStates } from "../../data/KnownBlockStates";
import { spawnLootAtBlock } from "../../lib/LootUtil";


export type CropsComponentParams = {
    loot: string;
    state: {
        name: keyof KnownBlockStates;
        age: number
        age_after_harvest?: number
    }
};

class CropsComponent implements BlockCustomComponent {

    constructor() {
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
        this.onRandomTick = this.onRandomTick.bind(this);
    }

    onPlayerInteract(args: BlockComponentPlayerInteractEvent, param: CustomComponentParameters): void {
        let params = param.params as CropsComponentParams;
        const block = args.block;
        const player = args.player;
        const dimension = args.dimension
        const maxAge = params.state.age
        const age = Number(block.permutation.getState(params.state.name))
        const random = Math.floor(Math.random() * 101)
        if (!player) return;
        const inventory = player?.getComponent("inventory") as EntityInventoryComponent;
        const container = inventory?.container;
        const itemStack = container.getItem(player.selectedSlotIndex)
        if (age < maxAge) {
            if (!itemStack) return
            if (itemStack.typeId != "minecraft:bone_meal") return
            block.dimension.spawnParticle("minecraft:crop_growth_emitter", { x: block.location.x + 0.5, y: block.location.y + 0.5, z: block.location.z + 0.5 });
            if (player.getGameMode() == GameMode.Creative) {
                block.setPermutation(block.permutation.withState(params.state.name, maxAge))
                return;
            }
            if (random>25){
                block.setPermutation(block.permutation.withState(params.state.name, age + 1))
                ItemUtil.clearItem(container,player.selectedSlotIndex)
            }
        }
        else{
            block.setPermutation(block.permutation.withState(params.state.name, params.state.age_after_harvest??0))
            spawnLootAtBlock(block, params.loot.replace("loot_tables/", "").replace(".json", ""));

        }

    }
    onRandomTick(args: BlockComponentRandomTickEvent, param: CustomComponentParameters): void {
        let params = param.params as CropsComponentParams;
        const block = args.block;
        const age = Number(block.permutation.getState(params.state.name))
        const maxAge = params.state.age
        if (age < maxAge) {
            block.setPermutation(block.permutation.withState(params.state.name, age + 1))
        }
    }
}
class TorchflowerComponent implements BlockCustomComponent {

    constructor() {
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
        this.onRandomTick = this.onRandomTick.bind(this);
    }

    onPlayerInteract(args: BlockComponentPlayerInteractEvent): void {
        const block = args.block;
        const player = args.player;
        const dimension = args.dimension

        const inventory = player?.getComponent("inventory") as EntityInventoryComponent;
        const container = inventory?.container;
        const age = Number(block.permutation.getState("farmersdelight:growth"))
        const random = Math.floor(Math.random() * 101)
        if (!player) return;

        const itemId = container?.getSlot(player.selectedSlotIndex).typeId
        try {
            if (itemId == "minecraft:bone_meal" && age < 7) {
                if (player?.getGameMode() == GameMode.Creative) {
                    block.dimension.spawnParticle("minecraft:crop_growth_emitter", { x: block.location.x + 0.5, y: block.location.y + 0.5, z: block.location.z + 0.5 });
                    block.setPermutation(block.permutation.withState("farmersdelight:growth", 7))
                }
                else {
                    if (random <= 60) {
                        block.setPermutation(block.permutation.withState("farmersdelight:growth", age + 1))
                    }
                    block.dimension.spawnParticle("minecraft:crop_growth_emitter", { x: block.location.x + 0.5, y: block.location.y + 0.5, z: block.location.z + 0.5 });
                    if (!container) return;
                    ItemUtil.clearItem(container, player?.selectedSlotIndex)
                }
                dimension.playSound("item.bone_meal.use", block.location)

            }

            if (itemId == "minecraft:bone_meal" && age == 7) {
                dimension.playSound("item.bone_meal.use", block.location)
                block.dimension.spawnParticle("minecraft:crop_growth_emitter", { x: block.location.x + 0.5, y: block.location.y + 0.5, z: block.location.z + 0.5 });
                dimension.setBlockType(block.location, "farmersdelight:rich_soil_torchflower")
            }
        } catch (error) {

        }


    }
    onRandomTick(args: BlockComponentRandomTickEvent): void {
        const block = args.block;
        const dimension = args.dimension
        const age = Number(block.permutation.getState("farmersdelight:growth"))
        if (age < 7) {
            block.setPermutation(block.permutation.withState("farmersdelight:growth", age + 1))
        }
        else {
            dimension.setBlockType(block.location, "farmersdelight:rich_soil_torchflower")
        }
    }

}
class SugarCaneComponent implements BlockCustomComponent {
    constructor() {
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
        this.onRandomTick = this.onRandomTick.bind(this);
    }
    onPlayerInteract(args: BlockComponentPlayerInteractEvent): void {
        const block = args.block;
        const face = args.face;
        const player = args.player;
        const dimension = args.dimension

        const age = Number(block.permutation.getState("farmersdelight:growth"))
        const random = Math.floor(Math.random() * 101)
        const topLocation = { x: block.location.x, y: block.location.y + 1, z: block.location.z }
        if (!player) return;
        const inventory = player?.getComponent("inventory") as EntityInventoryComponent;
        const container = inventory?.container;
        try {
            const itemId = container?.getSlot(player.selectedSlotIndex).typeId
            if (itemId == "minecraft:sugar_cane") {
                if (face != Direction.Up) return
                if (block.typeId == "farmersdelight:rich_soil_sugar_cane_bottom") {
                    dimension.playSound("dig.grass", block.location)
                    dimension.setBlockType(topLocation, "farmersdelight:rich_soil_sugar_cane_middle")
                };
                if (block.typeId == "farmersdelight:rich_soil_sugar_cane_middle") {
                    dimension.playSound("dig.grass", block.location)
                    dimension.setBlockType(topLocation, "farmersdelight:rich_soil_sugar_cane_top")
                };
                if (block.typeId == "farmersdelight:rich_soil_sugar_cane_top") {
                    dimension.playSound("dig.grass", block.location)
                    dimension.setBlockType(topLocation, "farmersdelight:rich_soil_sugar_cane_top")
                };

            }
            if (itemId == "minecraft:bone_meal") {
                if (block.typeId == "farmersdelight:rich_soil_sugar_cane_bottom") {
                    if (dimension.getBlock(topLocation)?.typeId == "minecraft:air") {
                        if (dimension.getBlock({ x: block.location.x, y: block.location.y + 2, z: block.location.z })?.typeId == "minecraft:air") {
                            dimension.setBlockType({ x: block.location.x, y: block.location.y + 2, z: block.location.z }, "farmersdelight:rich_soil_sugar_cane_top")
                        }
                        dimension.setBlockType(topLocation, "farmersdelight:rich_soil_sugar_cane_middle")
                        block.dimension.spawnParticle("minecraft:crop_growth_emitter", { x: block.location.x + 0.5, y: block.location.y + 0.5, z: block.location.z + 0.5 });
                        dimension.playSound("item.bone_meal.use", block.location)
                        if (!container) return;
                        ItemUtil.clearItem(container, player?.selectedSlotIndex)
                    }

                }
                if (block.typeId == "farmersdelight:rich_soil_sugar_cane_middle") {
                    if (dimension.getBlock(topLocation)?.typeId == "minecraft:air") {
                        dimension.setBlockType(topLocation, "farmersdelight:rich_soil_sugar_cane_top")
                        block.dimension.spawnParticle("minecraft:crop_growth_emitter", { x: block.location.x + 0.5, y: block.location.y + 0.5, z: block.location.z + 0.5 });
                        dimension.playSound("item.bone_meal.use", block.location)
                        if (!container) return;
                        ItemUtil.clearItem(container, player?.selectedSlotIndex)
                    }
                }

            }
        } catch (error) {

        }
    }
    onRandomTick(args: BlockComponentRandomTickEvent): void {
        const block = args.block;
        const dimension = args.dimension
        const age = Number(block.permutation.getState("farmersdelight:growth"))
        const topLocation = { x: block.location.x, y: block.location.y + 1, z: block.location.z }
        if (age < 15) {
            block.setPermutation(block.permutation.withState("farmersdelight:growth", age + 1))
        }
        else {
            if (dimension.getBlock(topLocation)?.typeId == "minecraft:air" && block.typeId == "farmersdelight:rich_soil_sugar_cane_bottom") {
                dimension.setBlockType(topLocation, "farmersdelight:rich_soil_sugar_cane_middle")
            };
            if (dimension.getBlock(topLocation)?.typeId == "minecraft:air" && block.typeId == "farmersdelight:rich_soil_sugar_cane_middle") {
                dimension.setBlockType(topLocation, "farmersdelight:rich_soil_sugar_cane_top")
            }

        }
    }
}
class RiceComponent implements BlockCustomComponent {

    constructor() {
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
        this.onRandomTick = this.onRandomTick.bind(this);
        this.onTick = this.onTick.bind(this);
    }
    onPlayerInteract(args: BlockComponentPlayerInteractEvent): void {
        const block = args.block;
        const player = args.player;
        const dimension = args.dimension

        const growth = Number(block.permutation.getState("farmersdelight:growth"))
        const topLocation = { x: block.location.x, y: block.location.y + 1, z: block.location.z };
        const topBlockId = dimension.getBlock(topLocation)?.typeId;
        const age = Number(block.permutation.getState("farmersdelight:age"));
        const random = Math.floor(Math.random() * 101)
        if (!player) return;
        const inventory = player?.getComponent("inventory") as EntityInventoryComponent;
        const container = inventory?.container;
        if (block.typeId == "farmersdelight:rice_block") {
            try {
                const itemId = container?.getSlot(player.selectedSlotIndex).typeId
                if (itemId == "minecraft:bone_meal") {
                    dimension.playSound("item.bone_meal.use", block.location)
                    if (player?.getGameMode() == GameMode.Creative) {
                        block.dimension.spawnParticle("minecraft:crop_growth_emitter", { x: block.location.x + 0.5, y: block.location.y + 0.5, z: block.location.z + 0.5 });
                        block.setPermutation(block.permutation.withState("farmersdelight:age", 3))
                        if (topBlockId == "minecraft:air") {
                            block.setPermutation(block.permutation.withState("farmersdelight:upper", true))
                            dimension.setBlockType(topLocation, "farmersdelight:rice_block_upper")
                            system.run(() => {
                                const growthBlock = dimension.getBlock(topLocation)
                                growthBlock?.setPermutation(growthBlock.permutation.withState("farmersdelight:growth", 3))
                            })

                        }
                    }
                    else {
                        if (random <= 60) {
                            if (age == 3 && topBlockId == "minecraft:air") {
                                block.setPermutation(block.permutation.withState("farmersdelight:upper", true))
                                dimension.setBlockType(topLocation, "farmersdelight:rice_block_upper")
                            }
                            if (age < 3) {
                                block.setPermutation(block.permutation.withState("farmersdelight:age", age + 1))
                            }
                        }
                        block.dimension.spawnParticle("minecraft:crop_growth_emitter", { x: block.location.x + 0.5, y: block.location.y + 0.5, z: block.location.z + 0.5 });
                        if (!container) return;
                        ItemUtil.clearItem(container, player?.selectedSlotIndex)
                    }

                }

            } catch (error) {

            }
        }
        if (block.typeId == "farmersdelight:rice_block_upper") {
            try {
                const itemId = container?.getSlot(player.selectedSlotIndex).typeId
                if (itemId == "minecraft:bone_meal" && growth < 3) {
                    dimension.playSound("item.bone_meal.use", block.location)
                    if (player?.getGameMode() == GameMode.Creative) {
                        block.dimension.spawnParticle("minecraft:crop_growth_emitter", { x: block.location.x + 0.5, y: block.location.y + 0.5, z: block.location.z + 0.5 });
                        block.setPermutation(block.permutation.withState("farmersdelight:growth", 3))
                    }
                    else {
                        if (random <= 60) {
                            block.setPermutation(block.permutation.withState("farmersdelight:growth", growth + 1))
                        }
                        block.dimension.spawnParticle("minecraft:crop_growth_emitter", { x: block.location.x + 0.5, y: block.location.y + 0.5, z: block.location.z + 0.5 });
                        if (!container) return;
                        ItemUtil.clearItem(container, player?.selectedSlotIndex)
                    }

                }
                if (growth == 3) {
                    block.setPermutation(block.permutation.withState("farmersdelight:growth", 0))
                    spawnLootAtBlock(block, "farmersdelight/crops/farmersdelight_rice_riped");
                }


            } catch (error) {
                if (growth == 3) {
                    block.setPermutation(block.permutation.withState("farmersdelight:growth", 0))
                    spawnLootAtBlock(block, "farmersdelight/crops/farmersdelight_rice_riped");
                }
            }
        }

    }
    onRandomTick(args: BlockComponentRandomTickEvent): void {

        const block = args.block;
        const dimension = args.dimension;
        const topLocation = { x: block.location.x, y: block.location.y + 1, z: block.location.z };
        const topBlockId = dimension.getBlock(topLocation)?.typeId;
        const age = Number(block.permutation.getState("farmersdelight:age"));
        const growth = Number(block.permutation.getState("farmersdelight:growth"));
        if (block.typeId == "farmersdelight:rice_block_upper") {
            if (growth < 3) {
                block.setPermutation(block.permutation.withState("farmersdelight:growth", growth + 1))
            }
        }
        if (block.typeId == "farmersdelight:rice_block") {
            if (age < 3) {
                block.setPermutation(block.permutation.withState("farmersdelight:age", age + 1))
            }
            if (age == 3 && topBlockId == "minecraft:air") {
                dimension.setBlockType(topLocation, "farmersdelight:rice_block_upper")
                block.setPermutation(block.permutation.withState("farmersdelight:upper", true))
            }
        }

    }
    onTick(args: BlockComponentTickEvent): void {
        const block = args.block;
        const dimension = args.dimension
        const topLocation = { x: block.location.x, y: block.location.y + 1, z: block.location.z }
        const topBlockId = dimension.getBlock(topLocation)?.typeId
        const age = Number(block.permutation.getState("farmersdelight:age"))
        if (age == 3 && topBlockId != "farmersdelight:rice_block_upper") {
            block.setPermutation(block.permutation.withState("farmersdelight:upper", false))
        }
    }

}
export class CropComponentRegister {
    @subscribeEvent(system.beforeEvents.startup)
    register(args: StartupEvent) {
        args.blockComponentRegistry.registerCustomComponent('farmersdelight:crop', new CropsComponent());
        args.blockComponentRegistry.registerCustomComponent('farmersdelight:torchflower', new TorchflowerComponent());
        args.blockComponentRegistry.registerCustomComponent('farmersdelight:sugar_cane', new SugarCaneComponent());
        args.blockComponentRegistry.registerCustomComponent('farmersdelight:rice', new RiceComponent());
    }

}
