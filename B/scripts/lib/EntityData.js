export class EntityData {
    entity;
    #tags;
    #id;
    constructor(entity, id) {
        this.entity = entity;
        this.#tags = this.entity.getTags();
        this.#id = id;
    }
    removeAllTag() {
        for (const tag of this.#tags) {
            this.entity.removeTag(tag);
        }
    }
    getEntityData() {
        for (const tag of this.#tags) {
            if (tag.split('.')[0] == this.#id) {
                const str = tag.split('.')[0];
                const value = parseInt(tag.split('.')[1]);
                return [value, str, tag];
            }
        }
        this.entity.addTag(`${this.#id}.0`);
    }
    setEntityData(data, entity, set, count) {
        if (data) {
            entity.removeTag(data[2]);
            switch (set) {
                case 'add':
                    entity.addTag(`${data[1]}.${data[0] + count}`);
                    break;
                case 'remove':
                    entity.addTag(`${data[1]}.${data[0] - count}`);
                    break;
            }
        }
    }
}