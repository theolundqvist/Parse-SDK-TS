import * as _ from "./Attributes";
export class AttributeBuilder {
    model;
    fallback = undefined;
    constructor(model) {
        this.model = model;
    }
    static create(model) {
        return new AttributeBuilder(model);
    }
    required(fallback) {
        return new RequiredAttributeBuilder(this.model, fallback);
    }
    default(fallback) {
        this.fallback = fallback;
        return this;
    }
    string(key) {
        return new _.OptionalString(this.model, key, this.fallback);
    }
    date(key) {
        return new _.OptionalDate(this.model, key, this.fallback);
    }
    number(key) {
        return new _.OptionalNumber(this.model, key, this.fallback);
    }
    boolean(key) {
        return new _.OptionalBoolean(this.model, key, this.fallback);
    }
    object(key) {
        return new _.OptionalObject(this.model, key, this.fallback);
    }
    array(key) {
        return new _.OptionalArray(this.model, key, this.fallback);
    }
    file(key) {
        return new _.File(this.model, key);
    }
    pointer(target, key) {
        return new _.Pointer(target, this.model, key);
    }
    stringPointer(target, key) {
        return new _.StringPointer(target, this.model, key);
    }
    relation(target, key) {
        return new _.Relation(target, this.model, key);
    }
    syntheticRelation(target, targetKey) {
        return new _.SyntheticRelation(target, this.model, targetKey);
    }
}
class RequiredAttributeBuilder {
    model;
    fallback;
    constructor(model, fallback) {
        this.model = model;
        this.fallback = fallback;
    }
    static create(model) {
        return new AttributeBuilder(model);
    }
    default(fallback) {
        this.fallback = fallback;
        return this;
    }
    string(key) {
        return new _.RequiredString(this.model, key, this.fallback);
    }
    date(key) {
        return new _.RequiredDate(this.model, key, this.fallback);
    }
    number(key) {
        return new _.RequiredNumber(this.model, key, this.fallback);
    }
    boolean(key) {
        return new _.RequiredBoolean(this.model, key, this.fallback);
    }
    object(key) {
        return new _.RequiredObject(this.model, key, this.fallback);
    }
    array(key) {
        return new _.RequiredArray(this.model, key, this.fallback);
    }
    warnRequired(key, type) {
        console.warn(`${this.model.className}(${key.name}) Required has no effect on ${type}`);
    }
    file(key) {
        this.warnRequired(key, "file");
        return new _.File(this.model, key);
    }
    pointer(target, key) {
        this.warnRequired(key, "pointer");
        return new _.Pointer(target, this.model, key);
    }
    stringPointer(target, key) {
        this.warnRequired(key, "stringPointer");
        return new _.StringPointer(target, this.model, key);
    }
    relation(target, key) {
        this.warnRequired(key, "relation");
        return new _.Relation(target, this.model, key);
    }
    syntheticRelation(target, targetKey) {
        this.warnRequired(targetKey, "syntheticRelation");
        return new _.SyntheticRelation(target, this.model, targetKey);
    }
}
