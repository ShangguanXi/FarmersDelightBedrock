import {
    Block,
    Container,
    Dimension,
    Entity,
    EntityInventoryComponent,
    ItemStack,
    system,
    Vector3,
} from "@minecraft/server";
import { isSamePos } from "./ObjectUtil";

export function getAttachedBlock(entity: Entity, validate?: boolean): Block | undefined {
    try {
        const pos = entity.getDynamicProperty("farmersdelight:blockEntityDataLocation") as Vector3;
        if (!pos) return undefined;
        if (validate && !isSamePos(entity.location, pos)) {
            entity.teleport(pos);
        }
        return entity.dimension.getBlock(pos);
    } catch {
        return undefined;
    }
}

/**
 * @deprecated
 */
export class BlockEntity {
    //获取方块实体数据
    public blockEntityData(entity: Entity): BlockEntityData | undefined {
        try {
            const dimension: Dimension = entity?.dimension ?? undefined;
            const blockEntityDataLocation = entity.getDynamicProperty("farmersdelight:blockEntityDataLocation") as Vector3;
            const block = dimension.getBlock(blockEntityDataLocation) as Block;
            return {
                entity: entity,
                dimension: dimension,
                blockEntityDataLocation: blockEntityDataLocation,
                block: block,
            };
        } catch (error) {
            return undefined;
        }
    };

    //对使用动态属性存储物品的方块实体检测掉落
    public blockEntityLoot(args: BlockEntityData, id: string, list: any[] | undefined, amount: number = 1) {
        if (!isSamePos(args.entity.location, args.blockEntityDataLocation)) args.entity.teleport(args.blockEntityDataLocation);
        if (args.block?.typeId == id) return;
        if (list?.length) {
            for (const itemStack of list) {
                args.entity.dimension.spawnItem(new ItemStack(itemStack, amount), args.blockEntityDataLocation);
            }
        }
        BlockEntity.clearEntity(args);
    };

    //对使用容器组件存储物品的方块实体检测掉落
    public entityContainerLoot(args: BlockEntityData, id: string) {
        if (!isSamePos(args.entity.location, args.blockEntityDataLocation)) args.entity.teleport(args.blockEntityDataLocation);
        if (args.block?.typeId == id) return;
        const entity = args.entity as Entity;
        const dimension = args.dimension;
        const inventory = entity?.getComponent("inventory") as EntityInventoryComponent;
        const container = inventory?.container as Container;
        for (let i = 0, length = container.size; i < length; i++) {
            const itemStack = container.getItem(i);
            if (itemStack) {
                dimension.spawnItem(itemStack, entity.location);
            }
        }

        BlockEntity.clearEntity(args);
    };

    //清除方块实体
    public static clearEntity(args: BlockEntityData) {
        system.run(() => {
            args.entity.remove();
        });
    }
}

export interface BlockEntityData {
    readonly entity: Entity,
    readonly dimension: Dimension,
    readonly blockEntityDataLocation: Vector3,
    readonly block: Block,
}