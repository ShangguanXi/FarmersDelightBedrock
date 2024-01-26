import { ItemStack, world } from "@minecraft/server";
import ObjectUtil from "../../lib/ObjectUtil";
const scoreboard = world.scoreboard;
export class BlockEntity {
    blockEntityData(args) {
        try {
            const entity = args.entity;
            const dimension = entity?.dimension ?? undefined;
            const blockEntityDataLocation = entity.getDynamicProperty('farmersdelight:blockEntityDataLocation');
            const block = dimension.getBlock(blockEntityDataLocation);
            const scoreboardObjective = scoreboard.getObjective(entity.typeId + entity.id) ?? null;
            return { entity: entity, dimension: dimension, blockEntityDataLocation: blockEntityDataLocation, block: block, scoreboardObjective: scoreboardObjective };
        }
        catch (error) {
            return undefined;
        }
    }
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
    static clearEntity(args) {
        if (args.scoreboardObjective) {
            scoreboard.removeObjective(args.entity.typeId + args.entity.id);
        }
        args.entity.triggerEvent('farmersdelight:despawn');
    }
}
//# sourceMappingURL=BlockEntity.js.map