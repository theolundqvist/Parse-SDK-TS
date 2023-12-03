/// <reference types="parse" />
import { Primitive } from "../db";
export interface IDbModel {
    /** The primitive (Parse) data of the object */
    readonly data: Primitive.Object;
    /** The id of the object */
    id: string;
    /** The database className of the object */
    readonly className: string;
}
