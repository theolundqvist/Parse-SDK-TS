import { Primitive } from "../db";
import { Activatable, wrap } from "../util";
import { Key, TypedKey } from "../misc/Key";
import { Query } from "../misc/Query";
import { IDbModel } from "../models/IDbModel";

// SOME BASE CLASSES
//

export abstract class AttributeBase {
  abstract toString(): string;
  printable(): any {
    const temp = {
      ...this,
    } as any;
    delete temp.data;
    delete temp.type;
    delete temp.obj;
    return temp;
  }
  toJSON(): string {
    const temp = {
      ...this,
    } as any;
    delete temp.obj;
    return JSON.stringify(temp);
  }
}

export class Attribute<T> extends AttributeBase {
  protected readonly obj: IDbModel;
  protected readonly data: Primitive.Object;
  protected readonly key: string;
  protected readonly fallback?: T;
  constructor(obj: IDbModel, key: Key, fallback?: T) {
    super();
    this.data = obj.data;
    this.obj = obj;
    this.key = key.name;
    this.fallback = fallback;
  }
  /** Get a locally available field */
  get(): T {
    const d = this.data.get(this.key);
    return d;
    // // if fallback is not specified
    // if (this.fallback === undefined) return d;
    // // if fallback is specified
    // return d === undefined ? this.fallback : d;
  }

  /** Update a field */
  set(value: T): this {
    this.data.set(this.key, value);
    return this;
  }

  toString(): string {
    return `${this.get()}`;
  }
  printable(): any {
    return this.get();
  }
}

export class OptionalAttribute<T> extends Attribute<T | undefined> {
  getOrElse(defaultValue: T): T {
    const d = this.data.get(this.key);
    return d === undefined || d === null ? defaultValue : d;
  }
  has(): boolean {
    return this.data.has(this.key) && this.get() !== undefined && this.get() !== null;
  }
}

// STANDARD ATTRIBUTES

/** Required means that the field will not be undefined in DB, it can still be null if we query with select or exclude or if object has not been saved yet */
export class RequiredString extends Attribute<string> { }
/** Required means that the field will not be undefined in DB, it can still be null if we query with select or exclude or if object has not been saved yet */
export class RequiredBoolean extends Attribute<boolean> { }
/** Required means that the field will not be undefined in DB, it can still be null if we query with select or exclude or if object has not been saved yet */
export class RequiredDate extends Attribute<Date> { }

export class OptionalString extends OptionalAttribute<string> { }
export class OptionalBoolean extends OptionalAttribute<boolean> { }
export class OptionalDate extends OptionalAttribute<Date> { }

//TODO: add typed objects
export class RequiredObject<Object> extends Attribute<Object> { }
export class OptionalObject<Object> extends OptionalAttribute<Object> { }

// ARRAY ATTRIBUTES
// We got some code duplication here, but trust me, we will be ok.

interface Arrayable<T> {
  append(item: T): this;
  addUnique(item: T): this;
  remove(item: T): this;
}

export class RequiredArray<T> extends Attribute<T[]> implements Arrayable<T> {
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

export class OptionalArray<T> extends Attribute<T[] | undefined>
  implements Arrayable<T> {
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

// Incrementable attributes, I guess only numbers
// We got some code duplication here, but trust me, we will be ok.

interface Incrementable<T> {
  increment(value: T): this;
  decrement(value: T): this;
}

export class RequiredNumber extends Attribute<number>
  implements Incrementable<number> {
  /** Increment a field */
  increment(value: number) {
    this.data.increment(this.key, value);
    return this;
  }

  /** Decrement a field */
  decrement(value: number) {
    this.data.decrement(this.key, value);
    return this;
  }
}

export class OptionalNumber extends Attribute<number | undefined>
  implements Incrementable<number> {
  /** Increment a field */
  increment(value: number) {
    this.data.increment(this.key, value);
    return this;
  }

  /** Decrement a field */
  decrement(value: number) {
    this.data.decrement(this.key, value);
    return this;
  }
}

export class File extends Attribute<Primitive.File | undefined> {
  /** The url of the file, set src of img to this url for example */
  url(): string | undefined {
    return this.get()?.url();
  }

  toString(): string {
    return `File<${this.get()?.url().toString()}>`;
  }

  printable() {
    if (this.url() == undefined) {
      return { url: undefined };
    } else return { url: this.url() };
  }
}

export class Pointer<T extends IDbModel> extends Attribute<T | undefined> {
  private readonly type: Activatable<T>;

  constructor(type: Activatable<T>, obj: IDbModel, key: Key) {
    super(obj, key);
    this.type = type;
  }

  get(): T | undefined {
    const d = this.data.get(this.key);
    return wrap(this.type, d);
  }

  set(obj: IDbModel | string | undefined): this {
    if (typeof obj === "object") {
      this.data.set(this.key, obj.data);
    } else {
      this.data.set(this.key, obj);
    }
    return this;
  }

  toString(): string {
    return `Pointer<${this.data.get(this.key).className}, ${this.data.get(this.key).id
      }>`;
  }
  printable(): any {
    const temp = {
      ...this,
    } as any;
    delete temp.data;
    delete temp.obj;
    delete temp.type;
    temp.attributeType = "Pointer";
    temp.targetClassName = this.data.get(this.key).className;
    temp.targetId = this.data.get(this.key).id;
    return temp;
  }
}

export class StringPointer<T extends IDbModel> extends AttributeBase {
  private readonly type: Activatable<T>;
  private readonly obj: IDbModel;
  private readonly data: Primitive.Object;
  private readonly key: string;

  constructor(type: Activatable<T>, obj: IDbModel, key: Key) {
    super();
    this.type = type;
    this.obj = obj;
    this.key = key.name;
    this.data = obj.data;
  }

  private className = () => (new this.type()).className;

  get(): T | undefined {
    const d: string | undefined = this.data?.get(this.key);
    if (d === undefined) return undefined;

    const t = Primitive.Object.extend(this.className());
    const pointer = t.createWithoutData(d);

    return wrap(this.type, pointer);
  }

  set(obj: IDbModel | string | undefined): this {
    if (typeof obj === "string") {
      this.data.set(this.key, obj);
    } else if (typeof obj === "undefined") {
      this.data.set(this.key, undefined);
    } else {
      this.data.set(this.key, obj.id);
    }
    return this;
  }

  toString(): string {
    return `Pointer<${this.className()}, ${this.data.get(this.key)}>`;
  }
  printable(): any {
    const temp = {
      ...this,
    } as any;
    delete temp.data;
    delete temp.obj;
    delete temp.type;
    temp.attributeType = "Pointer";
    temp.targetClassName = this.className();
    temp.targetId = this.data.get(this.key);
    return temp;
  }
}

export class Relation<T extends IDbModel> extends AttributeBase {
  private readonly data: Primitive.Object;
  private readonly key: string;
  private readonly type: Activatable<T>;

  constructor(type: Activatable<T>, obj: IDbModel, key: Key) {
    super();
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

  printable(): any {
    const temp = {
      ...this,
    } as any;
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
export class SyntheticRelation<T extends IDbModel> extends AttributeBase {
  private readonly data: Primitive.Object;
  private readonly type: Activatable<T>;
  private readonly targetKey: Key;

  constructor(type: Activatable<T>, obj: IDbModel, targetKey: Key) {
    super();
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
    return `SyntheticRelation<${this.query().targetClassName}, ${this.targetKey.name}>`;
  }
  printable(): any {
    const temp = {
      ...this,
    } as any;
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
export class SynthesizedRelation<T extends IDbModel>
  extends SyntheticRelation<T> { }
