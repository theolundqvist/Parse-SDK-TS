import { Primitive } from "./db";
import { DbError } from "./misc";
import { Activatable, wrap } from "./util";
import { DbModel } from "./models";

export async function signUp<T extends DbModel>(
  userType: Activatable<T>,
  username: string,
  password: string,
  email: string,
): Promise<T> {
  return Primitive.User.signUp(username.trim(), password, {
    email: email.trim(),
  }).catch(DbError.parse).then((u: Primitive.User) => {
    const user = wrap(userType, u);
    return user;
  });
}

export async function signIn<T extends DbModel>(
  userType: Activatable<T>,
  usernameEmail: string,
  password: string,
): Promise<T> {
  return Primitive.User.logIn(
    usernameEmail.toLowerCase().trim(),
    password,
  )
    .catch(DbError.parse)
    .then((u: Primitive.User) => {
      const user = wrap(userType, u);
      return user;
    });
}

export async function signOut(): Promise<void> {
  return Primitive.User.logOut().catch(DbError.parse).then(() => {
      (Primitive.CoreManager as any).getObjectStateController().clearAllState(); // clear object state
  });
}

export async function requestPasswordReset(email: string): Promise<void> {
  return Primitive.User.requestPasswordReset(email).then(() => {});
}

export function current<T extends DbModel>(
  userType: Activatable<T>,
): T | null {
  const user = Primitive.User.current();
  if (user) {
    return wrap(userType, user);
  }
  return null;
}
