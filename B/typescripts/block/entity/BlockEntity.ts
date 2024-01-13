import { Dimension, Entity, ItemStack, Vector3, world } from "@minecraft/server";

const scoreboard = world.scoreboard;

export class BlockEntity {
    public blockEntityData(args: any): any {
        try {
            const entity: Entity = args.entity;
            const dimension: Dimension = entity?.dimension ?? undefined;
            const blockEntityDataLocation = entity.getDynamicProperty('farmersdelight:blockEntityDataLocation') as Vector3;
            const block = dimension.getBlock(blockEntityDataLocation);
            const scoreboardObjective = scoreboard.getObjective(entity.id) ?? null;
            return { entity: entity, dimension: dimension, blockEntityDataLocation: blockEntityDataLocation, block: block, scoreboardObjective: scoreboardObjective };
        } catch (error) {
            return undefined;
        }
    }
    public blockEntityLoot(args: any, id: string, list: any[] | undefined, amount: number = 1) {
        if (args.block && JSON.stringify(args.entity.location) !== JSON.stringify(args.blockEntityDataLocation)) args.entity.teleport(args.blockEntityDataLocation);
        if (args.block.typeId == id) return;
        if (list?.length) {
            for (const itemStack of list) {
                args.entity.dimension.spawnItem(new ItemStack(itemStack, amount), args.blockEntityDataLocation);
            }
        }
        BlockEntity.clearEntity(args);
    }
    public static clearEntity(args: any) {
        if (args.scoreboardObjective) {
            scoreboard.removeObjective(args.scoreboardObjective);
        }
        args.entity.triggerEvent('farmersdelight:despawn');
    }
}