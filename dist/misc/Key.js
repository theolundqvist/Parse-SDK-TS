;
/**
 * @deprecated use TypedKey instead, it has compile time ModelClass check
 */
export class Key {
    name;
    constructor(name) {
        this.name = name;
    }
    /**
     * @deprecated use Keys.build(User, {...}) instead, it is more type safe
     */
    static build(names) {
        const result = {};
        for (const name in names) {
            if (typeof (names[name]) !== "string") {
                throw new Error("Value of key name must be string");
            }
            result[name] = new Key(names[name]);
        }
        return result;
    }
    toString() {
        return "Key<" + this.name + ">";
    }
}
export class TypedKey {
    name;
    constructor(name) {
        this.name = name;
    }
    toString() {
        return "Key<" + this.name + ">";
    }
}
export class Keys {
    static build(modelType, keyNameMap) {
        const result = {};
        for (const name in keyNameMap) {
            if (typeof (keyNameMap[name]) !== "string") {
                throw new Error("Value of key name must be string");
            }
            result[name] = new TypedKey(keyNameMap[name]);
        }
        return result;
    }
}
