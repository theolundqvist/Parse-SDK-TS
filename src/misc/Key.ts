
export class Key {
  constructor(readonly name: string) { }
  static build<T>(names: { [K in keyof T]: T[K] }): { [K in keyof T]: Key } {
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
    return "Key("+this.name+")";
  }
}
export type KeyMap = { [key: string]: Key };
