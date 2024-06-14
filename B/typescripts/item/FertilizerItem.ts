import { ItemStack, Player, ItemUseOnAfterEvent, world, Block, EntityInventoryComponent, Container } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { ItemUtil } from "../lib/ItemUtil";
export class FertilizerItem {
    @methodEventSub(world.afterEvents.itemUseOn)
    itemUseOn(args: ItemUseOnAfterEvent) {
        const player: Player = args.source;
        const block: Block = args.block;
        const itemStack: ItemStack | undefined = args.itemStack;
        const itemAllTag = itemStack.getTags();
        //取[0,100]的随机整数
        const random = Math.floor(Math.random() * 101)
        for (const itemFullTag of itemAllTag) {
            const itemTag = itemFullTag.split('.')[0];
            const probability = Number(itemFullTag.split('.')[1]);
            const container: Container | undefined = player.getComponent(EntityInventoryComponent.componentId)?.container;
            if (!container) return;
            if (itemTag == "farmersdelight:is_fertilizer" && block.typeId == "minecraft:composter") {
                if (random <= probability) {
                    block.setPermutation(block.permutation.withState("composter_fill_level", Number(block.permutation.getState("composter_fill_level")) + 1));
                }
                block.dimension.spawnParticle("minecraft:crop_growth_emitter", { x: block.location.x + 0.5, y: block.location.y + 0.5, z: block.location.z + 0.5 });
                ItemUtil.clearItem(container, player.selectedSlotIndex);
            }
        }

    }
}