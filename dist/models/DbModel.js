import { Primitive } from "../db";
import { DbError } from "../misc/DbError";
import { AttributeBase, AttributeBuilder } from "../attributes";
export function field(model) {
    return AttributeBuilder.create(model);
}
export class DbModel {
    data;
    /** The id of the object */
    id;
    /** The database className of the object */
    className;
    constructor(data) {
        if (!data)
            throw new Error("Tried to create DbModel of undefined");
        this.data = data;
        this.id = data.id;
        this.className = data.className;
        // this.className = data.className;
    }
    static createWithoutData(target) {
        return new target(new Primitive.Object(target.className));
    }
    field() {
        return AttributeBuilder.create(this);
    }
    /** The time the object was created */
    createdAt() {
        return this.data.createdAt;
    }
    /** The time the object was last updated */
    updatedAt() {
        return this.data.updatedAt;
    }
    /** Save the changes to the database */
    async save(options = {}) {
        return this.data.save(null, options)
            .then((u) => {
            this.id = u.id;
            return this;
        }).catch(DbError.parse);
    }
    async saveAsMaster() {
        return this.save({ useMasterKey: true });
    }
    /** Delete the object from the database */
    async destroy(options = {}) {
        return this.data.destroy(options).catch(DbError.parse);
    }
    /** Returns true if the object has never been saved to the Parse.*/
    isNew() {
        return this.data.isNew();
    }
    getACL() {
        return this.data.getACL();
    }
    async fetch(options = {}) {
        return this.data.fetch(options).then(() => this).catch(DbError.parse);
    }
    printable() {
        const temp = {
            ...this,
        };
        delete temp.data;
        Object.keys(temp).forEach((k) => {
            if (temp[k] instanceof AttributeBase) {
                temp[k] = temp[k].printable();
            }
        });
        temp.createdAt = this.createdAt();
        temp.updatedAt = this.updatedAt();
        return temp;
    }
}
