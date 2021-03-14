import { Lookup } from './types.util';
export declare const noop: () => void;
export declare const defineHidden: (obj: any, key: any, value: any) => any;
interface IsArray {
    <T>(a: T): a is T & readonly any[];
}
export declare const is: {
    arr: IsArray;
    obj: <T extends any>(a: T) => a is Exclude<T & Lookup<any>, Function | readonly any[]>;
    fun: (a: unknown) => a is Function;
    str: (a: unknown) => a is string;
    num: (a: unknown) => a is number;
    und: (a: unknown) => a is undefined;
};
/** Compare animatable values */
export declare function isEqual(a: any, b: any): boolean;
export declare const isAnimatedString: (value: unknown) => value is string;
declare type Eachable<Value, Key> = {
    forEach: (cb: (value: Value, key: Key) => void, ctx?: any) => void;
};
declare type InferKey<T extends object> = T extends Eachable<any, infer Key> ? Key : Extract<keyof T, string>;
declare type InferValue<T extends object> = T extends Eachable<infer Value, any> | {
    [key: string]: infer Value;
} ? Value : never;
/** An unsafe object/array/set iterator that allows for better minification */
export declare const each: <T extends object, This>(obj: T & {
    forEach?: Function | undefined;
}, cb: (this: This, value: InferValue<T>, key: InferKey<T>) => void, ctx?: This | undefined) => void;
export declare const toArray: <T>(a: T) => Exclude<T, void> extends readonly any[] ? (readonly any[] & Exclude<T, void>)[number][] extends readonly any[] & Exclude<T, void> ? readonly (Exclude<T, void> extends readonly (infer U)[] ? U : Exclude<T, void>)[] : readonly any[] & Exclude<T, void> : readonly (Exclude<T, void> extends readonly (infer U_1)[] ? U_1 : Exclude<T, void>)[];
/** Copy the `queue`, then iterate it after the `queue` is cleared */
export declare function flush<P, T>(queue: Map<P, T>, iterator: (entry: [P, T]) => void): void;
export declare function flush<T>(queue: Set<T>, iterator: (value: T) => void): void;
export {};
