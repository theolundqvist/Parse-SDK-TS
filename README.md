[![npm version](https://badge.fury.io/js/parse-sdk-ts.svg)](https://badge.fury.io/js/parse-sdk-ts)
[![License](https://img.shields.io/badge/License-Apache2.0-blue.svg)](https://opensource.org/licenses/Apache2.0)

# Parse-SDK-TS-typed
A client side library for typescript that provides type-safety for database classes, queries and cloud functions.

Built on top of [Parse-SDK-JS](https://github.com/parse-community/Parse-SDK-JS).

Tested in SSR environment on Next and Nuxt.

Please see `example/` folder for complete examples with imports.

## Justification
The Parse-SDK-JS API, is not only prone to spelling errors but is also exceedingly difficult to utilize for developers who are unfamiliar with the names of database keys.

This API solves the problem by providing good typings so that frontend devs don't have to know the exakt key names.

## Setup

`npm install parse-sdk-ts`

```ts
import { initialize }  from 'parse-sdk-ts'

initialize(server_url, app_id)
```


## Auth
```ts
import * as auth from 'parse-sdk-ts/auth'
const user : MyUser = await auth.signIn(MyUser, username, password)
```

## Objects
Data is accessed via attributes instead of via string keys.
```ts
console.log(user.username.get())
user.username.set("new name")    // string
user.level.increment()           // number
user.weapons.addUnique("sword")  // relation 
user.save()
```


## Queries
The API is essentially the same as the Parse-SDK-JS but with Keys instead of strings.
```ts
const users : MyUser[] = new Query(MyUser).ascending(MyUser.keys.username).find()
```


## Classes
To provide typings, all classes on the database must be wrapped with some logic.
```ts
export class MyUser extends DbModel {
  static readonly className: string = "_User";
  static readonly keys = Keys.build(MyUser, {
    username: "username",
  });

  readonly username = new _.RequiredString(this, MyUser.keys.username);

  constructor(data: Primitive.User) {
    super(data, MyUser.keys);
  }
}
```
For a non-user object it's about the same
```ts
import * as _ from "parse-sdk-ts/attributes"
import User from './User'

export class Book extends DbModel {
  static readonly className: string = "Book";
  static readonly keys = Keys.build(Book, {
    // client_key: "db_key",
    title: "book_title",
    authors: "authors",
    description: "desc",
  });

  readonly title       = new _.RequiredString(this, Book.keys.title);
  readonly authors     = new _.Relation(User, this, Book.keys.authors);
  readonly description = new _.OptionalString(this, Book.keys.description);

  constructor(data: Primitive.Object) {   // Note argument type
    super(data, Book.keys);
  }
}
```

Attributes are found in a special import.
```ts
import * as _ from "parse-sdk-ts/attributes"
// or
import { Relation } from "parse-sdk-ts/attributes"
```
To be able to create a new object without data you would want to add the following static method.
```ts
static create() {
  return new Book(new Primitive.Object(Book.className));
}
```
Or to ensure that `Required` attributes can't be undefined.
```ts
static create(title: string, description: string) {
  const b = new Book(new Primitive.Object(Book.className));
  b.title.set(title);
  b.description.set(description);
  return b;
}
```

## Attributes

We differentiate between `Required` and `Optional` attributes. 

If we are certain that the field is defined in the database, for example ```user.username.get()```,
we can use a `Required` attribute so that we get `get(): string` instead of `get(): string | undefined`.

Even `Required` attributes can be `undefined` if the object has not been fetched, or if we fetch it via a query with `exclude` or `select`.
Therefore we can also specify an `fallback` value that will be returned if the `Required` attribute is `undefined`.

```ts
_.RequiredArray<string>(this, User.keys.weapons, [])
```


### Required Attributes 

| Type  | Name |Methods|
| ------------- | ------------- |------------- |
| `String`  | `RequiredString` |`get` `set`|
| `Number`  | `RequiredNumber` |`get` `set` `increment` `decrement` |
| `Boolean`  | `RequiredBoolean` |`get` `set`|
| `Date`  | `RequiredDate` |`get` `set`|
| `Array<T>`  | `RequiredArray<T>` |`get` `set` `append` `addUnique` `remove`|

### Optional Attributes

| Type  | Name | Methods|
| ------------- | ------------- |------------- |
| `String \| undefined`  | `OptionalString` | `get` `set` `getOrElse` |
| `Number \| undefined`  | `OptionalNumber` | `get` `set` `getOrElse` `increment` `decrement` |
| `Boolean \| undefined`  | `OptionalBoolean` |`get` `set` `getOrElse`|
| `Date \| undefined`  | `OptionalDate` |`get` `set` `getOrElse`|
| `Array<T> \| undefined`  | `OptionalArray<T>` |`get` `set` `getOrElse` `append` `addUnique` `remove` |

### Special Attributes

`T` denotes the type of the target DbModel class.

|  Name |Methods| Note|
| ------------- | ------------- |------------- |
|  `Pointer<T>` |`get` `set`| A reference to a single other object.  |
|  `StringPointer<T>` |`get` `set`| Same as `Pointer` but expects DB field to be a string (uuid) instead of Parse-Pointer.  |
|  `Relation<T>` |`add` `remove`, `query`, `findAll` | A reference to a group of other objects. |
|  `SyntheticRelation<T>` | `query`, `findAll` | Synthesizes a relation like attribute from the fact that the target class has a pointer to this object. |




## Fallback

If you need to run some code that is not supported by the API, you can access the Parse Object directly.
```ts
user.data.increment("reactions." + reactionType)
```

## Cloud Functions

We can also declare typed cloud functions in the following way.

```ts 
import { Cloud } from "parse-sdk-ts";

export const myFunction = 
Cloud.declare<(arg1: string, arg2: number) => number>(
    "my_function",
    ["arg1", "arg2"] // db expected argument names
)

const result:string = await myFunction("hello", 42)
```

It is even supported to pass our custom DbModel classes.
```ts 
import { Cloud, Primitive } from "parse-sdk-ts";

const getAuthor = Cloud.declare<(book: Book) => Primitive.User>(
    "get_author",
    ["book"]
)
const author: User = new User(await getAuthor(book))
```
Note that it is NOT supported to return custom DbModel classes. Therefore we have to wrap the result ourselves. 

## Server side rendering

Parse-SDK-TS is designed to work with server side rendering. It will automatically detect if it is running on the server. Note that it will never use the `parse/node` library but instead use the browser version with mocked localstorage. I think that this works just as fine, though it also means that the server will have access to `auth` functions which it should not use.

You should set the following environment variable to ignore the warning about this.
```ts
// .env
SERVER_RENDERING=true
```

If the master key is provided, Parse-SDK-TS will automatically load it when using the library on the server during initialization. 
```ts
// .env.local
READONLY_MASTERKEY=...
// or
MASTERKEY=... (priority)
```

We use the masterkey by doing the following.
```ts
user.save({ useMasterKey: true })
query.find({ useMasterKey: true })
// or
query.asMaster().find()
user.saveAsMaster()
```

## Error meta data

Errors are automatically split on `;;`, the left side is put into `message` and the right side JSON parsed and put into `meta`.

The reason for this is that I wanted to display one message directly to the user and still get some more information to handle on the client.

```ts
type DbError = {
  code: number,
  message: string,
  meta: {}
}
```

For example 
```ts
{
  message: 'Objektet kunde inte hittas.',
  code: 101,
  meta: { original: 'Object not found.' }
}
```
or (with zod)
```ts
{
    message: 'One field could not be saved.',
    code: 9001,
    meta: {
      key: 'username',
      code: 'too_big',
      maximum: 15,
      type: 'string',
      message: 'Username may not be longer than 15 characters'
    }
  }
```



## Other

`Parse` is exported as `Primitive` from `parse-sdk-ts`. So `Parse.Object` is now `Primitive.Object`. We should never need to use it though.

Other exports are:
`isServer`, `useLocalTestServer`
