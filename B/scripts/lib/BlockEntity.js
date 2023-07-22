
export default class BlockEntity {
    id;
    options;
    dimension;
    entity;
    map = new Map();
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
    }
    getEntity() {
        return this.entity;
    }
    getDataMap(value) {
        if (this.entity) {
            for (const tag of this.entity.getTags()) {
                if (JSON.parse(tag)) {
                    const json = JSON.parse(tag);
                    this.map.set(value, json[value]);
                }else{
                    continue;
                }
            }
            if (this.map.get(value)) {
                return this.map
            }
        }
        return undefined;
    }
    loot() {
        for (const [key, value] of map) {
            if (value.id) {
                const item = new ItemStack(value.id);
                this.dimension.spawnItem(item, this.entity.location);
            }
        }
    }
}