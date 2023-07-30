import { ItemStack } from "@minecraft/server";

// 同步处理
export function loot(itemStack, block, entity, blockLocation, id, amount = 1) {
    if (itemStack) {
        if (block !== id) {
            for (let index = 0; index < amount; index++) {
                entity.dimension.spawnItem(new ItemStack(itemStack), entity.location);
            }
            entity.triggerEvent('farmersdelight:despawn');
        }
    } else if (block !== id) {
        entity.triggerEvent('farmersdelight:despawn');
    }
    if (block.typeId !== 'farmersdelight:cutting_board') {
        entity.teleport(blockLocation);
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
// class
export default class BlockEntity {
    id;
    options;
    dimension;
    entity;
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