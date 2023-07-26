import { ItemStack } from "@minecraft/server";

// 同步处理
export function loot(itemStack, block, entity) {
    if (itemStack) {
        if (block !== 'farmersdelight:cutting_board') {
            entity.dimension.spawnItem(new ItemStack(itemStack), entity.location);
            entity.triggerEvent('farmersdelight:despawn');
        }
    } else if (block !== 'farmersdelight:cutting_board') {
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
    getEntity() {
        return this.entity;
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