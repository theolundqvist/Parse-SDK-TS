
import { RequiredString } from "parse-sdk-ts/attributes";

import {
  DatabasePrimitive as Primitive,
  DbModel,
  Key,
} from "parse-sdk-ts";



export class Minimal extends DbModel {
  static readonly className: string = "_Minimal";
  static readonly keys = Key.build({
    client_key: "db_key",
  });

  readonly client_key = new RequiredString(this, Minimal.keys.client_key);

  constructor(data: Primitive.Object) {
    super(data, Minimal.keys);
  }

  // to be able to create a new instance and save
  static create(){
    return new Minimal(new Primitive.Object(Minimal.className));
  }
}
