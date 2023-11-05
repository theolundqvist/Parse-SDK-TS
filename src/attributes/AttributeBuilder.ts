import { TypedKey } from "../misc/Key";
import { IDbModel } from "../models/IDbModel";
import { Activatable } from "../util";
import * as _ from "./Attributes";

export class AttributeBuilder<T extends IDbModel> {
  private isOptional = false;

  constructor(private readonly model: T) { }

  static create<T extends IDbModel>(model: T) {
    return new AttributeBuilder(model);
  }

  optional() {
    this.isOptional = true;
    return this;
  }

  string(key: TypedKey<T>) {
    return this.isOptional
      ? new _.RequiredString(this.model, key)
      : new _.OptionalString(this.model, key);
  }

  date(key: TypedKey<T>) {
    return this.isOptional
      ? new _.RequiredDate(this.model, key)
      : new _.OptionalDate(this.model, key);
  }

  number(key: TypedKey<T>) {
    return this.isOptional
      ? new _.RequiredNumber(this.model, key)
      : new _.OptionalNumber(this.model, key);
  }

  boolean(key: TypedKey<T>) {
    return this.isOptional
      ? new _.RequiredBoolean(this.model, key)
      : new _.OptionalBoolean(this.model, key);
  }
  object(key: TypedKey<T>) {
    return this.isOptional
      ? new _.OptionalObject(this.model, key)
      : new _.RequiredObject(this.model, key);
  }
  array<G>(key: TypedKey<T>) {
    return this.isOptional
      ? new _.OptionalArray<G>(this.model, key)
      : new _.RequiredArray<G>(this.model, key);
  }

  private warnOptional(key: TypedKey<T>, type: string) {
    if (this.isOptional) {
      console.warn(
        `${this.model.className}(${key.name}) Optional has no effect on ${type}`,
      );
    }
  }

  file(key: TypedKey<T>) {
    this.warnOptional(key, "file");
    return new _.File(this.model, key);
  }
  pointer<G extends IDbModel>(target: Activatable<G>, key: TypedKey<T>) {
    this.warnOptional(key, "pointer");
    return new _.Pointer(target, this.model, key);
  }
  stringPointer<G extends IDbModel>(target: Activatable<G>, key: TypedKey<T>) {
    this.warnOptional(key, "stringPointer");
    return new _.StringPointer(target, this.model, key);
  }
  relation<G extends IDbModel>(target: Activatable<G>, key: TypedKey<T>) {
    this.warnOptional(key, "relation");
    return new _.Relation(target, this.model, key);
  }
  syntheticRelation<G extends IDbModel>(target: Activatable<G>, targetKey: TypedKey<T>) {
    this.warnOptional(targetKey, "syntheticRelation");
    return new _.SyntheticRelation(target, this.model, targetKey);
  }
}
