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
  
  readonly bestFriend    = this.stringPointer(User, User.keys.username);
  readonly username      = this.string(User.keys.username);
  readonly usernameLower = this.string(User.keys.usernameLower);
  readonly image         = this.file(User.keys.image);
  readonly language      = this.optional().string(User.keys.language);
  readonly email         = this.optional().string(User.keys.email);
  readonly authoredBooks = this.relation(Book, User.keys.authoredBooks);

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
