import { Primitive as Db } from "../db";

export class DbError extends Db.Error {
  readonly meta: {};
  private constructor(code: number, message: string, meta: {}) {
    super(code, message);
    this.meta = meta;
  }
  static async parse(e: Db.Error): Promise<never> {
    let meta = {};
    let message = e.message;
    if (e.message.includes(";;")) {
      const split = e.message.split(";;");
      message = split[0];
      meta = JSON.parse(split[1]);
    }
    const err = new DbError(e.code, message, meta);

    if(err.message !== e.message)
      (err as any as Error).cause = e as any as Error;

    let stack = (err as any as Error).stack; //get the stack trace string
    let arr = stack?.split("\n"); //create an array with all lines
    arr?.splice(1, 1); //remove the second line (first line after "ERROR")
    stack = arr?.join("\n"); //join array back to a string
    (err as any as Error).stack = stack;

    // console.log(err.toJSON())
    throw err;
  }
  toJSON(): string {
    return JSON.stringify({
      code: this.code,
      message: this.message,
      meta: this.meta,
    });
  }
}
