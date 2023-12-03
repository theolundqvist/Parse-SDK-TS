import { Primitive } from "../db";
import { wrap } from "../util";
import { Query } from "../misc/Query";
// SOME BASE CLASSES
//
export class AttributeBase {
    printable() {
        const temp = {
            ...this,
        };
        delete temp.data;
        delete temp.type;
        delete temp.obj;
        return temp;
    }
    toJSON() {
        const temp = {
            ...this,
        };
        delete temp.obj;
        return JSON.stringify(temp);
    }
}
export class Attribute extends AttributeBase {
    obj;
    data;
    key;
    fallback;
    constructor(obj, key, fallback) {
        super();
        this.data = obj.data;
        this.obj = obj;
        this.key = key.name;
        this.fallback = fallback;
    }
    /** Get a locally available field */
    get() {
        const d = this.data.get(this.key);
        return d;
        // // if fallback is not specified
        // if (this.fallback === undefined) return d;
        // // if fallback is specified
        // return d === undefined ? this.fallback : d;
    }
    /** Update a field */
    set(value) {
        this.data.set(this.key, value);
        return this;
    }
    toString() {
        return `${this.get()}`;
    }
    printable() {
        return this.get();
    }
}
export class OptionalAttribute extends Attribute {
    getOrElse(defaultValue) {
        const d = this.data.get(this.key);
        return d === undefined || d === null ? defaultValue : d;
    }
    has() {
        return this.data.has(this.key) && this.get() !== undefined && this.get() !== null;
    }
}
// STANDARD ATTRIBUTES
/** Required means that the field will not be undefined in DB, it can still be null if we query with select or exclude or if object has not been saved yet */
export class RequiredString extends Attribute {
}
/** Required means that the field will not be undefined in DB, it can still be null if we query with select or exclude or if object has not been saved yet */
export class RequiredBoolean extends Attribute {
}
/** Required means that the field will not be undefined in DB, it can still be null if we query with select or exclude or if object has not been saved yet */
export class RequiredDate extends Attribute {
}
export class OptionalString extends OptionalAttribute {
}
export class OptionalBoolean extends OptionalAttribute {
}
export class OptionalDate extends OptionalAttribute {
}
//TODO: add typed objects
export class RequiredObject extends Attribute {
}
export class OptionalObject extends OptionalAttribute {
}
export class RequiredArray extends Attribute {
    /** Add an item to the end of a list */
    append(item) {
        this.data.add(this.key, item);
        return this;
    }
    /** Uniquely add an item to a list */
    addUnique(item) {
        this.data.addUnique(this.key, item);
        return this;
    }
    /** Remove an item from a list */
    remove(item) {
        this.data.remove(this.key, item);
        return this;
    }
}
export class OptionalArray extends Attribute {
    /** Add an item to the end of a list */
    append(item) {
        this.data.add(this.key, item);
        return this;
    }
    /** Uniquely add an item to a list */
    addUnique(item) {
        this.data.addUnique(this.key, item);
        return this;
    }
    /** Remove an item from a list */
    remove(item) {
        this.data.remove(this.key, item);
        return this;
    }
}
export class RequiredNumber extends Attribute {
    /** Increment a field */
    increment(value) {
        this.data.increment(this.key, value);
        return this;
    }
    /** Decrement a field */
    decrement(value) {
        this.data.decrement(this.key, value);
        return this;
    }
}
export class OptionalNumber extends Attribute {
    /** Increment a field */
    increment(value) {
        this.data.increment(this.key, value);
        return this;
    }
    /** Decrement a field */
    decrement(value) {
        this.data.decrement(this.key, value);
        return this;
    }
}
export class File extends Attribute {
    /** The url of the file, set src of img to this url for example */
    url() {
        return this.get()?.url();
    }
    toString() {
        return `File<${this.get()?.url().toString()}>`;
    }
    printable() {
        if (this.url() == undefined) {
            return { url: undefined };
        }
        else
            return { url: this.url() };
    }
}
export class Pointer extends Attribute {
    type;
    constructor(type, obj, key) {
        super(obj, key);
        this.type = type;
    }
    get() {
        const d = this.data.get(this.key);
        return wrap(this.type, d);
    }
    set(obj) {
        if (typeof obj === "object") {
            this.data.set(this.key, obj.data);
        }
        else {
            this.data.set(this.key, obj);
        }
        return this;
    }
    toString() {
        return `Pointer<${this.data.get(this.key).className}, ${this.data.get(this.key).id}>`;
    }
    printable() {
        const temp = {
            ...this,
        };
        delete temp.data;
        delete temp.obj;
        delete temp.type;
        temp.attributeType = "Pointer";
        temp.targetClassName = this.data.get(this.key).className;
        temp.targetId = this.data.get(this.key).id;
        return temp;
    }
}
export class StringPointer extends AttributeBase {
    type;
    obj;
    data;
    key;
    constructor(type, obj, key) {
        super();
        this.type = type;
        this.obj = obj;
        this.key = key.name;
        this.data = obj.data;
    }
    className = () => (new this.type()).className;
    get() {
        const d = this.data?.get(this.key);
        if (d === undefined)
            return undefined;
        const t = Primitive.Object.extend(this.className());
        const pointer = t.createWithoutData(d);
        return wrap(this.type, pointer);
    }
    set(obj) {
        if (typeof obj === "string") {
            this.data.set(this.key, obj);
        }
        else if (typeof obj === "undefined") {
            this.data.set(this.key, undefined);
        }
        else {
            this.data.set(this.key, obj.id);
        }
        return this;
    }
    toString() {
        return `Pointer<${this.className()}, ${this.data.get(this.key)}>`;
    }
    printable() {
        const temp = {
            ...this,
        };
        delete temp.data;
        delete temp.obj;
        delete temp.type;
        temp.attributeType = "Pointer";
        temp.targetClassName = this.className();
        temp.targetId = this.data.get(this.key);
        return temp;
    }
}
export class Relation extends AttributeBase {
    data;
    key;
    type;
    constructor(type, obj, key) {
        super();
        this.type = type;
        this.data = obj.data;
        this.key = key.name;
    }
    add(obj) {
        this.data.relation(this.key).add(obj.data);
        return this;
    }
    remove(obj) {
        this.data.relation(this.key).remove(obj.data);
        return this;
    }
    query() {
        return Query.wrap(this.type, this.data.relation(this.key).query());
    }
    async findAll(options) {
        const q = this.query();
        if (options?.select)
            q.select(...options.select);
        if (options?.limit)
            q.limit(options.limit);
        return q.findAll();
    }
    toString() {
        return `Relation<${this.data.relation(this.key).targetClassName}>`;
    }
    printable() {
        const temp = {
            ...this,
        };
        delete temp.data;
        delete temp.obj;
        delete temp.type;
        temp.attributeType = "Relation";
        temp.targetClassName = this.query().targetClassName;
        return temp;
    }
}
/**
 * Creates a synthetic relation attribute from the fact that the target class has a pointer/relation to the current class.
 */
export class SyntheticRelation extends AttributeBase {
    data;
    type;
    targetKey;
    constructor(type, obj, targetKey) {
        super();
        this.type = type;
        this.data = obj.data;
        this.targetKey = targetKey;
    }
    query() {
        return new Query(this.type).equalTo(this.targetKey, this.data);
    }
    async findAll(options) {
        const q = this.query();
        if (options?.select)
            q.select(...options.select);
        if (options?.limit)
            q.limit(options.limit);
        return q.findAll();
    }
    toString() {
        return `SyntheticRelation<${this.query().targetClassName}, ${this.targetKey.name}>`;
    }
    printable() {
        const temp = {
            ...this,
        };
        delete temp.data;
        delete temp.obj;
        delete temp.type;
        temp.attributeType = "SyntheticRelation";
        temp.targetClassName = this.query().targetClassName;
        temp.targetKey = this.targetKey.name;
        return temp;
    }
}
/** Obsolete (name change), use SyntheticRelation instead */
export class SynthesizedRelation extends SyntheticRelation {
}
