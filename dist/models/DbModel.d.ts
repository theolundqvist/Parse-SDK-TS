/// <reference types="parse" />
import { Primitive } from "../db";
import { AttributeBuilder } from "../attributes";
import { IDbModel } from "./IDbModel";
import { Activatable } from "../util/Activatable";
export declare function field<T extends IDbModel>(model: T): AttributeBuilder<T>;
export declare abstract class DbModel implements IDbModel {
    readonly data: Primitive.Object;
    /** The id of the object */
    id: string;
    /** The database className of the object */
    readonly className: string;
    constructor(data: Parse.Object);
    static createWithoutData<T extends IDbModel>(target: Activatable<T>): T;
    protected field(): AttributeBuilder<this>;
    /** The time the object was created */
    createdAt(): Date;
    /** The time the object was last updated */
    updatedAt(): Date;
    /** Save the changes to the database */
    save(options?: {
        useMasterKey?: boolean;
    }): Promise<this>;
    saveAsMaster(): Promise<this>;
    /** Delete the object from the database */
    destroy(options?: {
        useMasterKey?: boolean;
    }): Promise<Primitive.Object<Primitive.Attributes>>;
    /** Returns true if the object has never been saved to the Parse.*/
    isNew(): boolean;
    getACL(): Primitive.ACL | undefined;
    fetch(options?: {
        useMasterKey?: boolean;
    }): Promise<this>;
    printable(): Object;
}
