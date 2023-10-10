import { File, OptionalString, RequiredString, SynthesizedRelation } from "parse-sdk-ts/attributes";

import {
  DatabasePrimitive as Primitive,
  DbModel,
  Key,
  Query,
} from "parse-sdk-ts";



export class User extends DbModel {
  static readonly className: string = "_User";
  static readonly keys = Key.build({
    username: "dispName",
    usernameLower: "username",
    image: "img",
    language: "lang",
    email: "email",
  });

  // username is "never" null, but be CAREFUL, when queried with .exclude(username) it will be null
  readonly username = new RequiredString(this, User.keys.username);
  readonly usernameLower = new RequiredString(this, User.keys.usernameLower);
  readonly image = new File(this, User.keys.image);
  readonly language = new OptionalString(this, User.keys.language);
  readonly email = new OptionalString(this, User.keys.email);
  //readonly courses = new SynthesizedRelation(Course, this, Course.keys.users);

  constructor(data: Primitive.User) {
    super(data, User.keys);
  }

  getSessionToken() {
    return (this.data as Primitive.User).getSessionToken();
  }

  static query() {
    return new Query(User);
  }
}
