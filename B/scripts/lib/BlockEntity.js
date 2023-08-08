import { ItemStack, world } from "@minecraft/server";
const scoreboard = world.scoreboard;

// 同步处理
export function loot(itemStack, block, entity, blockLocation, id, amount = 1, sco = null) {
    if (block) {
        if (JSON.stringify(entity.location) !== JSON.stringify(blockLocation)) {
            entity.teleport(blockLocation);
        }
    }
    if (block != id) {
        if (itemStack) {
            for (let index = 0; index < amount; index++) {
                entity.dimension.spawnItem(new ItemStack(itemStack), blockLocation);
            }
        }
        if (sco) {
            scoreboard.removeObjective(sco);
        }
        entity.triggerEvent('farmersdelight:despawn');
    }
}

export function getMap(entity, value) {
    const map = new Map();
    for (const tag of entity.getTags()) {
        if (JSON.parse(tag)) {
            const json = JSON.parse(tag);
            map.set(value, json[value]);
        } else {
            continue;
        }
    }
    if (map.get(value)) {
        return map
    }
    return undefined;
}

export function location(entity) {
    const tags = entity.getTags();
    const arr = Object.values(tags);
    for (const tag of arr) {
        if (JSON.parse(tag)) {
            const json = JSON.parse(tag);
            if (json.x !== false) {
                return json
            }
        }
    }
    return undefined;
}
// class
export default class BlockEntity {
    id;
    options;
    dimension;
    entity;
    scoreboardObjective;
    map = new Map();
    #tags;
    constructor(id, dimension, options) {
        this.id = id;
        this.dimension = dimension;
        this.options = options;
        const worldEntities = dimension.getEntities(options);
        for (const entity of worldEntities) {
            if (entity.typeId === id && entity.getTags().includes(JSON.stringify(entity.location))) {
                this.entity = entity;
                break;
            }
        }
        if (this.entity) {
            this.#tags = this.entity.getTags();
            this.scoreboardObjective = scoreboard.getObjective(this.entity.id);
        }
    }
    getDataMap(value) {
        if (this.entity) {
            for (const tag of this.#tags) {
                if (JSON.parse(tag)) {
                    const json = JSON.parse(tag);
                    this.map.set(value, json[value]);
                } else {
                    continue;
                }
            }
            if (this.map.get(value)) {
                return this.map
            }
        }
        return undefined;
    }
    blockLocation(entity) {
        for (const tag of entity.getTags()) {
            if (JSON.parse(tag)) {
                const json = JSON.parse(tag);
                if (json.x) {
                    return json
                }
            } else {
                continue;
            }
        }
        return undefined;
    }
}