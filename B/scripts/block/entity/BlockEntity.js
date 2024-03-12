import { ItemStack, world, EntityInventoryComponent, system } from "@minecraft/server";
import ObjectUtil from "../../lib/ObjectUtil";
const scoreboard = world.scoreboard;
export class BlockEntity {
    //获取方块实体数据
    blockEntityData(entity) {
        try {
            const dimension = entity?.dimension ?? undefined;
            const blockEntityDataLocation = entity.getDynamicProperty('farmersdelight:blockEntityDataLocation');
            const block = dimension.getBlock(blockEntityDataLocation);
            const scoreboardObjective = scoreboard.getObjective(entity.typeId + entity.id) ?? null;
            const blockEntityData = { entity: entity, dimension: dimension, blockEntityDataLocation: blockEntityDataLocation, block: block, scoreboardObjective: scoreboardObjective };
            return blockEntityData;
        }
        catch (error) {
            return undefined;
        }
    }
    ;
    //对使用动态属性存储物品的方块实体检测掉落
    blockEntityLoot(args, id, list, amount = 1) {
        if (!ObjectUtil.isEqual(args.entity.location, args.blockEntityDataLocation))
            args.entity.teleport(args.blockEntityDataLocation);
        if (args.block?.typeId == id)
            return;
        if (list?.length) {
            for (const itemStack of list) {
                args.entity.dimension.spawnItem(new ItemStack(itemStack, amount), args.blockEntityDataLocation);
            }
        }
        BlockEntity.clearEntity(args);
    }
    ;
    //对使用容器组件存储物品的方块实体检测掉落 仅供橱柜使用
    entityContainerLoot(args, id) {
        if (!ObjectUtil.isEqual(args.entity.location, args.blockEntityDataLocation))
            args.entity.teleport(args.blockEntityDataLocation);
        if (args.block?.typeId == id)
            return;
        const entity = args.entity;
        const dimension = args.dimension;
        const container = entity.getComponent(EntityInventoryComponent.componentId)?.container;
        for (let i = 0, length = container.size; i < length; i++) {
            const itemStack = container.getItem(i);
            if (itemStack) {
                dimension.spawnItem(itemStack, entity.location);
            }
        }
        ;
        BlockEntity.clearEntity(args);
    }
    ;
    //清除方块实体
    static clearEntity(args) {
        if (args.scoreboardObjective) {
            scoreboard.removeObjective(args.entity.typeId + args.entity.id);
        }
        system.runTimeout(() => {
            args.entity.remove();
        });
    }
}
//# sourceMappingURL=BlockEntity.js.map