import { DbModel, field, Keys, Primitive, Query } from "parse-sdk-ts";

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
    authoredBooks: "books",
  });

  // username is "never" undefined (required attribute), but be CAREFUL, when queried with .exclude(username) it will be undefined

  readonly bestFriend    = field(this).stringPointer(User, User.keys.username);
  readonly username      = field(this).required().string(User.keys.username);
  readonly usernameLower = field(this).required().string(User.keys.usernameLower);
  readonly image         = field(this).file(User.keys.image);
  readonly language      = field(this).string(User.keys.language);
  readonly email         = field(this).string(User.keys.email);
  readonly authoredBooks = field(this).relation(Book, User.keys.authoredBooks);

  constructor(data: Primitive.User) { // override default constructor to only take Parse.User
    super(data);
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
