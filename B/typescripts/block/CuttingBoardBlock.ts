import { Block, Container, Entity, EntityInventoryComponent, ItemStack, Player, Vector3, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { BlockWithEntity } from "./BlockWithEntity";
import { EntityUtil } from "../lib/EntityUtil";
import { farmersdelightBlockList, vanillaItemList } from "../data/recipe/cuttingBoardRecipe";
import { ItemUtil } from "../lib/ItemUtil";


export class CuttingBoardBlock extends BlockWithEntity {
    @methodEventSub(world.afterEvents.playerPlaceBlock)
    placeBlock(args: any) {
        const block: Block = args.block;
        if (block.typeId != "farmersdelight:cutting_board") return;
        const { x, y, z }: Vector3 = block.location;
        const entity: Entity = super.setBlock(args, { x: x + 0.5, y: y, z: z + 0.5 }, "farmersdelight:cutting_board");
        entity.setDynamicProperty("farmersdelight:blockEntityItemStackData", '{"item":"undefined"}');
    }
    @methodEventSub(world.afterEvents.itemUseOn)
    useOnBlock(args: any): void {
        if (args?.block?.typeId !== "farmersdelight:cutting_board") return;
        const data = super.entityBlockData(args, {
            type: 'farmersdelight:cutting_board',
            location: args.block.location
        });
        const player: Player = args.source;
        const container: Container | undefined = player.getComponent(EntityInventoryComponent.componentId)?.container;
        if (!data || !container) return;
        const entity: Entity = data.entity;
        const mainHand: ItemStack = args.itemStack;
        const itemStack: string = JSON.parse(entity.getDynamicProperty("farmersdelight:blockEntityItemStackData") as string)["item"];
        if (itemStack != "undefined" && !mainHand.hasTag('farmersdelight:is_knife')) {
            entity.dimension.spawnItem(new ItemStack(itemStack), entity.location);
            entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', '{"item":"undefined"}');
        }
        if (farmersdelightBlockList.includes(mainHand.typeId) || vanillaItemList.includes(mainHand.typeId) || mainHand.hasTag('farmersdelight:can_cut') || mainHand.hasTag('farmersdelight:is_knife')) {
            if (itemStack != 'undefined') {
                if (mainHand.hasTag('farmersdelight:is_knife')) {
                    const id = itemStack.split(':')[1];
                    entity.runCommandAsync("playsound block.farmersdelight.cutting_board @a ~ ~ ~ 1 1");
                    entity.runCommandAsync(`loot spawn ${entity.location.x} ${entity.location.y} ${entity.location.z} loot "farmersdelight/cutting_board/farmersdelight_${id}"`);
                    entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', '{"item":"undefined"}');
                    if (EntityUtil.gameMode(player)) {
                        ItemUtil.damageItem(container, player.selectedSlot);
                    }
                }
            } else if (!mainHand.hasTag('farmersdelight:is_knife')) {
                entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', `{"item":"${mainHand.typeId}"}`);
                if (EntityUtil.gameMode(player)) {
                    ItemUtil.claerItem(container, player.selectedSlot);
                }
            }
        }
    }
}