/// <reference types="parse" />
import { Primitive } from "../db";
import { Activatable } from "../util";
import { Key } from "../misc/Key";
import { Query } from "../misc/Query";
import { IDbModel } from "../models/IDbModel";
export declare abstract class AttributeBase {
    abstract toString(): string;
    printable(): any;
    toJSON(): string;
}
export declare class Attribute<T> extends AttributeBase {
    protected readonly obj: IDbModel;
    protected readonly data: Primitive.Object;
    protected readonly key: string;
    protected readonly fallback?: T;
    constructor(obj: IDbModel, key: Key, fallback?: T);
    /** Get a locally available field */
    get(): T;
    /** Update a field */
    set(value: T): this;
    toString(): string;
    printable(): any;
}
export declare class OptionalAttribute<T> extends Attribute<T | undefined> {
    getOrElse(defaultValue: T): T;
    has(): boolean;
}
/** Required means that the field will not be undefined in DB, it can still be null if we query with select or exclude or if object has not been saved yet */
export declare class RequiredString extends Attribute<string> {
}
/** Required means that the field will not be undefined in DB, it can still be null if we query with select or exclude or if object has not been saved yet */
export declare class RequiredBoolean extends Attribute<boolean> {
}
/** Required means that the field will not be undefined in DB, it can still be null if we query with select or exclude or if object has not been saved yet */
export declare class RequiredDate extends Attribute<Date> {
}
export declare class OptionalString extends OptionalAttribute<string> {
}
export declare class OptionalBoolean extends OptionalAttribute<boolean> {
}
export declare class OptionalDate extends OptionalAttribute<Date> {
}
export declare class RequiredObject<Object> extends Attribute<Object> {
}
export declare class OptionalObject<Object> extends OptionalAttribute<Object> {
}
interface Arrayable<T> {
    append(item: T): this;
    addUnique(item: T): this;
    remove(item: T): this;
}
export declare class RequiredArray<T> extends Attribute<T[]> implements Arrayable<T> {
    /** Add an item to the end of a list */
    append(item: T): this;
    /** Uniquely add an item to a list */
    addUnique(item: T): this;
    /** Remove an item from a list */
    remove(item: T): this;
}
export declare class OptionalArray<T> extends Attribute<T[] | undefined> implements Arrayable<T> {
    /** Add an item to the end of a list */
    append(item: T): this;
    /** Uniquely add an item to a list */
    addUnique(item: T): this;
    /** Remove an item from a list */
    remove(item: T): this;
}
interface Incrementable<T> {
    increment(value: T): this;
    decrement(value: T): this;
}
export declare class RequiredNumber extends Attribute<number> implements Incrementable<number> {
    /** Increment a field */
    increment(value: number): this;
    /** Decrement a field */
    decrement(value: number): this;
}
export declare class OptionalNumber extends Attribute<number | undefined> implements Incrementable<number> {
    /** Increment a field */
    increment(value: number): this;
    /** Decrement a field */
    decrement(value: number): this;
}
export declare class File extends Attribute<Primitive.File | undefined> {
    /** The url of the file, set src of img to this url for example */
    url(): string | undefined;
    toString(): string;
    printable(): {
        url: string | undefined;
    };
}
export declare class Pointer<T extends IDbModel> extends Attribute<T | undefined> {
    private readonly type;
    constructor(type: Activatable<T>, obj: IDbModel, key: Key);
    get(): T | undefined;
    set(obj: IDbModel | string | undefined): this;
    toString(): string;
    printable(): any;
}
export declare class StringPointer<T extends IDbModel> extends AttributeBase {
    private readonly type;
    private readonly obj;
    private readonly data;
    private readonly key;
    constructor(type: Activatable<T>, obj: IDbModel, key: Key);
    private className;
    get(): T | undefined;
    set(obj: IDbModel | string | undefined): this;
    toString(): string;
    printable(): any;
}
export declare class Relation<T extends IDbModel> extends AttributeBase {
    private readonly data;
    private readonly key;
    private readonly type;
    constructor(type: Activatable<T>, obj: IDbModel, key: Key);
    add(obj: T): this;
    remove(obj: T): this;
    query(): Query<T>;
    findAll(options?: {
        select: Key[];
        limit: number;
    }): Promise<T[]>;
    toString(): string;
    printable(): any;
}
/**
 * Creates a synthetic relation attribute from the fact that the target class has a pointer/relation to the current class.
 */
export declare class SyntheticRelation<T extends IDbModel> extends AttributeBase {
    private readonly data;
    private readonly type;
    private readonly targetKey;
    constructor(type: Activatable<T>, obj: IDbModel, targetKey: Key);
    query(): Query<T>;
    findAll(options?: {
        select: Key[];
        limit: number;
    }): Promise<T[]>;
    toString(): string;
    printable(): any;
}
/** Obsolete (name change), use SyntheticRelation instead */
export declare class SynthesizedRelation<T extends IDbModel> extends SyntheticRelation<T> {
}
export {};
