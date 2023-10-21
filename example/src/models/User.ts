import * as _ from "parse-sdk-ts/attributes";

import {
  Primitive,
  DbModel,
  Keys,
  Query,
} from "parse-sdk-ts";

import { Book } from "./Book";

export class User extends DbModel {
  static readonly className: string = "_User";
  static readonly keys = Keys.build(User, {
    username: "dispName",
    usernameLower: "username",
    image: "img",
    language: "lang",
    email: "email",
    bestFriend: "bf",
    authoredBooks: "books"
  });

  // username is "never" undefined (required attribute), but be CAREFUL, when queried with .exclude(username) it will be undefined
  
  readonly bestFriend    = new _.StringPointer(User, this, User.keys.username);
  readonly username      = new _.RequiredString(this, User.keys.username);
  readonly usernameLower = new _.RequiredString(this, User.keys.usernameLower);
  readonly image         = new _.File(this, User.keys.image);
  readonly language      = new _.OptionalString(this, User.keys.language);
  readonly email         = new _.OptionalString(this, User.keys.email);
  readonly authoredBooks = new _.Relation(Book, this, User.keys.authoredBooks);

  constructor(data: Primitive.User) {
    super(data, User.keys);
  }

  // add your own methods here
  getSessionToken() {
    return (this.data as Primitive.User).getSessionToken();
  }

  // optional: User.query() is a shortcut for new Query(User)
  static query() {
    return new Query(User);
  }
}
