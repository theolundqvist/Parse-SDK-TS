import { Cloud } from "parse-sdk-ts";
import { Book } from "../models/Book";
import * as auth from "../auth"

export const FollowBook = Cloud.declare
<(book: Book) => void>(
    "FollowBook",
  );

export const UnfollowBook = Cloud.declare
  <(book: Book) => void>(
    "UnfollowBook",
  );

export const Ping = Cloud.declare
  <(a:string, b:Book) => void>(
    "ping"  
  );



// example run (would require a book instance and authenticated user probably)
//
// import * as MyCloud from "./cloud;
//
// MyCloud.FollowBook.run(book);
