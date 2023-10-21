import { Primitive } from "../db";
import { DbError } from "../misc";
import { DbModel } from "../models/DbModel";

export class Function<T extends (...args: any) => any> {
  constructor(readonly name: string, readonly argNames: string[]) { 
  }

  static create<T extends (...args: any) => any>(
    name: string,
    argNames: string[]
  ): Function<T> {
    return new Function<T>(name, argNames);
  }
  // lambda to keep this bound to function, did not get "bind" to work
  run = async (...args: Parameters<T>): Promise<ReturnType<T>>  => {
    // open up all custom objects
    const primitiveArgs = args.map((arg: any) =>
      arg instanceof DbModel ? arg.data : arg
    );
    if (primitiveArgs.length !== this.argNames.length) {
      throw new Error(
        `Wrong number of arguments for function ${this.name} (expected ${this.argNames.length}, got ${primitiveArgs.length})`,
      );
    }

    const db_args: any = {};
    primitiveArgs.forEach((arg: any, i: number) =>
      db_args[this.argNames[i]] = arg
    );
    return Primitive.Cloud.run(this.name, db_args).catch(DbError.parse);
  }
}

export function declare<T extends (...args: any) => any>(
  name: string,
  argNames: string[]
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  const f = new Function<T>(name, argNames);
  return f.run;
}
