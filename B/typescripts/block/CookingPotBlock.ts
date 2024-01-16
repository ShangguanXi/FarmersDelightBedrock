import { Block, Container, ContainerSlot, Direction, Entity, EntityInventoryComponent, ItemStack, Vector3, system, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { BlockWithEntity } from "./BlockWithEntity";


const fireArrowEmpty: ItemStack = new ItemStack("farmersdelight:fire_0");
const emptyArrow: ItemStack = new ItemStack("farmersdelight:cooking_pot_arrow_0");

export class CookingPotBlock extends BlockWithEntity {
    @methodEventSub(world.afterEvents.itemUseOn)
    placeBlock(args: any) {
        const itemStack: ItemStack = args.itemStack;
        const block: Block = args.block;
        if (itemStack.typeId != "farmersdelight:cooking_pot") return;
        const { x, y, z }: Vector3 = block.location;
        const lores: string[] = itemStack.getLore() ?? [];
        let V3: Vector3;
        const faceLocation: Direction = args.blockFace;
        switch (faceLocation) {
            case Direction.Up:
                V3 = { x: x + 0.5, y: y + 1, z: z + 0.5 };
                break;
            case Direction.Down:
                V3 = { x: x + 0.5, y: y - 1, z: z + 0.5 };
                break;
            case Direction.East:
                V3 = { x: x + 0.5 + 1, y: y, z: z + 0.5 };
                break;
            case Direction.North:
                V3 = { x: x + 0.5, y: y, z: z + 0.5 - 1 };
                break;
            case Direction.South:
                V3 = { x: x + 0.5, y: y, z: z + 0.5 + 1 };
                break;
            case Direction.West:
                V3 = { x: x + 0.5 - 1, y: y, z: z + 0.5 };
                break;
        }
        const entity: Entity = super.setBlock(args, V3, "farmersdelight:cooking_pot");
        entity.nameTag = "farmersdelight厨锅";
        const container: Container | undefined = entity.getComponent(EntityInventoryComponent.componentId)?.container;
        container?.setItem(9, emptyArrow);
        container?.setItem(10, fireArrowEmpty);
        if (!lores.length) return;
        for (const lore of lores) {
            const data: RegExpMatchArray | null = lore.match(/\d+|\S+:\S+/g);
            if (!data) continue;
            const slot: ContainerSlot | undefined = container?.getSlot(6);
            const cookingItemStack: ItemStack = new ItemStack(data[1]);
            cookingItemStack.amount = parseInt(data[0]);
            slot?.setItem(cookingItemStack);
        }
    }
    @methodEventSub(world.beforeEvents.playerBreakBlock, { blockTypes: ["farmersdelight:cooking_pot"] })
    breakBlock(args: any) {
        const block: Block = args.block;
        const location: Vector3 = block.location;
        args.cancel = true;
        system.run(() => {
            block.dimension.fillBlocks(location, location, "minecraft:air");
        })
    }
}