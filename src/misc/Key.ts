import { IDbModel } from "../models/IDbModel";
import { Activatable } from "../util";

export interface IKey{
  readonly name: string;
};
/**
 * @deprecated use TypedKey instead, it has compile time ModelClass check
 */
export class Key implements IKey{
  constructor(readonly name: string) { }
  /**
   * @deprecated use Keys.build(User, {...}) instead, it is more type safe
   */
  static build<T>(
    names: { [K in keyof T]: T[K] },
  ): { [K in keyof T]: Key } {
    const result: { [K in keyof T]: Key } = {} as { [K in keyof T]: Key };
    for (const name in names) {
      if (typeof (names[name]) !== "string") {
        throw new Error("Value of key name must be string");
      }
      result[name] = new Key(names[name] as string);
    }
    return result;
  }
  toString(): string {
    return "Key<" + this.name + ">";
  }
}

export class TypedKey<T extends IDbModel> implements IKey {
  constructor(readonly name: string) { }
  toString(): string {
    return "Key<" + this.name + ">";
  }
}

export class Keys {
  static build<G extends IDbModel, T>(
    modelType: Activatable<G>,
    keyNameMap: { [K in keyof T]: T[K] },
  ): { [K in keyof T]: TypedKey<G> } {
    const result: { [K in keyof T]: TypedKey<G> } = {} as {
      [K in keyof T]: TypedKey<G>;
    };
    for (const name in keyNameMap) {
      if (typeof (keyNameMap[name]) !== "string") {
        throw new Error("Value of key name must be string");
      }
      result[name] = new TypedKey<G>(keyNameMap[name] as string);
    }
    return result;
  }
}

export type KeyMap = { [key: string]: Key };
