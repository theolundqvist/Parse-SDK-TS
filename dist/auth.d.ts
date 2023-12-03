import { Activatable } from "./util";
import { DbModel } from "./models";
export declare function signUp<T extends DbModel>(userType: Activatable<T>, username: string, password: string, email: string): Promise<T>;
export declare function signIn<T extends DbModel>(userType: Activatable<T>, usernameEmail: string, password: string): Promise<T>;
export declare function signOut(): Promise<void>;
export declare function requestPasswordReset(email: string): Promise<void>;
export declare function current<T extends DbModel>(userType: Activatable<T>): T | null;
