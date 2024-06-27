import { BlockCustomComponent, BlockComponentPlayerInteractEvent, WorldInitializeBeforeEvent, world, Dimension, Vector3, BlockComponentRandomTickEvent, EntityInventoryComponent, Container, Direction, BlockComponentTickEvent, system } from "@minecraft/server";
import { methodEventSub } from "../../lib/eventHelper";
import { ItemUtil } from "../../lib/ItemUtil";
function spawnLoot(path: string, dimenion: Dimension, location: Vector3) {
    return dimenion.runCommand(`loot spawn ${location.x} ${location.y} ${location.z} loot "${path}"`)
}

class CropsComponent implements BlockCustomComponent {

    constructor() {
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
        this.onRandomTick = this.onRandomTick.bind(this);
    }

    onPlayerInteract(args: BlockComponentPlayerInteractEvent): void {
        const block = args.block;
        const player = args.player;
        const dimension = args.dimension
        const itemId = player?.getComponent("inventory")?.container?.getSlot(player.selectedSlotIndex).typeId
        const age = Number(block.permutation.getState("farmersdelight:growth"))
        const random = Math.floor(Math.random() * 101)
        if (!player) return;
        const container: Container | undefined = player.getComponent(EntityInventoryComponent.componentId)?.container;
        const lootTable = this.getLootTable();
        try {
            if (itemId == "minecraft:bone_meal" && age < 7) {
                world.playSound("item.bone_meal.use", block.location)
                if (player?.getGameMode() == "creative") {
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

            }
            if (age == 7) {
                block.setPermutation(block.permutation.withState("farmersdelight:growth", 0))
                spawnLoot(lootTable, dimension, { x: block.location.x, y: block.location.y, z: block.location.z })
            }
        } catch (error) {

        }


    }
    onRandomTick(args: BlockComponentRandomTickEvent): void {
        const block = args.block;
        const age = Number(block.permutation.getState("farmersdelight:growth"))
        if (age < 7) {
            block.setPermutation(block.permutation.withState("farmersdelight:growth", age + 1))
        }
    }
    getLootTable(): string {
        return "";

    }

}
class CabbageComponent extends CropsComponent {
    getLootTable(): string {
        return "farmersdelight/crops/farmersdelight_cabbage_riped";

    }
}
class OnionComponent extends CropsComponent {
    getLootTable(): string {
        return "farmersdelight/crops/farmersdelight_onion_riped";

    }
}
class TomatoComponent extends CropsComponent {
    getLootTable(): string {
        return "farmersdelight/crops/farmersdelight_tomato_riped";

    }
}
class Beetrootomponent extends CropsComponent {
    getLootTable(): string {
        return "farmersdelight/crops/beetroot_riped";

    }
}
class CarrotComponent extends CropsComponent {
    getLootTable(): string {
        return "farmersdelight/crops/carrot_riped";

    }
}
class PotatoComponent extends CropsComponent {
    getLootTable(): string {
        return "farmersdelight/crops/potato_riped";

    }
}
class WheatComponent extends CropsComponent {
    getLootTable(): string {
        return "farmersdelight/crops/wheat_riped";

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
        const itemId = player?.getComponent("inventory")?.container?.getSlot(player.selectedSlotIndex).typeId
        const age = Number(block.permutation.getState("farmersdelight:growth"))
        const random = Math.floor(Math.random() * 101)
        if (!player) return;
        const container: Container | undefined = player.getComponent(EntityInventoryComponent.componentId)?.container;
        try {
            if (itemId == "minecraft:bone_meal" && age < 7) {
                if (player?.getGameMode() == "creative") {
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
                world.playSound("item.bone_meal.use", block.location)

            }

            if (itemId == "minecraft:bone_meal" && age == 7) {
                world.playSound("item.bone_meal.use", block.location)
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
        const itemId = player?.getComponent("inventory")?.container?.getSlot(player.selectedSlotIndex).typeId
        const age = Number(block.permutation.getState("farmersdelight:growth"))
        const random = Math.floor(Math.random() * 101)
        const topLocation = { x: block.location.x, y: block.location.y + 1, z: block.location.z }
        if (!player) return;
        const container: Container | undefined = player.getComponent(EntityInventoryComponent.componentId)?.container;
        try {
            if (itemId == "minecraft:sugar_cane") {
                if (face != Direction.Up) return
                if (block.typeId == "farmersdelight:rich_soil_sugar_cane_bottom") {
                    world.playSound("dig.grass", block.location)
                    dimension.setBlockType(topLocation, "farmersdelight:rich_soil_sugar_cane_middle")
                };
                if (block.typeId == "farmersdelight:rich_soil_sugar_cane_middle") {
                    world.playSound("dig.grass", block.location)
                    dimension.setBlockType(topLocation, "farmersdelight:rich_soil_sugar_cane_top")
                };
                if (block.typeId == "farmersdelight:rich_soil_sugar_cane_top") {
                    world.playSound("dig.grass", block.location)
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
                        world.playSound("item.bone_meal.use", block.location)
                        if (!container) return;
                        ItemUtil.clearItem(container, player?.selectedSlotIndex)
                    }

                }
                if (block.typeId == "farmersdelight:rich_soil_sugar_cane_middle") {
                    if (dimension.getBlock(topLocation)?.typeId == "minecraft:air") {
                        dimension.setBlockType(topLocation, "farmersdelight:rich_soil_sugar_cane_top")
                        block.dimension.spawnParticle("minecraft:crop_growth_emitter", { x: block.location.x + 0.5, y: block.location.y + 0.5, z: block.location.z + 0.5 });
                        world.playSound("item.bone_meal.use", block.location)
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
        const itemId = player?.getComponent("inventory")?.container?.getSlot(player.selectedSlotIndex).typeId
        const growth = Number(block.permutation.getState("farmersdelight:growth"))
        const topLocation = { x: block.location.x, y: block.location.y + 1, z: block.location.z };
        const topBlockId = dimension.getBlock(topLocation)?.typeId;
        const age = Number(block.permutation.getState("farmersdelight:age"));
        const random = Math.floor(Math.random() * 101)
        if (!player) return;
        const container: Container | undefined = player.getComponent(EntityInventoryComponent.componentId)?.container;
        if (block.typeId == "farmersdelight:rice_block") {
            try {
                if (itemId == "minecraft:bone_meal") {
                    world.playSound("item.bone_meal.use", block.location)
                    if (player?.getGameMode() == "creative") {
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
                if (itemId == "minecraft:bone_meal" && growth < 3) {
                    world.playSound("item.bone_meal.use", block.location)
                    if (player?.getGameMode() == "creative") {
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
                    spawnLoot("farmersdelight/crops/farmersdelight_rice_riped", dimension, { x: block.location.x, y: block.location.y, z: block.location.z })
                }


            } catch (error) {

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
    @methodEventSub(world.beforeEvents.worldInitialize)
    register(args: WorldInitializeBeforeEvent) {
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:cabbage', new CabbageComponent());
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:onion', new OnionComponent());
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:tomato', new TomatoComponent());
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:beetroot', new Beetrootomponent());
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:carrot', new CarrotComponent());
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:potato', new PotatoComponent());
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:wheat', new WheatComponent());
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:torchflower', new TorchflowerComponent());
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:sugar_cane', new SugarCaneComponent());
        args.blockTypeRegistry.registerCustomComponent('farmersdelight:rice', new RiceComponent());
    }

}
