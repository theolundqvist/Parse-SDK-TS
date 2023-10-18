
import { RequiredString } from "parse-sdk-ts/attributes";

import {
  DatabasePrimitive as Primitive,
  DbModel,
  Key,
} from "parse-sdk-ts";



export class Minimal extends DbModel {

  // required: database classname
  static readonly className: string = "_Minimal";

  // required: database keys
  static readonly keys = Key.build({
    client_key: "db_key",
  });

  // required: typed attributes
  readonly client_key = new RequiredString(this, Minimal.keys.client_key);

  // required: constructor as below
  constructor(data: Primitive.Object) {
    super(data, Minimal.keys);
  }

  // optional: to be able to create a new instance without data
  static create(){
    return new Minimal(new Primitive.Object(Minimal.className));
  }
}
