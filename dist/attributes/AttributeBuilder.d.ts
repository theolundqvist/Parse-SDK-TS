import { TypedKey } from "../misc/Key";
import { IDbModel } from "../models/IDbModel";
import { Activatable } from "../util";
import * as _ from "./Attributes";
export declare class AttributeBuilder<T extends IDbModel> {
    private readonly model;
    private fallback;
    constructor(model: T);
    static create<T extends IDbModel>(model: T): AttributeBuilder<T>;
    required(fallback?: any): RequiredAttributeBuilder<T>;
    default(fallback: any): this;
    string(key: TypedKey<T>): _.OptionalString;
    date(key: TypedKey<T>): _.OptionalDate;
    number(key: TypedKey<T>): _.OptionalNumber;
    boolean(key: TypedKey<T>): _.OptionalBoolean;
    object(key: TypedKey<T>): _.OptionalObject<any>;
    array<G>(key: TypedKey<T>): _.OptionalArray<G>;
    file(key: TypedKey<T>): _.File;
    pointer<G extends IDbModel, T extends IDbModel>(target: Activatable<G>, key: TypedKey<T>): _.Pointer<G>;
    stringPointer<G extends IDbModel>(target: Activatable<G>, key: TypedKey<T>): _.StringPointer<G>;
    relation<G extends IDbModel>(target: Activatable<G>, key: TypedKey<T>): _.Relation<G>;
    syntheticRelation<G extends IDbModel>(target: Activatable<G>, targetKey: TypedKey<T>): _.SyntheticRelation<G>;
}
declare class RequiredAttributeBuilder<T extends IDbModel> {
    private readonly model;
    private fallback;
    constructor(model: T, fallback: any);
    static create<T extends IDbModel>(model: T): AttributeBuilder<T>;
    default(fallback: any): this;
    string(key: TypedKey<T>): _.RequiredString;
    date(key: TypedKey<T>): _.RequiredDate;
    number(key: TypedKey<T>): _.RequiredNumber;
    boolean(key: TypedKey<T>): _.RequiredBoolean;
    object(key: TypedKey<T>): _.RequiredObject<any>;
    array<G>(key: TypedKey<T>): _.RequiredArray<G>;
    private warnRequired;
    file(key: TypedKey<T>): _.File;
    pointer<G extends IDbModel, T extends IDbModel>(target: Activatable<G>, key: TypedKey<T>): _.Pointer<G>;
    stringPointer<G extends IDbModel>(target: Activatable<G>, key: TypedKey<T>): _.StringPointer<G>;
    relation<G extends IDbModel>(target: Activatable<G>, key: TypedKey<T>): _.Relation<G>;
    syntheticRelation<G extends IDbModel>(target: Activatable<G>, targetKey: TypedKey<T>): _.SyntheticRelation<G>;
}
export {};
