export class EntityData {
    entity;
    #tags;
    #id;
    value;
    str;
    tag;
    constructor(entity, id) {
        this.entity = entity;
        this.#tags = this.entity.getTags();
        this.#id = id;
        for (const tag of this.#tags) {
            if (tag.split('.')[0] == this.#id) {
                this.str = tag.split('.')[0];
                this.value = parseInt(tag.split('.')[1]);
                this.tag = tag;
            }
        }
        if (!this.tag) {
            this.entity.addTag(`${this.#id}.0`);
        }
    }
    removeAllTag() {
        for (const tag of this.#tags) {
            this.entity.removeTag(tag);
        }
    }
    setEntityData(set, count, max = Number.MAX_SAFE_INTEGER) {
        if (this.tag) {
            this.entity.removeTag(this.tag);
            switch (set) {
                case 'add':
                    this.entity.addTag(`${this.str}.${this.value + count > max ? max : this.value + count}`);
                    break;
                case 'remove':
                    this.entity.addTag(`${this.str}.${this.value - count < 0 ? 0 : this.value - count}`);
                    break;
                case 'set':
                    this.entity.addTag(`${this.str}.${count}`);
                    break;
            }
        }
    }
}