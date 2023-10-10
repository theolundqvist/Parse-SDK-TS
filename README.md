# Parse-SDK-TS-typed
A Parse Server client library for javascript/typescript that provides typings for database classes.
Essentially just a wrapper for [Parse-SDK-JS](https://github.com/parse-community/Parse-SDK-JS), to provide typings.

Tested in SSR environment on Next and Nuxt.

Please see `example/` folder for complete examples with imports.

## Setup

`npm install parse-sdk-ts`

```ts
import { initialize }  from 'parse-sdk-ts'

initialize(url, appid)
```


## Auth
```ts
import * as auth from 'parse-sdk-ts/auth'
const user = await auth.signIn(..., ...)
```

## Objects
Data is accessed via attributes instead of via string keys.
```ts
console.log(user.username.get())
user.username.set("new name")
user.level.increment()
user.weapons.addUnique("sword")
user.save()
```


## Queries
The API is essentially the same as the Parse-SDK-JS but with Keys instead of strings.
```ts
const users : User[] = new Query(User).ascending(User.keys.username).find()
```


## Classes
To provide typings, all classes on the database must be wrapped with some logic.
```ts
export class Minimal extends DbModel {
  static readonly className: string = "_Minimal";
  static readonly keys = Key.build({
    client_key: "db_key",
  });

  readonly client_key = new RequiredString(this, Minimal.keys.client_key);

  constructor(data: Primitive.User) {
    super(data, Minimal.keys);
  }
}
```
To be able to create a new object without data you would want to add the following static method.
```ts
static create() {
  return new Minimal(new Primitive.Object(Minimal.className));
}
```

## Attributes

### Required Attributes 
We are certain that the field is defined in the database, for example ```User.username```

| Type  | Name |Methods|
| ------------- | ------------- |------------- |
| `String`  | `RequiredString` |`get` `set`|
| `Number`  | `RequiredNumber` |`get` `set` `increment` `decrement` |
| `Boolean`  | `RequiredBoolean` |`get` `set`|
| `Date`  | `RequiredDate` |`get` `set`|
| `Array`  | `RequiredArray` |`get` `set` `append` `addUnique` `remove`|

### Optional Attributes

| Type  | Name | Methods|
| ------------- | ------------- |------------- |
| `String \| undefined`  | `OptionalString` | `get` `set`|
| `Number \| undefined`  | `OptionalNumber` | `get` `set` `increment` `decrement` |
| `Boolean \| undefined`  | `OptionalBoolean` |`get` `set`|
| `Date \| undefined`  | `OptionalDate` |`get` `set`|
| `Array \| undefined`  | `OptionalArray` |`get` `set` `append` `addUnique` `remove`|

### Special Attributes

|  Name |Methods| Note|
| ------------- | ------------- |------------- |
|  `Pointer` |`get` `set`| A reference to a single other object.  |
|  `Relation` |`add` `remove`, `query`, `findAll` | A reference to a group of other objects. |
|  `SynthesizedRelation` | `query`, `findAll` | Creates a relation from the fact that the target class has a pointer to this object. |


## Special error handling

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

`Parse` is exported as `DatabasePrimitive` from `parse-sdk-ts`.

Other exports are:
`isServer`, `useLocalTestServer`
