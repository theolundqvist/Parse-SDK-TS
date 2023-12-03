import { IDbModel } from "../models/IDbModel";
import { Activatable } from "../util";
export interface IKey {
    readonly name: string;
}
/**
 * @deprecated use TypedKey instead, it has compile time ModelClass check
 */
export declare class Key implements IKey {
    readonly name: string;
    constructor(name: string);
    /**
     * @deprecated use Keys.build(User, {...}) instead, it is more type safe
     */
    static build<T>(names: {
        [K in keyof T]: T[K];
    }): {
        [K in keyof T]: Key;
    };
    toString(): string;
}
export declare class TypedKey<T extends IDbModel> implements IKey {
    readonly name: string;
    constructor(name: string);
    toString(): string;
}
export declare class Keys {
    static build<G extends IDbModel, T>(modelType: Activatable<G>, keyNameMap: {
        [K in keyof T]: T[K];
    }): {
        [K in keyof T]: TypedKey<G>;
    };
}
export type KeyMap = {
    [key: string]: Key;
};
