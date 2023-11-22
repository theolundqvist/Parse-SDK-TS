
import * as auth from "parse-sdk-ts/auth"
import { User } from "./models/User"

// README
// It is recommended to wrap the auth functions in your own hook. 
// This is needed since "parse-sdk-ts/auth" is not aware of your User class.
//
// The implementation can be different if you want to sync the state with the server on next/nuxt etc

export function signIn(emailOrUsername: string, password: string): Promise<User> {
  return auth.signIn(User, emailOrUsername, password)
}
export function signUp(email: string, username: string, password: string): Promise<User> {
  return auth.signUp(User, email, username, password)
}

export function signOut(): Promise<void> {
  return auth.signOut()
}

export function current(): User | null {
  return auth.current(User)
}

export async function requestPasswordReset(email: string): Promise<void> {
  return auth.requestPasswordReset(email).then(() => {})
}
