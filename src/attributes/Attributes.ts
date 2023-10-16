import { Primitive } from "../db";
import { Activatable, wrap } from "../util/Wrapper";
import {  DbModel } from "../models/DbModel";
import { Key } from "../misc/Key";
import { Query } from "../misc/Query";

export abstract class AttributeBase {
  abstract toString(): string;
}

class Attribute<T> extends AttributeBase {
  protected data: Primitive.Object;
  readonly key: string;
  constructor(obj: DbModel, key: Key) {
    super();
    this.data = obj.data;
    this.key = key.name;
  }
  /** Get a locally available field */
  get(): T {
    return this.data.get(this.key);
  }

  /** Update a field */
  set(value: T): this {
    this.data.set(this.key, value);
    return this;
  }

  toString(): string {
    return `${this.get()}`
  }
}

/** Required means that the field will not be undefined in DB, it can still be null if we query with select or exclude or if object has not been saved yet */
export class RequiredString extends Attribute<string>{}
/** Required means that the field will not be undefined in DB, it can still be null if we query with select or exclude or if object has not been saved yet */
export class RequiredBoolean extends Attribute<boolean>{}
/** Required means that the field will not be undefined in DB, it can still be null if we query with select or exclude or if object has not been saved yet */
export class RequiredDate extends Attribute<Date>{}
export class OptionalString extends Attribute<string|undefined>{}
export class OptionalBoolean extends Attribute<boolean|undefined>{}
export class OptionalDate extends Attribute<Date|undefined>{}


//TODO: add typed objects
export class RequiredObject<Object> extends Attribute<Object>{}


class Incrementable<T extends number | undefined> extends Attribute<T> {
  constructor(obj: DbModel, key: Key) {
    super(obj, key);
  }
  /** Increment a field */
  increment(value: T) {
    this.data.increment(this.key, value);
    return this;
  }

  /** Decrement a field */
  decrement(value: T) {
    this.data.decrement(this.key, value);
    return this;
  }
}

/** Required means that the field will not be undefined in DB, it can still be null if we query with select or exclude or if object has not been saved yet */
export class RequiredNumber extends Incrementable<number>{}
export class OptionalNumber extends Incrementable<number|undefined>{}

class Arrayable<T> extends Attribute<T[]> {
  constructor(obj: DbModel, key: Key) {
    super(obj, key);
  }
  /** Add an item to the end of a list */
  append(item: T) {
    this.data.add(this.key, item);
    return this;
  }

  /** Uniquely add an item to a list */
  addUnique(item: T) {
    this.data.addUnique(this.key, item);
    return this;
  }

  /** Remove an item from a list */
  remove(item: T) {
    this.data.remove(this.key, item);
    return this;
  }
}

/** Required means that the field will not be undefined in DB, it can still be null if we query with select or exclude or if object has not been saved yet */
export class RequiredArray<T> extends Arrayable<T>{}
export class OptionalArray<T> extends Arrayable<T|undefined>{}

export class File extends Attribute<Primitive.File | undefined> {
  constructor(obj: DbModel, key: Key) {
    super(obj, key);
  }

  /** The url of the file, set src of img to this url for example */
  url(): string | undefined {
    return this.get()?.url();
  }

  toString(): string{
    return `File<${this.get()?.url().toString()}>` || "File<undefined>"
  }
}

export class Pointer<T extends DbModel> extends Attribute<T> {
  private readonly type: Activatable<T>;

  constructor(type: Activatable<T>, obj: DbModel, key: Key) {
    super(obj, key);
    this.type = type;
  }

  get(): T {
    const d = this.data.get(this.key);
    return wrap(this.type, d);
  }

  set(obj: DbModel | string): this {
    if (typeof obj === "string") {
      this.data.set(this.key, obj);
    } else {
      this.data.set(this.key, obj.data);
    }
    return this;
  }

  toString():string {
    return `Pointer<${this.data.get(this.key).className}, ${this.data.get(this.key).id}>`;
  }
}

export class Relation<T extends DbModel> extends AttributeBase {
  private readonly data: Primitive.Object;
  private readonly key: string;
  private readonly type: Activatable<T>;

  constructor(type: Activatable<T>, obj: DbModel, key: Key) {
    super()
    this.type = type;
    this.data = obj.data;
    this.key = key.name;
  }

  add(obj: T) {
    this.data.relation(this.key).add(obj.data);
    return this;
  }

  remove(obj: T) {
    this.data.relation(this.key).remove(obj.data);
    return this;
  }

  query() {
    return Query.wrap(this.type, this.data.relation(this.key).query());
  }

  async findAll(options?: { select: Key[]; limit: number }): Promise<T[]> {
    const q = this.query();
    if (options?.select) q.select(...options.select);
    if (options?.limit) q.limit(options.limit);
    return q.findAll();
  }

  toString() {
    return `Relation<${this.data.relation(this.key).targetClassName}>`;
  }
}

/**
 * Creates a realtion attribute that is synthezied from the fact that the target class has a pointer/relation to the current class.
 * */
export class SynthesizedRelation<T extends DbModel> extends AttributeBase{
  private readonly data: Primitive.Object;
  private readonly type: Activatable<T>;
  private readonly targetKey: Key;

  constructor(type: Activatable<T>, obj: DbModel, targetKey: Key) {
    super()
    this.type = type;
    this.data = obj.data;
    this.targetKey = targetKey;
  }

  query(): Query<T> {
    return new Query(this.type).equalTo(this.targetKey, this.data);
  }

  async findAll(options?: { select: Key[]; limit: number }): Promise<T[]> {
    const q = this.query();
    if (options?.select) q.select(...options.select);
    if (options?.limit) q.limit(options.limit);
    return q.findAll();
  }

  toString() {
    return `SynthesizedRelation<${this.query().targetClassName}, ${this.targetKey.name}>`;
  }
}
