import { Dimension, Entity, ItemStack, Vector3, world, Block, ScoreboardObjective, Container, EntityInventoryComponent, system } from "@minecraft/server";
import ObjectUtil from "../../lib/ObjectUtil";

const scoreboard = world.scoreboard;

export class BlockEntity {
    //获取方块实体数据
    public blockEntityData(entity: Entity): BlockEntityData | undefined {
        try {
            const dimension: Dimension = entity?.dimension ?? undefined;
            const blockEntityDataLocation = entity.getDynamicProperty('farmersdelight:blockEntityDataLocation') as Vector3;
            const block = dimension.getBlock(blockEntityDataLocation) as Block;
            const scoreboardObjective = scoreboard.getObjective(entity.typeId + entity.id) ?? null;
            const blockEntityData: BlockEntityData = { entity: entity, dimension: dimension, blockEntityDataLocation: blockEntityDataLocation, block: block, scoreboardObjective: scoreboardObjective }
            return blockEntityData;
        } catch (error) {
            return undefined;
        }
    };
    //对使用动态属性存储物品的方块实体检测掉落
    public blockEntityLoot(args: BlockEntityData, id: string, list: any[] | undefined, amount: number = 1) {
        if (!ObjectUtil.isEqual(args.entity.location, args.blockEntityDataLocation)) args.entity.teleport(args.blockEntityDataLocation);
        if (args.block?.typeId == id) return;
        if (list?.length) {
            for (const itemStack of list) {
                args.entity.dimension.spawnItem(new ItemStack(itemStack, amount), args.blockEntityDataLocation);
            }
        }
        BlockEntity.clearEntity(args);
    };
    //对使用容器组件存储物品的方块实体检测掉落 仅供橱柜使用
    public entityContainerLoot(args: BlockEntityData, id: string){
        if (!ObjectUtil.isEqual(args.entity.location, args.blockEntityDataLocation)) args.entity.teleport(args.blockEntityDataLocation);
        if (args.block?.typeId == id) return;
        const entity = args.entity as Entity;
        const dimension = args.dimension;
        const container = entity.getComponent(EntityInventoryComponent.componentId)?.container as Container;
        for (let i = 0, length = container.size; i < length; i++) {
            const itemStack = container.getItem(i)
            if (itemStack) {
                dimension.spawnItem(itemStack, entity.location)
            }
        };
        BlockEntity.clearEntity(args);
    };
    //清除方块实体
    public static clearEntity(args: BlockEntityData) {
        if (args.scoreboardObjective) {
            scoreboard.removeObjective(args.entity.typeId + args.entity.id);
        }
        system.runTimeout(() => {
            args.entity.remove();
        });
    }
}

export interface BlockEntityData{
    readonly entity: Entity,
    readonly dimension: Dimension, 
    readonly blockEntityDataLocation: Vector3, 
    readonly block: Block, 
    readonly scoreboardObjective: ScoreboardObjective | null
}