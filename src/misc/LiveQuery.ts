import { Primitive } from "../db";
import { IDbModel } from "../models/IDbModel";
import { Activatable } from "../util/Activatable";
import { wrap } from "../util/Wrapper";
import { DbError } from "./DbError";

export class LiveQuery<T extends IDbModel> {
  constructor(
    private readonly type: Activatable<T>,
    private readonly sub: Primitive.LiveQuerySubscription,
  ) { }

  onOpen(callback: () => void) {
    this.sub.on("open", () => {
      callback();
    });
  }
  onEnter(callback: (object: T) => void) {
    this.sub.on("enter", (object) => {
      callback(wrap(this.type, object));
    });
  }
  onUpdate(callback: (object: T) => void) {
    this.sub.on("update", (object) => {
      callback(wrap(this.type, object));
    });
  }
  onDelete(callback: (object: T) => void) {
    this.sub.on("close", (object) => {
      callback(wrap(this.type, object));
    });
  }
  onLeave(callback: (object: T) => void) {
    this.sub.on("leave", (object) => {
      callback(wrap(this.type, object));
    });
  }
  onClose(callback: () => void) {
    this.sub.on("close", () => {
      callback();
    });
  }

  unsubscribe() {
    this.sub.unsubscribe();
  }

  static closeAll(){
    (Primitive.LiveQuery as any).close();
  }

  static onAnyError(callback: (e:Primitive.Error) => void){
    Primitive.LiveQuery.on("error", (e:Primitive.Error) => {
      DbError.parse(e).catch(dbE => callback(dbE))
    });
  }
}
