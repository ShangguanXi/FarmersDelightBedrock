import { ItemStack, system, } from "@minecraft/server";
import { isSamePos } from "./ObjectUtil";
export function getAttachedBlock(entity, validate) {
    try {
        const pos = entity.getDynamicProperty("farmersdelight:blockEntityDataLocation");
        if (!pos)
            return undefined;
        if (validate && !isSamePos(entity.location, pos)) {
            entity.teleport(pos);
        }
        return entity.dimension.getBlock(pos);
    }
    catch {
        return undefined;
    }
}
export class BlockEntity {
    blockEntityData(entity) {
        try {
            const dimension = entity?.dimension ?? undefined;
            const blockEntityDataLocation = entity.getDynamicProperty("farmersdelight:blockEntityDataLocation");
            const block = dimension.getBlock(blockEntityDataLocation);
            return {
                entity: entity,
                dimension: dimension,
                blockEntityDataLocation: blockEntityDataLocation,
                block: block,
            };
        }
        catch (error) {
            return undefined;
        }
    }
    ;
    blockEntityLoot(args, id, list, amount = 1) {
        if (!isSamePos(args.entity.location, args.blockEntityDataLocation))
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
    entityContainerLoot(args, id) {
        if (!isSamePos(args.entity.location, args.blockEntityDataLocation))
            args.entity.teleport(args.blockEntityDataLocation);
        if (args.block?.typeId == id)
            return;
        const entity = args.entity;
        const dimension = args.dimension;
        const inventory = entity?.getComponent("inventory");
        const container = inventory?.container;
        for (let i = 0, length = container.size; i < length; i++) {
            const itemStack = container.getItem(i);
            if (itemStack) {
                dimension.spawnItem(itemStack, entity.location);
            }
        }
        BlockEntity.clearEntity(args);
    }
    ;
    static clearEntity(args) {
        system.run(() => {
            args.entity.remove();
        });
    }
}
