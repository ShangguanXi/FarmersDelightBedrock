import { ItemStack, world } from "@minecraft/server";
const scoreboard = world.scoreboard;


export default class BlockEntity {
    dimension;
    entity;
    block;
    scoreboardObjective;
    blockEntityDataLocation;
    constructor(entity = null, block, options) {
        if (!entity) {
            this.block = block;
            this.dimension = this.block.dimension;
            this.options = options;
            const worldEntities = this.dimension.getEntities(options);
            for (const entity of worldEntities) {
                if (JSON.stringify(entity.getDynamicProperty('farmersdelight:blockEntityDataLocation')) == JSON.stringify(entity.location)) {
                    this.entity = entity;
                    break;
                }
            }
            if (this.entity) {
                this.scoreboardObjective = scoreboard.getObjective(this.entity.id) ?? null;
                this.blockEntityDataLocation = this.entity.getDynamicProperty('farmersdelight:blockEntityDataLocation');
            }
        } else {
            this.entity = entity
            this.dimension = entity.dimension;
            this.blockEntityDataLocation = entity.getDynamicProperty('farmersdelight:blockEntityDataLocation');
            this.block = this.dimension.getBlock(this.blockEntityDataLocation);
            this.scoreboardObjective = scoreboard.getObjective(entity.id) ?? null;
        }
    }
    getBlockEntityData(property) {
        return this.entity.getDynamicProperty(property) ?? undefined;
    }
    clearEntity() {
        if (this.scoreboardObjective) {
            scoreboard.removeObjective(this.scoreboardObjective);
        }
        this.entity.triggerEvent('farmersdelight:despawn');
    }
    blockEntityLoot(itemStackList, id, amount = 1) {
        if (this.block) {
            if (JSON.stringify(this.entity.location) !== JSON.stringify(this.blockEntityDataLocation)) {
                this.entity.teleport(this.blockEntityDataLocation);
            }
        }
        if (this.block.typeId != id) {
            if (itemStackList?.length) {
                for (const itemStack of itemStackList) {
                    for (let index = 0; index < amount; index++) {
                        this.entity.dimension.spawnItem(new ItemStack(itemStack), this.blockEntityDataLocation);
                    }
                }
            }
            this.clearEntity();
        }
    }
}