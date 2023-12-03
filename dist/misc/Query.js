import { Primitive } from "../db";
import { DbError } from "./DbError";
import { wrap } from "../util";
export class Query {
    type;
    className;
    targetClassName;
    q;
    options = {};
    /**
     * It throws an error if `type` does not include `className` and `keys`.
     */
    constructor(type) {
        if (!Object.keys(type).includes("className")) {
            throw new Error("Invalid type does not have a className.");
        }
        this.className = type.className;
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
    async find() {
        return this.q.find(this.options).then((results) => results.map((d) => wrap(this.type, d))).catch(DbError.parse);
    }
    /** Retrieves all records matching the query by iterating and making many queries. */
    async findAll() {
        return this.q.findAll(this.options).then((results) => results.map((d) => wrap(this.type, d))).catch(DbError.parse);
    }
    /** Returns the first record that matches the query, if any*/
    async first() {
        return this.q.first(this.options).then((result) => {
            if (result)
                return wrap(this.type, result);
            return null;
        }).catch(DbError.parse);
    }
    /** Retrieves the record with the specified `id`*/
    async get(id) {
        return this.q.get(id, this.options).then((result) => wrap(this.type, result)).catch(DbError.parse);
    }
    /** Counts the total number of records that match the query*/
    async count() {
        return this.q.count(this.options).catch(DbError.parse);
    }
    /** Limits the number of records returned by the query*/
    limit(limit) {
        this.q.limit(limit);
        return this;
    }
    /** Matches a field (`key`) with a specific `value`*/
    equalTo(key, value) {
        if (value["className"] && value["data"])
            value = value.data;
        this.q.equalTo(key.name, value);
        return this;
    }
    /** Excludes fields (`key`) from the query*/
    exclude(...key) {
        this.q.exclude(...key.map((k) => k.name));
        return this;
    }
    /** Selects fields (`keys`) to be returned by the query*/
    select(...keys) {
        this.q.select(...keys.map((k) => k.name));
        return this;
    }
    /** Include pointers (`keys`) in the query result*/
    includePointed(...keys) {
        this.q.include(...keys.map((k) => k.name));
        return this;
    }
    /** Include all pointers in the query result*/
    includeAllPointed() {
        this.q.includeAll();
        return this;
    }
    /** Orders results in ascending order by a specified `key`*/
    ascending(key) {
        this.q.ascending(key.name);
        return this;
    }
    /** Orders results in descending order by a specified `key`*/
    descending(key) {
        this.q.addDescending(key.name);
        return this;
    }
    /** Adds a condition where the value of a field (`key`) must start with a specified `prefix`*/
    startsWith(key, prefix) {
        this.q.startsWith(key.name, prefix);
        return this;
    }
    /** Adds a condition where the value of a field (`key`) must be less than the (`value`)*/
    less(key, value) {
        this.q.lessThan(key.name, value);
        return this;
    }
    /** Adds a condition where the value of a field (`key`) must be less than or equal the (`value`)*/
    lessOrEqual(key, value) {
        this.q.lessThanOrEqualTo(key.name, value);
        return this;
    }
    /** Adds a condition where the value of a field (`key`) must be greater than the (`value`)*/
    greater(key, value) {
        this.q.greaterThan(key.name, value);
        return this;
    }
    /** Adds a condition where the value of a field (`key`) must be greater than or equal the (`value`)*/
    greaterOrEqual(key, value) {
        this.q.greaterThanOrEqualTo(key.name, value);
        return this;
    }
    /** Adds a constraint to the query that requires a particular key's value to be contained in the provided list of values. */
    containedIn(key, values) {
        this.q.containedIn(key.name, values);
        return this;
    }
    static wrap(type, query) {
        const other = new Query(type);
        other.q = query;
        return other;
    }
}
