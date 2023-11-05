import { Primitive } from "../db";
import { IDbModel } from "../models/IDbModel";
import { Activatable } from "./Activatable";

export function wrapUnsafe<T extends IDbModel | undefined>(
  model: Activatable<T>,
  data: Primitive.Object,
): T {
  return new model(data);
}

export function wrap<T extends IDbModel>(
  model: Activatable<T>,
  data: Primitive.Object,
): T {
  return new model(data);
}
