import {
    Block,
    BlockComponentPlayerInteractEvent,
    BlockComponentRandomTickEvent,
    BlockComponentTickEvent,
    BlockCustomComponent,
    CustomComponentParameters,
    Dimension,
    system,
    EntityInventoryComponent,
    GameMode,
    Vector3,
} from "@minecraft/server";
import { takeItem } from "../../lib/ItemUtil";
import { blockComponent } from "../../lib/EventSubscriber";
import { KnownBlockStates } from "../../data/KnownBlockStates";
import { spawnLootAtBlock } from "../../lib/LootUtil";

export function playBoneMealEffect(block: Block, dimension: Dimension = block.dimension, pos: Vector3 = block.center()) {
    dimension.playSound("item.bone_meal.use", pos);
    dimension.spawnParticle("minecraft:crop_growth_emitter", pos);
}

export type CropsComponentParams = {
    loot: string;
    state: {
        name: keyof KnownBlockStates;
        age: number
        age_after_harvest?: number
    }
};

@blockComponent("farmersdelight:crop")
export class CropsComponent implements BlockCustomComponent {

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
                takeItem(container, player.selectedSlotIndex, 1);
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
@blockComponent("farmersdelight:torchflower")
export class TorchflowerComponent implements BlockCustomComponent {

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
                    takeItem(container, player?.selectedSlotIndex, 1);
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
@blockComponent("farmersdelight:rice")
export class RiceComponent implements BlockCustomComponent {

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
                        takeItem(container, player?.selectedSlotIndex, 1);
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
                        takeItem(container, player?.selectedSlotIndex, 1);
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
