import * as _ from "parse-sdk-ts/attributes";

import {
  Primitive,
  DbModel,
  Keys
} from "parse-sdk-ts";

import { User } from "./User";

export class Book extends DbModel {
  static readonly className: string = "Book";
  static readonly keys = Keys.build(Book,{
    // client_key: "db_key",
    title: "book_title",
    authors: "authors",
    description: "desc",
  });

  readonly title       = new _.RequiredString(this, Book.keys.title);
  readonly authors     = new _.Relation(User, this, Book.keys.authors);
  readonly description = new _.OptionalString(this, Book.keys.description);

  constructor(data: Primitive.Object) {
    super(data, Book.keys);
  }
  static create(title: string, author: User){
    const b = new Book(new Primitive.Object(Book.className))
    b.title.set(title);
    b.authors.add(author);
    return b;
  }
}
