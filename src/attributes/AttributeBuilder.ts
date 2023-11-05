import { TypedKey } from "../misc/Key";
import { IDbModel } from "../models/IDbModel";
import { Activatable } from "../util";
import * as _ from "./Attributes";

export class AttributeBuilder<T extends IDbModel> {
  private isRequired = false;
  private fallback:any = undefined;

  constructor(private readonly model: T) { }

  static create<T extends IDbModel>(model: T) {
    return new AttributeBuilder(model);
  }

  required(fallback?: any) {
    this.isRequired = true;
    this.fallback = fallback;
    return this;
  }

  default(fallback: any) {
    this.fallback = fallback;
    return this;
  }

  string(key: TypedKey<T>) {
    return this.isRequired
      ? new _.RequiredString(this.model, key, this.fallback)
      : new _.OptionalString(this.model, key, this.fallback);
  }

  date(key: TypedKey<T>) {
    return this.isRequired
      ? new _.RequiredDate(this.model, key, this.fallback)
      : new _.OptionalDate(this.model, key, this.fallback);
  }

  number(key: TypedKey<T>) {
    return this.isRequired
      ? new _.RequiredNumber(this.model, key, this.fallback)
      : new _.OptionalNumber(this.model, key, this.fallback);
  }

  boolean(key: TypedKey<T>) {
    return this.isRequired
      ? new _.RequiredBoolean(this.model, key, this.fallback)
      : new _.OptionalBoolean(this.model, key, this.fallback);
  }
  object(key: TypedKey<T>) {
    return this.isRequired
      ? new _.OptionalObject(this.model, key, this.fallback)
      : new _.RequiredObject(this.model, key, this.fallback);
  }
  array<G>(key: TypedKey<T>) {
    return this.isRequired
      ? new _.OptionalArray<G>(this.model, key, this.fallback)
      : new _.RequiredArray<G>(this.model, key, this.fallback);
  }

  private warnRequired(key: TypedKey<T>, type: string) {
    if (this.isRequired) {
      console.warn(
        `${this.model.className}(${key.name}) Required has no effect on ${type}`,
      );
    }
  }

  file(key: TypedKey<T>) {
    this.warnRequired(key, "file");
    return new _.File(this.model, key);
  }
  pointer<G extends IDbModel, T extends IDbModel>(target: Activatable<G>, key: TypedKey<T>): _.Pointer<G> {
    this.warnRequired(key, "pointer");
    return new _.Pointer(target, this.model, key);
  }
  stringPointer<G extends IDbModel>(target: Activatable<G>, key: TypedKey<T>) {
    this.warnRequired(key, "stringPointer");
    return new _.StringPointer(target, this.model, key);
  }
  relation<G extends IDbModel>(target: Activatable<G>, key: TypedKey<T>) {
    this.warnRequired(key, "relation");
    return new _.Relation(target, this.model, key);
  }
  syntheticRelation<G extends IDbModel>(target: Activatable<G>, targetKey: TypedKey<T>) {
    this.warnRequired(targetKey, "syntheticRelation");
    return new _.SyntheticRelation(target, this.model, targetKey);
  }
}
