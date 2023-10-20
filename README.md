# Parse-SDK-TS-typed
A Parse Server client library for javascript/typescript that provides typings for database classes.
Essentially just a wrapper for [Parse-SDK-JS](https://github.com/parse-community/Parse-SDK-JS), to provide typings.

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
  static readonly keys = Key.build({
    username: "username",
  });

  readonly username = new RequiredString(this, MyUser.keys.username);

  constructor(data: Primitive.User) {
    super(data, MyUser.keys);
  }
}
```
For a non-user object it's about the same
```ts
export class Book extends DbModel {
  static readonly className: string = "Book";
  static readonly keys = Key.build({
    // client_key: "db_key",
    title: "book_title",
    description: "desc",
    authors: "authors"
  });

  readonly title = new RequiredString(this, Book.keys.title);
  readonly description = new RequiredString(this, Book.keys.description);
  readonly authors = new Relation(Author, this, Book.keys.authors);

  constructor(data: Primitive.Object) {
    super(data, Book.keys);
  }
}
```

Attributes are found in a special import.
```ts
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

### Required Attributes 
If we are certain that the field is defined in the database, for example ```User.username```

| Type  | Name |Methods|
| ------------- | ------------- |------------- |
| `String`  | `RequiredString` |`get` `set`|
| `Number`  | `RequiredNumber` |`get` `set` `increment` `decrement` |
| `Boolean`  | `RequiredBoolean` |`get` `set`|
| `Date`  | `RequiredDate` |`get` `set`|
| `Array<T>`  | `RequiredArray` |`get` `set` `append` `addUnique` `remove`|

### Optional Attributes

| Type  | Name | Methods|
| ------------- | ------------- |------------- |
| `String \| undefined`  | `OptionalString` | `get` `set`|
| `Number \| undefined`  | `OptionalNumber` | `get` `set` `increment` `decrement` |
| `Boolean \| undefined`  | `OptionalBoolean` |`get` `set`|
| `Date \| undefined`  | `OptionalDate` |`get` `set`|
| `Array<T> \| undefined`  | `OptionalArray` |`get` `set` `append` `addUnique` `remove`|

### Special Attributes

|  Name |Methods| Note|
| ------------- | ------------- |------------- |
|  `Pointer<T>` |`get` `set`| A reference to a single other object.  |
|  `Relation<T>` |`add` `remove`, `query`, `findAll` | A reference to a group of other objects. |
|  `SyntheticRelation<T>` | `query`, `findAll` | Synthesizes a relation attribute from the fact that the target class has a pointer to this object. |

## Fallback

If you need to run some code that is not supported by the API, you can access the Parse Object directly.
```ts
user.data.increment("reactions." + reactionType)
```

## Server side rendering

Parse-SDK-TS is designed to work with server side rendering. It will automatically detect if it is running on the server. Note that it will never use the `parse/node` library but instead use the browser version with mocked localstorage. Note that ``

If the master key is provided, Parse-SDK-TS will automatically load it when using the library on the server. 
```ts
// .env.local
READONLY_MASTERKEY=...
or
MASTERKEY=... (priority)
```

We use the masterkey by doing the following.
```ts
user.save({ useMasterKey: true })
query.find({ useMasterKey: true })
or
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
