/// <reference types="parse" />
import { Primitive } from "../db";
import { IDbModel } from "../models/IDbModel";
import { Activatable } from "./Activatable";
export declare function wrapUnsafe<T extends IDbModel | undefined>(model: Activatable<T>, data: Primitive.Object): T;
export declare function wrap<T extends IDbModel>(model: Activatable<T>, data: Primitive.Object): T;
