import { Lookup, ElementType, FluidValue, FluidObserver, FluidEvent } from '@react-spring/shared';

/** An animated number or a native attribute value */
declare class AnimatedValue<T = any> extends Animated {
    protected _value: T;
    done: boolean;
    elapsedTime: number;
    lastPosition: number;
    lastVelocity?: number | null;
    v0?: number | null;
    constructor(_value: T);
    static create<T>(from: T, _to?: T | null): AnimatedValue<T>;
    getPayload(): Payload;
    getValue(): T;
    /**
     * Set the current value and optionally round it.
     *
     * The `step` argument does nothing whenever it equals `undefined` or `0`.
     * It works with fractions and whole numbers. The best use case is (probably)
     * rounding to the pixel grid with a step of:
     *
     *      1 / window.devicePixelRatio
     */
    setValue(value: T, step?: number): boolean;
    reset(): void;
}

declare const isAnimated: <T = any>(value: any) => value is Animated<T>;
/** Get the owner's `Animated` node. */
declare const getAnimated: <T = any>(owner: any) => Animated<T> | undefined;
/** Set the owner's `Animated` node. */
declare const setAnimated: (owner: any, node: Animated<any>) => any;
/** Get every `AnimatedValue` in the owner's `Animated` node. */
declare const getPayload: (owner: any) => AnimatedValue<any>[] | undefined;
declare abstract class Animated<T = any> {
    /** The cache of animated values */
    protected payload?: Payload;
    constructor();
    /** Get the current value. Pass `true` for only animated values. */
    abstract getValue(animated?: boolean): T;
    /** Set the current value. */
    abstract setValue(value: T): void;
    /** Reset any animation state. */
    abstract reset(goal?: T): void;
    /** Get every `AnimatedValue` used by this node. */
    getPayload(): Payload;
}
declare type Payload = readonly AnimatedValue[];

declare type Value = string | number;
declare class AnimatedString extends AnimatedValue<Value> {
    protected _value: number;
    protected _string: string | null;
    protected _toString: (input: number) => string;
    constructor(from: string, to: string);
    static create<T>(from: T, to?: T | null): AnimatedValue<T>;
    getValue(): string;
    setValue(value: Value): boolean;
    reset(goal?: string): void;
}

declare type Source = Lookup | null;
/** An object containing `Animated` nodes */
declare class AnimatedObject extends Animated {
    protected source: Source;
    constructor(source?: Source);
    getValue(animated?: boolean): Source;
    /** Replace the raw object data */
    setValue(source: Source): void;
    reset(): void;
    /** Create a payload set. */
    protected _makePayload(source: Source): AnimatedValue<any>[] | undefined;
    /** Add to a payload set. */
    protected _addToPayload(this: Set<AnimatedValue>, source: any): void;
}

declare type Value$1 = number | string;
declare type Source$1 = AnimatedValue<Value$1>[];
/** An array of animated nodes */
declare class AnimatedArray<T extends ReadonlyArray<Value$1> = Value$1[]> extends AnimatedObject {
    protected source: Source$1;
    constructor(from: T, to?: T);
    static create<T extends ReadonlyArray<Value$1>>(from: T, to?: T): AnimatedArray<T>;
    getValue(): T;
    setValue(newValue: T | null): void;
    /** Convert the `from` and `to` values to an array of `Animated` nodes */
    protected _makeAnimated(from: T | null, to?: T): AnimatedValue<string | number>[];
}

declare type AnimatableComponent = string | Exclude<ElementType, string>;

interface HostConfig {
    /** Provide custom logic for native updates */
    applyAnimatedValues: (node: any, props: Lookup) => boolean | void;
    /** Wrap the `style` prop with an animated node */
    createAnimatedStyle: (style: Lookup) => Animated;
    /** Intercept props before they're passed to an animated component */
    getComponentProps: (props: Lookup) => typeof props;
}
declare type WithAnimated = {
    (Component: AnimatableComponent): any;
    [key: string]: any;
};
declare const createHost: (components: {
    [key: string]: AnimatableComponent;
} | AnimatableComponent[], { applyAnimatedValues, createAnimatedStyle, getComponentProps, }?: Partial<HostConfig>) => {
    animated: WithAnimated;
};

declare type TreeContext = {
    dependencies: Set<FluidValue>;
    host: HostConfig;
};
declare const TreeContext: {
    current: TreeContext | null;
};

declare type Props = object & {
    style?: any;
};
declare class AnimatedProps extends AnimatedObject implements FluidObserver {
    update: () => void;
    /** Equals true when an update is scheduled for "end of frame" */
    dirty: boolean;
    constructor(update: () => void);
    setValue(props: Props | null, context?: TreeContext): void;
    /** @internal */
    onParentChange({ type }: FluidEvent): void;
}

declare type AnimatedType<T = any> = Function & {
    create: (from: any, goal?: any) => T extends ReadonlyArray<number | string> ? AnimatedArray<T> : AnimatedValue<T>;
};

export { Animated, AnimatedArray, AnimatedObject, AnimatedProps, AnimatedString, AnimatedType, AnimatedValue, HostConfig, Payload, createHost, getAnimated, getPayload, isAnimated, setAnimated };
