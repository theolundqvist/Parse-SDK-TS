export declare class Function<T extends (...args: any) => any> {
    readonly name: string;
    readonly argNames: string[];
    constructor(name: string, argNames: string[]);
    static create<T extends (...args: any) => any>(name: string, argNames: string[]): Function<T>;
    run: (...args: Parameters<T>) => Promise<ReturnType<T>>;
}
export declare function declare<T extends (...args: any) => any>(name: string, argNames?: string[]): (...args: Parameters<T>) => Promise<ReturnType<T>>;
