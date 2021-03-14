/// <reference types="react" />
declare type UseOnce = (effect: React.EffectCallback) => void;
export declare const useOnce: UseOnce;
/** Return a function that re-renders this component, if still mounted */
export declare const useForceUpdate: () => () => void;
/** Use a value from the previous render */
export declare function usePrev<T>(value: T): T | undefined;
export {};
