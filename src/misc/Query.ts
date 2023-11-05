import { Primitive } from "../db";
import { IDbModel} from "../models";
import { DbError } from "./DbError";
import { TypedKey } from "./Key";
import { Activatable, wrap } from "../util";

export class Query<T extends IDbModel> {
  private readonly type: Activatable<T>;
  private readonly className: string;
  readonly targetClassName: string;
  private q: Primitive.Query;
  private readonly options: { useMasterKey?: boolean } = {};

  /**
   * It throws an error if `type` does not include `className` and `keys`.
   */
  constructor(type: Activatable<T>) {
    if (!Object.keys(type).includes("className")) {
      throw new Error("Invalid type does not have a className.");
    }

    this.className = (type as any).className;
    this.targetClassName = this.className;
    this.type = type;
    this.q = new Primitive.Query(this.className);
  }

  /** Bypass access control by using the master key. Must be provided during initialization.*/
  useMasterKey() {
    this.options.useMasterKey = true;
    return this;
  }
  asMaster() {
    return this.useMasterKey();
  }


  /** Finds and returns all records matching the query*/
  async find(): Promise<T[]> {
    return this.q.find(this.options).then((results) =>
      results.map((d) => wrap(this.type, d))
    ).catch(DbError.parse);
  }

  /** Retrieves all records matching the query by iterating and making many queries. */
  async findAll(): Promise<T[]> {
    return this.q.findAll(this.options).then((results) =>
      results.map((d) => wrap(this.type, d))
    ).catch(DbError.parse);
  }

  /** Returns the first record that matches the query, if any*/
  async first(): Promise<T | null> {
    return this.q.first(this.options).then((result) => {
      if (result) return wrap(this.type, result);
      return null;
    }).catch(DbError.parse);
  }

  /** Retrieves the record with the specified `id`*/
  async get(id: string): Promise<T> {
    return this.q.get(id, this.options).then((result) =>
      wrap(this.type, result)
    ).catch(DbError.parse);
  }

  /** Counts the total number of records that match the query*/
  async count(): Promise<number> {
    return this.q.count(this.options).catch(DbError.parse);
  }

  /** Limits the number of records returned by the query*/
  limit(limit: number): this {
    this.q.limit(limit);
    return this;
  }

  /** Matches a field (`key`) with a specific `value`*/
  equalTo(key: TypedKey<T>, value: any): this {
    if(value["className"] && value["data"]) value = value.data;
    this.q.equalTo(key.name, value);
    return this;
  }

  /** Excludes fields (`key`) from the query*/
  exclude(...key: TypedKey<T>[]): this {
    this.q.exclude(...key.map((k) => k.name));
    return this;
  }

  /** Selects fields (`keys`) to be returned by the query*/
  select(...keys: TypedKey<T>[]): this {
    this.q.select(...keys.map((k) => k.name));
    return this;
  }

  /** Include pointers (`keys`) in the query result*/
  includePointed(...keys: TypedKey<T>[]): this {
    this.q.include(...keys.map((k) => k.name));
    return this;
  }

  /** Include all pointers in the query result*/
  includeAllPointed(): this {
    this.q.includeAll();
    return this;
  }

  /** Orders results in ascending order by a specified `key`*/
  ascending(key: TypedKey<T>): this {
    this.q.ascending(key.name);
    return this;
  }

  /** Orders results in descending order by a specified `key`*/
  descending(key: TypedKey<T>): this {
    this.q.addDescending(key.name);
    return this;
  }

  /** Adds a condition where the value of a field (`key`) must start with a specified `prefix`*/
  startsWith(key: TypedKey<T>, prefix: string): this {
    this.q.startsWith(key.name, prefix);
    return this;
  }

  /** Adds a condition where the value of a field (`key`) must be less than the (`value`)*/
  less(key: TypedKey<T>, value: any): this {
    this.q.lessThan(key.name, value);
    return this;
  }

  /** Adds a condition where the value of a field (`key`) must be less than or equal the (`value`)*/
  lessOrEqual(key: TypedKey<T>, value: any): this {
    this.q.lessThanOrEqualTo(key.name, value);
    return this;
  }

  /** Adds a condition where the value of a field (`key`) must be greater than the (`value`)*/
  greater(key: TypedKey<T>, value: any): this {
    this.q.greaterThan(key.name, value);
    return this;
  }

  /** Adds a condition where the value of a field (`key`) must be greater than or equal the (`value`)*/
  greaterOrEqual(key: TypedKey<T>, value: any): this {
    this.q.greaterThanOrEqualTo(key.name, value);
    return this;
  }

  static wrap<T extends IDbModel>(
    type: Activatable<T>,
    query: Primitive.Query,
  ): Query<T> {
    const other = new Query(type);
    other.q = query;
    return other;
  }
}
