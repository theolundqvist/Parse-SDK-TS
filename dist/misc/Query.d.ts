/// <reference types="parse" />
import { Primitive } from "../db";
import { IDbModel } from "../models";
import { TypedKey } from "./Key";
import { Activatable } from "../util";
export declare class Query<T extends IDbModel> {
    private readonly type;
    private readonly className;
    readonly targetClassName: string;
    private q;
    private readonly options;
    /**
     * It throws an error if `type` does not include `className` and `keys`.
     */
    constructor(type: Activatable<T>);
    /** Bypass access control by using the master key. Must be provided during initialization.*/
    useMasterKey(): this;
    asMaster(): this;
    /** Finds and returns all records matching the query*/
    find(): Promise<T[]>;
    /** Retrieves all records matching the query by iterating and making many queries. */
    findAll(): Promise<T[]>;
    /** Returns the first record that matches the query, if any*/
    first(): Promise<T | null>;
    /** Retrieves the record with the specified `id`*/
    get(id: string): Promise<T>;
    /** Counts the total number of records that match the query*/
    count(): Promise<number>;
    /** Limits the number of records returned by the query*/
    limit(limit: number): this;
    /** Matches a field (`key`) with a specific `value`*/
    equalTo(key: TypedKey<T>, value: any): this;
    /** Excludes fields (`key`) from the query*/
    exclude(...key: TypedKey<T>[]): this;
    /** Selects fields (`keys`) to be returned by the query*/
    select(...keys: TypedKey<T>[]): this;
    /** Include pointers (`keys`) in the query result*/
    includePointed(...keys: TypedKey<T>[]): this;
    /** Include all pointers in the query result*/
    includeAllPointed(): this;
    /** Orders results in ascending order by a specified `key`*/
    ascending(key: TypedKey<T>): this;
    /** Orders results in descending order by a specified `key`*/
    descending(key: TypedKey<T>): this;
    /** Adds a condition where the value of a field (`key`) must start with a specified `prefix`*/
    startsWith(key: TypedKey<T>, prefix: string): this;
    /** Adds a condition where the value of a field (`key`) must be less than the (`value`)*/
    less(key: TypedKey<T>, value: any): this;
    /** Adds a condition where the value of a field (`key`) must be less than or equal the (`value`)*/
    lessOrEqual(key: TypedKey<T>, value: any): this;
    /** Adds a condition where the value of a field (`key`) must be greater than the (`value`)*/
    greater(key: TypedKey<T>, value: any): this;
    /** Adds a condition where the value of a field (`key`) must be greater than or equal the (`value`)*/
    greaterOrEqual(key: TypedKey<T>, value: any): this;
    /** Adds a constraint to the query that requires a particular key's value to be contained in the provided list of values. */
    containedIn(key: TypedKey<T>, values: any[]): this;
    static wrap<T extends IDbModel>(type: Activatable<T>, query: Primitive.Query): Query<T>;
}
