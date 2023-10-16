import { Primitive } from "../db";
import { DbError } from "../misc";
import { AttributeBase } from "../attributes";
import {Key, KeyMap} from "../misc/Key";


export abstract class DbModel {
  readonly data: Primitive.Object;
  private readonly keys: KeyMap = {};
  /** The id of the object */
  id: string;
  /** The database className of the object */
  readonly className: string;

  constructor(data: Parse.Object, keys: KeyMap) {
    if (!data) throw new Error("Tried to create DbModel of undefined");
    this.data = data;
    this.keys = keys;
    this.id = data.id;
    this.className = data.className;
    // this.className = data.className;
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
  async destroy(options: {useMasterKey?: boolean} = {}) {
    return this.data.destroy(options).catch(DbError.parse);
  }

  /** Returns true if the object has never been saved to the Parse.*/
  isNew() {
    return this.data.isNew();
  }

  getACL() {
    return this.data.getACL();
  }

  async fetch(options: {useMasterKey?: boolean} = {}) {
    return this.data.fetch(options).then(() => this).catch(DbError.parse);
  }

  printable(): Object {
    const temp = {
      ...this,
    } as any;
    delete temp.data;
    delete temp.keys;
    Object.keys(temp).forEach((k: any) => {
      if(temp[k].toString)
        temp[k] = temp[k].toString()
    })
    temp.createdAt= this.createdAt()
    temp.updatedAt= this.updatedAt()
    return temp;
  }
}
