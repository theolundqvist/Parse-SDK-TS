
import { RequiredString } from "parse-sdk-ts/attributes";

import {
  DatabasePrimitive as Primitive,
  DbModel,
  Key,
} from "parse-sdk-ts";



export class Minimal extends DbModel {
  static readonly className: string = "_User";
  static readonly keys = Key.build({
    client_key: "db_key",
  });

  readonly client_key = new RequiredString(this, Minimal.keys.client_key);

  constructor(data: Primitive.User) {
    super(data, Minimal.keys);
  }
}
