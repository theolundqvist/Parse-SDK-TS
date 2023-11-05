# Parse Typescript SDK
A client/server library for typescript that provides type-safety for database classes, queries and cloud functions.

Built on top of [Parse-SDK-JS](https://github.com/parse-community/Parse-SDK-JS), which is a version agnostic peer dependency.

Tested in SSR environment on Next and Nuxt. 🧪

#### Package info
[![npm version](https://badge.fury.io/js/parse-sdk-ts.svg)](https://badge.fury.io/js/parse-sdk-ts)
[![License](https://img.shields.io/badge/License-Apache2.0-blue.svg)](https://opensource.org/licenses/Apache2.0)


## Justification
The Parse-SDK-JS API, is not only prone to spelling errors but is also exceedingly difficult to utilize for developers who are unfamiliar with the names of database keys.
```ts
book.set("author", "Tolkien") // 😰 anything accepted
// is now
book.author.set("Tolkien") // 🚀 only string accepted
```
And more importantly:
```ts
book.get("???") // 😰
// is now
book.author.get() // 🚀 full code completion
```


Please see `example/` folder for complete examples with imports.
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

  readonly username = field(this).required().string(MyUser.keys.username);

  // to make sure only Parse.User can be passed
  constructor(data: Primitive.User) {
    super(data);
  }
}
```
For a non-user object it's the same
```ts
import User from './User'

export class Book extends DbModel {
  static readonly className: string = "Book";

  // client_key: "db_key", //
  static readonly keys = Keys.build(Book, {
    title: "book_title",
    authors: "authors",
    description: "desc",
  });

  readonly title       = field(this).required().string(Book.keys.title);
  readonly authors     = field(this).relation(User, Book.keys.authors);
  readonly description = field(this).string(Book.keys.description);
}
```

To import the `field` function: 
```ts
import { field } from "parse-sdk-ts"
// or just use the quickhand
readonly title = this.field().string(Book.keys.title);
```

To be able to create a new object without data you may want to add the following static method.
```ts
static create() {
  return DbModel.createWithoutData(Book);
}
```
Or to ensure that `Required` fields can't be undefined.
```ts
static create(title: string, description: string) {
  const b = DbModel.createWithoutData(Book);
  b.title.set(title);
  b.description.set(description);
  return b;
}
```

## Fields

We differentiate between `Required` and `Optional` fields. 

If we are certain that the field is defined in the database, for example ```user.username.get()```,
we can use a `Required` field so that we get `get(): string` instead of `get(): string | undefined`.

Even `Required` fields can be `undefined` if the object has not been fetched, or if we fetch it via a query with `exclude` or `select`.
Therefore we can also specify an `fallback` value that will be returned if the `Required` field is `undefined`.

```ts
field(this).required(fallback).string(User.keys.username)
```


### Required Fields 

| Type  | Name |Methods|
| ------------- | ------------- |------------- |
| `String`  | `.required().string` |`get` `set`|
| `Number`  | `.required().number` |`get` `set` `increment` `decrement` |
| `Boolean`  | `.required().boolean` |`get` `set`|
| `Date`  | `.required().date` |`get` `set`|
| `Array<T>`  | `.required.array<T>` |`get` `set` `append` `addUnique` `remove`|

### Optional Fields

| Type  | Name | Methods|
| ------------- | ------------- |------------- |
| `String \| undefined`  | `.string` | `get` `set` `getOrElse` |
| `Number \| undefined`  | `.number` | `get` `set` `getOrElse` `increment` `decrement` |
| `Boolean \| undefined`  | `.boolean` |`get` `set` `getOrElse`|
| `Date \| undefined`  | `.date` |`get` `set` `getOrElse`|
| `Array<T> \| undefined`  | `.array<T>` |`get` `set` `getOrElse` `append` `addUnique` `remove` |

### Special Fields

`T` denotes the type of the target DbModel class.
`.required()` does not have an effect on these fields.

|  Name |Methods| Note|
| ------------- | ------------- |------------- |
|  `.pointer<T>` |`get` `set`| A reference to a single other object.  |
|  `.stringPointer<T>` |`get` `set`| Same as `Pointer` but expects DB field to be a string (uuid) instead of Parse-Pointer.  |
|  `.relation<T>` |`add` `remove`, `query`, `findAll` | A reference to a group of other objects. |
|  `.syntheticRelation<T>` | `query`, `findAll` | Synthesizes a relation like field from the fact that the target class has a pointer to this object. |




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
    ["bookId"]
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
