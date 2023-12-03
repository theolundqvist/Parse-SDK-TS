import { Primitive } from "./db";
import { DbError } from "./misc";
import { wrap } from "./util";
export async function signUp(userType, username, password, email) {
    return Primitive.User.signUp(username.trim(), password, {
        email: email.trim(),
    }).catch(DbError.parse).then((u) => {
        const user = wrap(userType, u);
        return user;
    });
}
export async function signIn(userType, usernameEmail, password) {
    return Primitive.User.logIn(usernameEmail.toLowerCase().trim(), password)
        .catch(DbError.parse)
        .then((u) => {
        const user = wrap(userType, u);
        return user;
    });
}
export async function signOut() {
    return Primitive.User.logOut().catch(DbError.parse).then(() => {
        Primitive.CoreManager.getObjectStateController().clearAllState(); // clear object state
    });
}
export async function requestPasswordReset(email) {
    return Primitive.User.requestPasswordReset(email).then(() => { });
}
export function current(userType) {
    const user = Primitive.User.current();
    if (user) {
        return wrap(userType, user);
    }
    return null;
}
