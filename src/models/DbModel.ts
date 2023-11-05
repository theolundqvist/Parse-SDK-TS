import { Primitive } from "../db";
import { DbError } from "../misc/DbError";
import { AttributeBase, AttributeBuilder } from "../attributes";
import { TypedKey } from "../misc/Key";
import { Activatable } from "../util/Activatable";
import { IDbModel } from "./IDbModel";

export abstract class DbModel implements IDbModel {
  readonly data: Primitive.Object;
  /** The id of the object */
  id: string;
  /** The database className of the object */
  readonly className: string;

  constructor(data: Parse.Object) {
    if (!data) throw new Error("Tried to create DbModel of undefined");
    this.data = data;
    this.id = data.id;
    this.className = data.className;
    // this.className = data.className;
  }

  protected string(key: TypedKey<this>) {
    return AttributeBuilder.create(this).string(key);
  }
  protected number(key: TypedKey<this>) {
    return AttributeBuilder.create(this).number(key);
  }
  protected boolean(key: TypedKey<this>) {
    return AttributeBuilder.create(this).boolean(key);
  }
  protected date(key: TypedKey<this>) {
    return AttributeBuilder.create(this).date(key);
  }
  protected array<T>(key: TypedKey<this>) {
    return AttributeBuilder.create(this).array<T>(key);
  }
  protected object(key: TypedKey<this>) {
    return AttributeBuilder.create(this).object(key);
  }
  protected pointer<G extends DbModel>(
    target: Activatable<G>,
    key: TypedKey<this>,
  ) {
    return AttributeBuilder.create(this).pointer(target, key);
  }
  protected relation<G extends DbModel>(
    target: Activatable<G>,
    key: TypedKey<this>,
  ) {
    return AttributeBuilder.create(this).relation(target, key);
  }
  protected stringPointer<G extends DbModel>(
    target: Activatable<G>,
    key: TypedKey<this>,
  ) {
    return AttributeBuilder.create(this).stringPointer(target, key);
  }
  protected file(key: TypedKey<this>) {
    return AttributeBuilder.create(this).file(key);
  }
  protected optional() {
    return AttributeBuilder.create(this).optional();
  }
  protected syntheticRelation<G extends DbModel>(
    target: Activatable<G>,
    key: TypedKey<this>,
  ) {
    return AttributeBuilder.create(this).syntheticRelation(target, key);
  }

  /** The time the object was created */
  createdAt(): Date {
    return this.data.createdAt;
  }
  /** The time the object was last updated */
  updatedAt(): Date {
    return this.data.updatedAt;
  }

  /** Save the changes to the database */
  async save(options: { useMasterKey?: boolean } = {}) {
    return this.data.save(null, options)
      .then((u) => {
        this.id = u.id;
        return this;
      }).catch(DbError.parse);
  }

  async saveAsMaster() {
    return this.save({ useMasterKey: true });
  }

  /** Delete the object from the database */
  async destroy(options: { useMasterKey?: boolean } = {}) {
    return this.data.destroy(options).catch(DbError.parse);
  }

  /** Returns true if the object has never been saved to the Parse.*/
  isNew() {
    return this.data.isNew();
  }

  getACL() {
    return this.data.getACL();
  }

  async fetch(options: { useMasterKey?: boolean } = {}) {
    return this.data.fetch(options).then(() => this).catch(DbError.parse);
  }

  printable(): Object {
    const temp = {
      ...this,
    } as any;
    delete temp.data;
    Object.keys(temp).forEach((k: any) => {
      if (temp[k] instanceof AttributeBase) {
        temp[k] = temp[k].printable();
      }
    });
    temp.createdAt = this.createdAt();
    temp.updatedAt = this.updatedAt();
    return temp;
  }
}
