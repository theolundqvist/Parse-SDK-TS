import { Primitive } from "../db";
import { DbModel } from "../models/DbModel";

export type Activatable<T> = { new(...args: any[]): T };

export function wrapUnsafe<T extends DbModel | undefined>(
  model: Activatable<T>,
  data: Primitive.Object,
): T {
  return new model(data);
}

export function wrap<T extends DbModel>(
  model: Activatable<T>,
  data: Primitive.Object,
): T {
  return new model(data);
}
