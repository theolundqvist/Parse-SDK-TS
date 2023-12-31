
import {
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

  readonly title       = this.field().required().string(Book.keys.title);
  readonly authors     = this.field().relation(User, Book.keys.authors);
  readonly description = this.field().string(Book.keys.description);

  static create(title: string, author: User){
    const b = DbModel.createWithoutData(Book);
    b.title.set(title);
    b.authors.add(author);
    return b;
  }
}
