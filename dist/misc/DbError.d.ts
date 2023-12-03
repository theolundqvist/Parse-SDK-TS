/// <reference types="parse" />
import { Primitive as Db } from "../db";
export declare class DbError extends Db.Error {
    readonly meta: {};
    private constructor();
    static parse(e: Db.Error): Promise<never>;
    toJSON(): string;
}
