import { Block, Container, ContainerSlot, Entity, EntityInventoryComponent, ItemStack, ItemUseOnBeforeEvent, PlayerPlaceBlockAfterEvent, Vector3, system, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { BlockWithEntity } from "./BlockWithEntity";


const fireArrowEmpty: ItemStack = new ItemStack("farmersdelight:fire_0");
const emptyArrow: ItemStack = new ItemStack("farmersdelight:cooking_pot_arrow_0");

//potItem用于放置厨锅时暂时存储厨锅物品数据，方便读取lore
//别问我为啥不写类里面，因为写类里面的时候在constructor里还是正常的map，一到事件里就莫名其妙变成了undefined，ts也没报错，查不出来原因
let potItem = new Map();

export class CookingPotBlock extends BlockWithEntity {
    @methodEventSub(world.beforeEvents.itemUseOn)
    beforePlaceBlock(args: ItemUseOnBeforeEvent){
        potItem.set(args.source.id, args.itemStack);
    }
    @methodEventSub(world.afterEvents.playerPlaceBlock)
    placeBlock(args: PlayerPlaceBlockAfterEvent) {
        const itemStack = potItem.get(args.player.id) as ItemStack;
        const block: Block = args.block;
        if (block.typeId != "farmersdelight:cooking_pot") return;
        const lores: string[] = itemStack.getLore() ?? [];
        const { x, y, z }: Vector3 = block.location;
        const entity: Entity = super.setBlock(block.dimension, { x: x + 0.5, y: y, z: z + 0.5 }, "farmersdelight:cooking_pot");
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
            block.dimension.setBlockType(location, "minecraft:air");
        })
    }
}