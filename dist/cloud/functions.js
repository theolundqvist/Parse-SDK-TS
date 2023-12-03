import { Primitive } from "../db";
import { DbError } from "../misc";
import { DbModel } from "../models/DbModel";
export class Function {
    name;
    argNames;
    constructor(name, argNames) {
        this.name = name;
        this.argNames = argNames;
    }
    static create(name, argNames) {
        return new Function(name, argNames);
    }
    // lambda to keep this bound to function, did not get "bind" to work
    run = async (...args) => {
        // open up all custom objects
        const primitiveArgs = args.map((arg) => arg instanceof DbModel ? arg.data : arg);
        if (primitiveArgs.length !== this.argNames.length) {
            throw new Error(`Wrong number of arguments for function ${this.name} (expected ${this.argNames.length}, got ${primitiveArgs.length})`);
        }
        const db_args = {};
        primitiveArgs.forEach((arg, i) => db_args[this.argNames[i]] = arg);
        return Primitive.Cloud.run(this.name, db_args).catch(DbError.parse);
    };
}
export function declare(name, argNames) {
    const f = new Function(name, argNames || []);
    return f.run;
}
