import { DatabasePrimitive } from "./db";
import { DbError } from "./misc";
import { Activatable, wrap } from "./util";
import { DbModel } from "./models";

export async function signUp<T extends DbModel>(
  userType: Activatable<T>,
  username: string,
  password: string,
  email: string,
): Promise<T> {
  return DatabasePrimitive.User.signUp(username.trim(), password, {
    email: email.trim(),
  }).catch(DbError.parse).then((u: DatabasePrimitive.User) => {
    const user = wrap(userType, u);
    return user;
  });
}

export async function signIn<T extends DbModel>(
  userType: Activatable<T>,
  usernameEmail: string,
  password: string,
): Promise<T> {
  return DatabasePrimitive.User.logIn(
    usernameEmail.toLowerCase().trim(),
    password,
  )
    .catch(DbError.parse)
    .then((u: DatabasePrimitive.User) => {
      const user = wrap(userType, u);
      return user;
    });
}

export async function signOut(): Promise<void> {
  return DatabasePrimitive.User.logOut().catch(DbError.parse).then(() => {
      (DatabasePrimitive.CoreManager as any).getObjectStateController().clearAllState(); // clear object state
  });
}

export async function requestPasswordReset(email: string): Promise<void> {
  return DatabasePrimitive.User.requestPasswordReset(email).then(() => {});
}

export function current<T extends DbModel>(
  userType: Activatable<T>,
): T | null {
  const user = DatabasePrimitive.User.current();
  if (user) {
    return wrap(userType, user);
  }
  return null;
}
