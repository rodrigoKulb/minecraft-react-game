import { ReactNode, RefObject, PropsWithChildren, Provider, Consumer } from 'react';
import { Remap, FluidValue, Any, OneOrMore, InterpolatorFn, InterpolatorArgs, FluidObserver, Lookup, Falsy, ObjectFromUnion, Constrain, ObjectType, Merge, UnknownProps, RefProp, NoInfer, FluidProps, Animatable, InterpolatorConfig, ExtrapolateType } from '@react-spring/shared';
export { FrameLoop, Globals, createInterpolator } from '@react-spring/shared';
import { Lookup as Lookup$1, Falsy as Falsy$1, UnknownProps as UnknownProps$1, NoInfer as NoInfer$1 } from '@react-spring/shared/types.util';
export { UnknownProps } from '@react-spring/shared/types.util';
import { AnimatedValue, Animated, AnimatedType } from '@react-spring/animated/index.cjs.js';
export * from '@react-spring/shared/types';

/** Replace the type of each `T` property with `never` (unless compatible with `U`) */
declare type Valid<T, U> = NeverProps<T, InvalidKeys<T, U>>;
/** Replace the type of each `P` property with `never` */
declare type NeverProps<T, P extends keyof T> = Remap<Pick<T, Exclude<keyof T, P>> & {
    [K in P]: never;
}>;
/** Return a union type of every key whose `T` value is incompatible with its `U` value */
declare type InvalidKeys<T, U> = {
    [P in keyof T & keyof U]: T[P] extends U[P] ? never : P;
}[keyof T & keyof U];
/** Unwrap any `FluidValue` object types */
declare type RawValues<T extends object> = {
    [P in keyof T]: T[P] extends FluidValue<infer U> ? U : T[P];
};
/**
 * For testing whether a type is an object but not an array.
 *
 *     T extends IsPlainObject<T> ? true : false
 *
 * When `any` is passed, the resolved type is `true | false`.
 */
declare type IsPlainObject<T> = T extends ReadonlyArray<any> ? Any : T extends object ? object : Any;
declare type StringKeys<T> = T extends IsPlainObject<T> ? string & keyof T : string;

/**
 * An `Interpolation` is a memoized value that's computed whenever one of its
 * `FluidValue` dependencies has its value changed.
 *
 * Other `FrameValue` objects can depend on this. For example, passing an
 * `Interpolation` as the `to` prop of a `useSpring` call will trigger an
 * animation toward the memoized value.
 */
declare class Interpolation<In = any, Out = any> extends FrameValue<Out> {
    /** The source of input values */
    readonly source: OneOrMore<FluidValue>;
    /** Useful for debugging. */
    key?: string;
    /** Equals false when in the frameloop */
    idle: boolean;
    /** The function that maps inputs values to output */
    readonly calc: InterpolatorFn<In, Out>;
    constructor(
    /** The source of input values */
    source: OneOrMore<FluidValue>, args: InterpolatorArgs<In, Out>);
    advance(_dt?: number): void;
    protected _get(): Out;
    protected _reset(): void;
    protected _start(): void;
    protected _attach(): void;
    protected _detach(): void;
    /** @internal */
    onParentChange(event: FrameValue.Event): void;
}

/**
 * A kind of `FluidValue` that manages an `AnimatedValue` node.
 *
 * Its underlying value can be accessed and even observed.
 */
declare abstract class FrameValue<T = any> extends FluidValue<T, FrameValue.Event<T>> implements FluidObserver<FrameValue.Event> {
    readonly id: number;
    abstract key?: string;
    abstract get idle(): boolean;
    protected _priority: number;
    protected _children: Set<FrameValue.Observer<T>>;
    get priority(): number;
    set priority(priority: number);
    /** Get the current value */
    get(): T;
    /** Create a spring that maps our value to another value */
    to<Out>(...args: InterpolatorArgs<T, Out>): Interpolation<T, Out>;
    /** @deprecated Use the `to` method instead. */
    interpolate<Out>(...args: InterpolatorArgs<T, Out>): Interpolation<T, Out>;
    /** @internal */
    abstract advance(dt: number): void;
    /** @internal */
    addChild(child: FrameValue.Observer<T>): void;
    /** @internal */
    removeChild(child: FrameValue.Observer<T>): void;
    /** @internal */
    onParentChange({ type }: FrameValue.Event): void;
    /** Called when the first child is added. */
    protected _attach(): void;
    /** Called when the last child is removed. */
    protected _detach(): void;
    /**
     * Reset our animation state (eg: start values, velocity, etc)
     * and tell our children to do the same.
     *
     * This is called when our goal value is changed during (or before)
     * an animation.
     */
    protected _reset(): void;
    /**
     * Start animating if possible.
     *
     * Note: Be sure to call `_reset` first, or the animation will break.
     * This method would like to call `_reset` for you, but that would
     * interfere with paused animations.
     */
    protected _start(): void;
    /** Tell our children about our new value */
    protected _onChange(value: T, idle?: boolean): void;
    /** Tell our children about our new priority */
    protected _onPriorityChange(priority: number): void;
    protected _emit(event: FrameValue.Event): void;
}
declare namespace FrameValue {
    /** A parent changed its value */
    interface ChangeEvent<T = any> {
        type: 'change';
        value: T;
        idle: boolean;
    }
    /** A parent changed its priority */
    interface PriorityEvent {
        type: 'priority';
        priority: number;
    }
    /** A parent reset the internal state of its current animation */
    interface ResetEvent {
        type: 'reset';
    }
    /** A parent entered the frameloop */
    interface StartEvent {
        type: 'start';
    }
    /** Events sent to children of `FrameValue` objects */
    type Event<T = any> = {
        parent: FrameValue<T>;
    } & (ChangeEvent<T> | PriorityEvent | ResetEvent | StartEvent);
    /** An object that handles `FrameValue` events */
    type Observer<T = any> = FluidObserver<Event<T>>;
}

declare type SpringPhase = typeof DISPOSED | typeof CREATED | typeof IDLE | typeof PAUSED | typeof ACTIVE;
/** The spring has not animated yet */
declare const CREATED = "CREATED";
/** The spring has animated before */
declare const IDLE = "IDLE";
/** The spring is animating */
declare const ACTIVE = "ACTIVE";
/** The spring is frozen in time */
declare const PAUSED = "PAUSED";
/** The spring cannot be animated */
declare const DISPOSED = "DISPOSED";

declare class AnimationConfig {
    /**
     * With higher tension, the spring will resist bouncing and try harder to stop at its end value.
     *
     * When tension is zero, no animation occurs.
     */
    tension: number;
    /**
     * The damping ratio coefficient, or just the damping ratio when `speed` is defined.
     *
     * When `speed` is defined, this value should be between 0 and 1.
     *
     * Higher friction means the spring will slow down faster.
     */
    friction: number;
    /**
     * The natural frequency (in seconds), which dictates the number of bounces
     * per second when no damping exists.
     *
     * When defined, `tension` is derived from this, and `friction` is derived
     * from `tension` and `damping`.
     */
    frequency?: number;
    /**
     * The damping ratio, which dictates how the spring slows down.
     *
     * Set to `0` to never slow down. Set to `1` to slow down without bouncing.
     * Between `0` and `1` is for you to explore.
     *
     * Only works when `frequency` is defined.
     *
     * Defaults to 1
     */
    damping: number;
    /**
     * Higher mass means more friction is required to slow down.
     *
     * Defaults to 1, which works fine most of the time.
     */
    mass: number;
    /**
     * The initial velocity of one or more values.
     */
    velocity: number | number[];
    /**
     * The smallest velocity before the animation is considered "not moving".
     *
     * When undefined, `precision` is used instead.
     */
    restVelocity?: number;
    /**
     * The smallest distance from a value before that distance is essentially zero.
     *
     * This helps in deciding when a spring is "at rest". The spring must be within
     * this distance from its final value, and its velocity must be lower than this
     * value too (unless `restVelocity` is defined).
     */
    precision?: number;
    /**
     * For `duration` animations only. Note: The `duration` is not affected
     * by this property.
     *
     * Defaults to `0`, which means "start from the beginning".
     *
     * Setting to `1+` makes an immediate animation.
     *
     * Setting to `0.5` means "start from the middle of the easing function".
     *
     * Any number `>= 0` and `<= 1` makes sense here.
     */
    progress?: number;
    /**
     * Animation length in number of milliseconds.
     */
    duration?: number;
    /**
     * The animation curve. Only used when `duration` is defined.
     *
     * Defaults to quadratic ease-in-out.
     */
    easing: (t: number) => number;
    /**
     * Avoid overshooting by ending abruptly at the goal value.
     */
    clamp: boolean;
    /**
     * When above zero, the spring will bounce instead of overshooting when
     * exceeding its goal value. Its velocity is multiplied by `-1 + bounce`
     * whenever its current value equals or exceeds its goal. For example,
     * setting `bounce` to `0.5` chops the velocity in half on each bounce,
     * in addition to any friction.
     */
    bounce?: number;
    /**
     * "Decay animations" decelerate without an explicit goal value.
     * Useful for scrolling animations.
     *
     * Use `true` for the default exponential decay factor (`0.998`).
     *
     * When a `number` between `0` and `1` is given, a lower number makes the
     * animation slow down faster. And setting to `1` would make an unending
     * animation.
     */
    decay?: boolean | number;
    /**
     * While animating, round to the nearest multiple of this number.
     * The `from` and `to` values are never rounded, as well as any value
     * passed to the `set` method of an animated value.
     */
    round?: number;
    constructor();
}

/** These props can have default values */
declare const DEFAULT_PROPS: readonly ["pause", "cancel", "config", "immediate", "onDelayEnd", "onProps", "onStart", "onChange", "onRest"];
/**
 * Clone the given `props` and move all non-reserved props
 * into the `to` prop.
 */
declare function inferTo<T extends object>(props: T): InferTo<T>;

/** The object type of the `config` prop. */
declare type SpringConfig = Partial<AnimationConfig>;
/** @internal */
interface AnimationRange<T> {
    to: T | FluidValue<T> | undefined;
    from: T | FluidValue<T> | undefined;
}
/** Map an object type to allow `SpringValue` for any property */
declare type Springify<T> = Lookup<SpringValue<unknown> | undefined> & {
    [P in keyof T]: T[P] | SpringValue<T[P]>;
};
/**
 * The set of `SpringValue` objects returned by a `useSpring` call (or similar).
 */
declare type SpringValues<T extends Lookup = any> = [T] extends [Any] ? Lookup<SpringValue<unknown> | undefined> : {
    [P in keyof T]: SpringWrap<T[P]>;
};
declare type SpringWrap<T> = [Exclude<T, FluidValue>, Extract<T, readonly any[]>] extends [object | void, never] ? never : SpringValue<Exclude<T, FluidValue | void>> | Extract<T, void>;

/** @internal */
interface AnimationTarget<T> {
    get(): T;
    is(phase: SpringPhase): boolean;
    start(props: any): AsyncResult<T>;
    stop: SpringStopFn<any>;
}
/** The object given to the `onRest` prop and `start` promise. */
interface AnimationResult<T = any> {
    value: T;
    target?: AnimationTarget<T>;
    /** When true, no animation ever started. */
    noop?: boolean;
    /** When true, the animation was neither cancelled nor stopped prematurely. */
    finished?: boolean;
    /** When true, the animation was cancelled before it could finish. */
    cancelled?: boolean;
}
/** The promised result of an animation. */
declare type AsyncResult<T = any> = Promise<AnimationResult<T>>;

interface RunAsyncProps<T = any> extends SpringProps<T> {
    callId: number;
    parentId?: number;
    cancel: boolean;
    pause: boolean;
    delay: number;
    to?: any;
}
interface RunAsyncState<T> {
    pauseQueue: Set<Function>;
    resumeQueue: Set<Function>;
    asyncId?: number;
    asyncTo?: SpringChain<T> | SpringToFn<T>;
    promise?: AsyncResult<T>;
    cancelId?: number;
}
/** This error is thrown to signal an interrupted async animation. */
declare class BailSignal<T = any> extends Error {
    result: AnimationResult<T>;
    constructor();
}

/** The flush function that handles `start` calls */
declare type ControllerFlushFn<State extends Lookup> = (ctrl: Controller<State>, queue: ControllerQueue<State>) => AsyncResult<State>;
/**
 * An async function that can update or stop the animations of a spring.
 * Typically defined as the `to` prop.
 *
 * The `T` parameter can be a set of animated values (as an object type)
 * or a primitive type for a single animated value.
 */
interface SpringToFn<T = unknown> extends Function {
    (update: SpringStartFn<T>, stop: SpringStopFn<T>): Promise<any> | void;
}
/**
 * Update the props of an animation.
 *
 * The `T` parameter can be a set of animated values (as an object type)
 * or a primitive type for a single animated value.
 */
declare type SpringUpdateFn<T = any> = T extends IsPlainObject<T> ? UpdateValuesFn<T> : UpdateValueFn<T>;
interface AnyUpdateFn<T, Props extends object> {
    (to: SpringTo<T>, props?: Props): AsyncResult<T>;
    (props: {
        to?: SpringToFn<T> | Falsy;
    } & Props): AsyncResult<T>;
    (props: {
        to?: SpringChain<T> | Falsy;
    } & Props): AsyncResult<T>;
}
/**
 * Update the props of a `Controller` object or `useSpring` call.
 *
 * The `T` parameter must be a set of animated values (as an object type).
 */
interface UpdateValuesFn<State extends Lookup = Lookup> extends AnyUpdateFn<State, ControllerProps<State>> {
    (props: InlineToProps<State> & ControllerProps<State>): AsyncResult<State>;
    (props: {
        to?: GoalValues<State> | Falsy;
    } & ControllerProps<State>): AsyncResult<State>;
}
/**
 * Update the props of a spring.
 *
 * The `T` parameter must be a primitive type for a single animated value.
 */
interface UpdateValueFn<T = any> extends AnyUpdateFn<T, SpringProps<T>> {
    (props: {
        to?: GoalValue<T> | Falsy;
    } & SpringProps<T>): AsyncResult<T>;
}
/**
 * Start the animation described by the `props` argument.
 *
 * If nothing is passed, flush the `update` queue.
 */
interface SpringStartFn<State = unknown> {
    (props?: SpringsUpdate<State> | null): AsyncResult<State[]>;
}
/**
 * Stop every animating `SpringValue` at its current value.
 *
 * Pass one or more keys to stop selectively.
 *
 * The `T` parameter can be a set of animated values (as an object type)
 * or a primitive type for a single animated value.
 */
declare type SpringStopFn<T = unknown> = T extends object ? T extends ReadonlyArray<number | string> ? (cancel?: boolean) => void : (keys?: OneOrMore<string>) => void : (cancel?: boolean) => void;
/**
 * Pause animating `SpringValue`.
 *
 * The `T` parameter can be a set of animated values (as an object type)
 * or a primitive type for a single animated value.
 */
declare type SpringPauseFn<T = unknown> = SpringStopFn<T>;
/**
 * Resume paused `SpringValue`.
 *
 * The `T` parameter can be a set of animated values (as an object type)
 * or a primitive type for a single animated value.
 */
declare type SpringResumeFn<T = unknown> = SpringStopFn<T>;
/**
 * Called before the first frame of every animation.
 * From inside the `requestAnimationFrame` callback.
 */
declare type OnStart<T = unknown> = (spring: SpringValue<T>) => void;
/** Called when a `SpringValue` changes */
declare type OnChange<T = unknown> = (value: T, source: SpringValue<T>) => void;
/** Called once the animation comes to a halt */
declare type OnRest<T = unknown> = (result: AnimationResult<T>) => void;
/**
 * Called after an animation is updated by new props,
 * even if the animation remains idle.
 */
declare type OnProps<T = unknown> = (props: Readonly<RunAsyncProps<T>>, spring: SpringValue<T>) => void;
/**
 * Called after any delay has finished.
 */
declare type OnDelayEnd<T = unknown> = (props: RunAsyncProps<T>, spring: SpringValue<T>) => void;
declare type AnimationResolver<T> = (result: AnimationResult<T> | AsyncResult<T>) => void;

declare type TransitionPhase = typeof MOUNT | typeof ENTER | typeof UPDATE | typeof LEAVE;
/** This transition is being mounted */
declare const MOUNT = "mount";
/** This transition is entering or has entered */
declare const ENTER = "enter";
/** This transition had its animations updated */
declare const UPDATE = "update";
/** This transition will expire after animating */
declare const LEAVE = "leave";

/** The phases of a `useTransition` item */
declare type TransitionKey = 'initial' | 'enter' | 'update' | 'leave';
/**
 * Extract a union of animated values from a set of `useTransition` props.
 */
declare type TransitionValues<Props extends object> = unknown & ForwardProps<ObjectFromUnion<Constrain<ObjectType<Props[TransitionKey & keyof Props] extends infer T ? T extends ReadonlyArray<infer Element> ? Element : T extends (...args: any[]) => infer Return ? Return extends ReadonlyArray<infer ReturnElement> ? ReturnElement : Return : T : never>, {}>>>;
declare type UseTransitionProps<Item = any> = Merge<ControllerProps<UnknownProps>, {
    from?: TransitionFrom<Item>;
    initial?: TransitionFrom<Item>;
    enter?: TransitionTo<Item>;
    update?: TransitionTo<Item>;
    leave?: TransitionTo<Item>;
    key?: ItemKeys<Item>;
    sort?: (a: Item, b: Item) => number;
    trail?: number;
    /**
     * When `true` or `<= 0`, each item is unmounted immediately after its
     * `leave` animation is finished.
     *
     * When `false`, items are never unmounted.
     *
     * When `> 0`, this prop is used in a `setTimeout` call that forces a
     * rerender if the component that called `useTransition` doesn't rerender
     * on its own after an item's `leave` animation is finished.
     */
    expires?: boolean | number | ((item: Item) => boolean | number);
    config?: SpringConfig | ((item: Item, index: number) => AnimationProps['config']);
    onRest?: (result: AnimationResult<UnknownProps>, transition: TransitionState) => void;
    /**
     * Used to access the imperative API.
     *
     * Animations never auto-start when `ref` is defined.
     */
    ref?: RefProp<SpringHandle>;
}>;
declare type TransitionComponentProps<Item, Props extends object = any> = unknown & UseTransitionProps<Item> & {
    keys?: ItemKeys<NoInfer<Item>>;
    items: OneOrMore<Item>;
    children: TransitionRenderFn<NoInfer<Item>, PickAnimated<Props>>;
};
/** Default props for a `useTransition` call */
declare type TransitionDefaultProps<Item = any> = Pick<UseTransitionProps<Item>, keyof SpringDefaultProps>;
declare type Key = string | number;
declare type ItemKeys<T = any> = OneOrMore<Key> | ((item: T) => Key) | null;
/** The function returned by `useTransition` */
interface TransitionFn<Item = any, State extends object = any> {
    (render: TransitionRenderFn<Item, State>): JSX.Element;
}
interface TransitionRenderFn<Item = any, State extends object = any> {
    (values: SpringValues<State>, item: Item, transition: TransitionState<Item, State>, index: number): ReactNode;
}
interface TransitionState<Item = any, State extends object = any> {
    key: any;
    item: Item;
    ctrl: Controller<State>;
    phase: TransitionPhase;
    expired?: boolean;
    expirationId?: number;
}
declare type TransitionFrom<Item> = Falsy | GoalProp<UnknownProps> | ((item: Item, index: number) => GoalProp<UnknownProps> | Falsy);
declare type TransitionTo<Item, State extends Lookup = Lookup> = Falsy | OneOrMore<ControllerUpdate<State>> | Function | ((item: Item, index: number) => ControllerUpdate<State> | SpringChain<State> | SpringToFn<State> | Falsy);
interface Change {
    phase: TransitionPhase;
    springs: SpringValues<UnknownProps>;
    payload: ControllerUpdate;
}

/**
 * Move all non-reserved props into the `to` prop.
 */
declare type InferTo<T extends object> = Merge<{
    to: ForwardProps<T>;
}, Pick<T, keyof T & keyof ReservedProps>>;
/**
 * The props of a `useSpring` call or its async `update` function.
 *
 * The `T` parameter can be a set of animated values (as an object type)
 * or a primitive type for a single animated value.
 */
declare type SpringUpdate<T = any> = ToProps<T> & SpringProps<T>;
declare type SpringsUpdate<State extends Lookup = UnknownProps> = OneOrMore<ControllerUpdate<State>> | ((index: number, ctrl: Controller<State>) => ControllerUpdate<State> | null);
/**
 * Use the `SpringUpdate` type if you need the `to` prop to exist.
 * For function types, prefer one overload per possible `to` prop
 * type (for better type inference).
 *
 * The `T` parameter can be a set of animated values (as an object type)
 * or a primitive type for a single animated value.
 */
interface SpringProps<T = any> extends AnimationProps<T> {
    from?: GoalValue<T> | Falsy;
    loop?: LoopProp<SpringUpdate>;
    /**
     * Called after any delay has finished.
     */
    onDelayEnd?: EventProp<OnDelayEnd<T>>;
    /**
     * Called after an animation is updated by new props,
     * even if the animation remains idle.
     */
    onProps?: EventProp<OnProps<T>>;
    /**
     * Called when an animation moves for the first time.
     */
    onStart?: EventProp<OnStart<T>>;
    /**
     * Called when all animations come to a stand-still.
     */
    onRest?: EventProp<OnRest<T>>;
    /**
     * Called when a spring has its value changed.
     */
    onChange?: EventProp<OnChange<T>>;
}
/**
 * A union type of all possible `to` prop values.
 *
 * This is not recommended for function types. Instead, you should declare
 * an overload for each `to` type. See `SpringUpdateFn` for an example.
 *
 * The `T` parameter can be a set of animated values (as an object type)
 * or a primitive type for a single animated value.
 */
declare type ToProps<T = any> = {
    to?: GoalProp<T>;
} | {
    to?: SpringToFn<T> | Falsy;
} | {
    to?: SpringChain<T> | Falsy;
} | ([T] extends [IsPlainObject<T>] ? InlineToProps<T> : never);
/**
 * A value or set of values that can be animated from/to.
 *
 * The `T` parameter can be a set of animated values (as an object type)
 * or a primitive type for a single animated value.
 */
declare type GoalProp<T> = [T] extends [IsPlainObject<T>] ? GoalValues<T> | Falsy : GoalValue<T> | Falsy;
/** A set of values for a `Controller` to animate from/to. */
declare type GoalValues<T extends Lookup> = FluidProps<Partial<T>>;
/**
 * A value that `SpringValue` objects can animate from/to.
 *
 * The `UnknownProps` type lets you pass in { a: 1 } if the `key`
 * property of `SpringValue` equals "a".
 */
declare type GoalValue<T> = T | FluidValue<T> | UnknownProps;
/**
 * Where `to` is inferred from non-reserved props
 *
 * The `T` parameter can be a set of animated values (as an object type)
 * or a primitive type for a single animated value.
 */
declare type InlineToProps<T = any> = Remap<FluidProps<Partial<T>> & {
    to?: undefined;
}>;
/** A serial queue of spring updates. */
interface SpringChain<T = any> extends Array<[T] extends [IsPlainObject<T>] ? ControllerUpdate<T> : SpringTo<T> | SpringUpdate<T>> {
}
/** A value that any `SpringValue` or `Controller` can animate to. */
declare type SpringTo<T = any> = ([T] extends [IsPlainObject<T>] ? never : T | FluidValue<T>) | SpringChain<T> | SpringToFn<T> | Falsy;
declare type ControllerUpdate<State extends Lookup = Lookup> = unknown & ToProps<State> & ControllerProps<State>;
/**
 * Props for `Controller` methods and constructor.
 */
interface ControllerProps<State extends Lookup = Lookup> extends AnimationProps<State> {
    from?: GoalValues<State> | Falsy;
    loop?: LoopProp<ControllerUpdate>;
    /**
     * Called after any delay has finished.
     */
    onDelayEnd?: EventProp<OnDelayEnd<State[keyof State]>>;
    /**
     * Called when the # of animating values exceeds 0
     *
     * Also accepts an object for per-key events
     */
    onStart?: ((ctrl: Controller) => void) | {
        [P in keyof State]?: OnStart<State[P]>;
    };
    /**
     * Called when the # of animating values hits 0
     *
     * Also accepts an object for per-key events
     */
    onRest?: OnRest<State> | {
        [P in keyof State]?: OnRest<State[P]>;
    };
    /**
     * Called after an animation is updated by new props.
     * Useful for manipulation
     *
     * Also accepts an object for per-key events
     */
    onProps?: OnProps<State> | {
        [P in keyof State]?: OnProps<State[P]>;
    };
    /**
     * Called once per frame when animations are active
     *
     * Also accepts an object for per-key events
     */
    onChange?: ((values: State) => void) | {
        [P in keyof State]?: OnChange<State[P]>;
    };
}
declare type LoopProp<T extends object> = boolean | T | (() => boolean | T);
declare type VelocityProp<T = any> = T extends ReadonlyArray<number | string> ? number[] : number;
/** For props that can be set on a per-key basis. */
declare type MatchProp<P extends string = string> = boolean | OneOrMore<P> | ((key: P) => boolean);
/** Event props can be customized per-key. */
declare type EventProp<T> = T | Lookup<T | undefined>;
/**
 * Most of the reserved animation props, except `to`, `from`, `loop`,
 * and the event props.
 */
interface AnimationProps<T = any> {
    /**
     * Configure the spring behavior for each key.
     */
    config?: SpringConfig | ((key: StringKeys<T>) => SpringConfig);
    /**
     * Milliseconds to wait before applying the other props.
     */
    delay?: number | ((key: StringKeys<T>) => number);
    /**
     * When true, props jump to their goal values instead of animating.
     */
    immediate?: MatchProp<StringKeys<T>>;
    /**
     * Cancel all animations by using `true`, or some animations by using a key
     * or an array of keys.
     */
    cancel?: MatchProp<StringKeys<T>>;
    /**
     * Pause all animations by using `true`, or some animations by using a key
     * or an array of keys.
     */
    pause?: MatchProp<StringKeys<T>>;
    /**
     * Start the next animations at their values in the `from` prop.
     */
    reset?: MatchProp<StringKeys<T>>;
    /**
     * Swap the `to` and `from` props.
     */
    reverse?: boolean;
    /**
     * Override the default props with this update.
     */
    default?: boolean | SpringDefaultProps;
}
/** Default props for a `SpringValue` object */
declare type SpringDefaultProps<T = any> = {
    [D in typeof DEFAULT_PROPS[number]]?: SpringProps<T>[D];
};
/** Default props for a `Controller` object */
declare type ControllerDefaultProps<State extends Lookup = Lookup> = Pick<ControllerProps<State>, 'onStart' | 'onChange' | 'onRest'>;
/**
 * Extract the custom props that are treated like `to` values
 */
declare type ForwardProps<T extends object> = RawValues<Omit<Constrain<T, {}>, keyof ReservedProps>>;
/**
 * Property names that are reserved for animation config
 */
interface ReservedProps {
    config?: any;
    from?: any;
    to?: any;
    ref?: any;
    loop?: any;
    pause?: any;
    reset?: any;
    cancel?: any;
    reverse?: any;
    immediate?: any;
    default?: any;
    delay?: any;
    onDelayEnd?: any;
    onProps?: any;
    onStart?: any;
    onChange?: any;
    onRest?: any;
    items?: any;
    trail?: any;
    sort?: any;
    expires?: any;
    initial?: any;
    enter?: any;
    update?: any;
    leave?: any;
    children?: any;
    keys?: any;
    callId?: any;
    parentId?: any;
}
/**
 * Pick the properties of these object props...
 *
 *     "to", "from", "initial", "enter", "update", "leave"
 *
 * ...as well as any forward props.
 */
declare type PickAnimated<Props extends object, Fwd = true> = unknown & ([Props] extends [Any] ? any : ObjectFromUnion<FromValues<Props> | (TransitionKey & keyof Props extends never ? ToValues<Props, Fwd> : TransitionValues<Props>)>);
/**
 * Pick the values of the `to` prop. Forward props are *not* included.
 */
declare type ToValues<Props extends object, AndForward = true> = unknown & (AndForward extends true ? ForwardProps<Props> : unknown) & (Props extends {
    to?: any;
} ? Exclude<Props['to'], Function | ReadonlyArray<any>> extends infer To ? ForwardProps<[To] extends [object] ? To : Partial<Extract<To, object>>> : never : unknown);
/**
 * Pick the values of the `from` prop.
 */
declare type FromValues<Props extends object> = ForwardProps<Props extends {
    from?: infer From;
} ? ObjectType<From> : object>;

/** @internal */
declare type OnRest$1 = (cancel?: boolean) => void;
/** An animation being executed by the frameloop */
declare class Animation<T = any> {
    changed: boolean;
    values: readonly AnimatedValue[];
    toValues: readonly number[] | null;
    fromValues: readonly number[];
    to: T | FluidValue<T>;
    from: T | FluidValue<T>;
    config: AnimationConfig;
    immediate: boolean;
    onStart?: OnStart<T>;
    onChange?: OnChange<T>;
    onRest: OnRest$1[];
}

/**
 * Only numbers, strings, and arrays of numbers/strings are supported.
 * Non-animatable strings are also supported.
 */
declare class SpringValue<T = any> extends FrameValue<T> {
    /** The property name used when `to` or `from` is an object. Useful when debugging too. */
    key?: string;
    /** The animation state */
    animation: Animation<T>;
    /** The queue of pending props */
    queue?: SpringUpdate<T>[];
    /** The lifecycle phase of this spring */
    protected _phase: SpringPhase;
    /** The state for `runAsync` calls */
    protected _state: RunAsyncState<T>;
    /** Some props have customizable default values */
    protected _defaultProps: SpringDefaultProps<T>;
    /** The counter for tracking `scheduleProps` calls */
    protected _lastCallId: number;
    /** The last `scheduleProps` call that changed the `to` prop */
    protected _lastToId: number;
    constructor(from: Exclude<T, object>, props?: SpringUpdate<T>);
    constructor(props?: SpringUpdate<T>);
    get idle(): boolean;
    get goal(): T | (T extends FluidValue<infer U, any> ? U : T);
    get velocity(): VelocityProp<T>;
    /** Advance the current animation by a number of milliseconds */
    advance(dt: number): boolean;
    /** Check the current phase */
    is(phase: SpringPhase): boolean;
    /** Set the current value, while stopping the current animation */
    set(value: T | FluidValue<T>): this;
    /**
     * Freeze the active animation in time.
     * This does nothing when not animating.
     */
    pause(): void;
    /** Resume the animation if paused. */
    resume(): void;
    /**
     * Skip to the end of the current animation.
     *
     * All `onRest` callbacks are passed `{finished: true}`
     */
    finish(to?: T | FluidValue<T>): this;
    /** Push props into the pending queue. */
    update(props: SpringUpdate<T>): this;
    /**
     * Update this value's animation using the queue of pending props,
     * and unpause the current animation (if one is frozen).
     *
     * When arguments are passed, a new animation is created, and the
     * queued animations are left alone.
     */
    start(): AsyncResult<T>;
    start(props: SpringUpdate<T>): AsyncResult<T>;
    start(to: Animatable<T>, props?: SpringUpdate<T>): AsyncResult<T>;
    /**
     * Stop the current animation, and cancel any delayed updates.
     *
     * Pass `true` to call `onRest` with `cancelled: true`.
     */
    stop(cancel?: boolean): this;
    /** Restart the animation. */
    reset(): void;
    /** Prevent future animations, and stop the current animation */
    dispose(): void;
    /** @internal */
    onParentChange(event: FrameValue.Event): void;
    /**
     * Parse the `to` and `from` range from the given `props` object.
     *
     * This also ensures the initial value is available to animated components
     * during the render phase.
     */
    protected _prepareNode({ to, from, reverse, }: {
        to?: any;
        from?: any;
        reverse?: boolean;
    }): {
        to: any;
        from: any;
    };
    /**
     * Create an `Animated` node if none exists or the given value has an
     * incompatible type. Do nothing if `value` is undefined.
     *
     * The newest `Animated` node is returned.
     */
    protected _updateNode(value: any): Animated | undefined;
    /** Return the `Animated` node constructor for a given value */
    protected _getNodeType(value: T | FluidValue<T>): AnimatedType;
    /** Schedule an animation to run after an optional delay */
    protected _update(props: SpringUpdate<T>, isLoop?: boolean): AsyncResult<T>;
    /** Merge props into the current animation */
    protected _merge(range: AnimationRange<T>, props: RunAsyncProps<T>, resolve: AnimationResolver<T>): void;
    /** Update the `animation.to` value, which might be a `FluidValue` */
    protected _focus(value: T | FluidValue<T>): void;
    /** Set the current value and our `node` if necessary. The `_onChange` method is *not* called. */
    protected _set(value: T | FluidValue<T>): boolean;
    protected _onChange(value: T, idle?: boolean): void;
    protected _reset(): void;
    protected _start(): void;
    /**
     * Exit the frameloop and notify `onRest` listeners.
     *
     * Always wrap `_stop` calls with `batchedUpdates`.
     */
    protected _stop(cancel?: boolean): void;
}

/** Queue of pending updates for a `Controller` instance. */
interface ControllerQueue<State extends Lookup$1 = Lookup$1> extends Array<ControllerUpdate<State> & {
    /** The keys affected by this update. When null, all keys are affected. */
    keys: string[] | null;
}> {
}
declare class Controller<State extends Lookup$1 = Lookup$1> implements FrameValue.Observer {
    readonly id: number;
    /** The animated values */
    springs: SpringValues<State>;
    /** The queue of props passed to the `update` method. */
    queue: ControllerQueue<State>;
    /** Custom handler for flushing update queues */
    protected _flush?: ControllerFlushFn<State>;
    /** These props are used by all future spring values */
    protected _initialProps?: Lookup$1;
    /** The combined phase of our spring values */
    protected _phase: SpringPhase;
    /** The counter for tracking `scheduleProps` calls */
    protected _lastAsyncId: number;
    /** The values currently being animated */
    protected _active: Set<FrameValue<any>>;
    /** State used by the `runAsync` function */
    protected _state: RunAsyncState<State>;
    /** The event queues that are flushed once per frame maximum */
    protected _events: {
        onStart: Set<Function>;
        onChange: Set<Function>;
        onRest: Map<OnRest<unknown>, AnimationResult<any>>;
    };
    constructor(props?: ControllerUpdate<State> | null, flush?: ControllerFlushFn<State>);
    /**
     * Equals `true` when no spring values are in the frameloop, and
     * no async animation is currently active.
     */
    get idle(): boolean;
    /** Check the current phase */
    is(phase: SpringPhase): boolean;
    /** Get the current values of our springs */
    get(): State & UnknownProps;
    /** Push an update onto the queue of each value. */
    update(props: ControllerUpdate<State> | Falsy$1): this;
    /**
     * Start the queued animations for every spring, and resolve the returned
     * promise once all queued animations have finished or been cancelled.
     *
     * When you pass a queue (instead of nothing), that queue is used instead of
     * the queued animations added with the `update` method, which are left alone.
     */
    start(props?: OneOrMore<ControllerUpdate<State>> | null): AsyncResult<State>;
    /** Stop one animation, some animations, or all animations */
    stop(keys?: OneOrMore<string>): this;
    /** Freeze the active animation in time */
    pause(keys?: OneOrMore<string>): this;
    /** Resume the animation if paused. */
    resume(keys?: OneOrMore<string>): this;
    /** Restart every animation. */
    reset(): this;
    /** Call a function once per spring value */
    each(iterator: (spring: SpringValue, key: string) => void): void;
    /** Destroy every spring in this controller */
    dispose(): void;
    /** @internal Called at the end of every animation frame */
    protected _onFrame(): void;
    /** @internal */
    onParentChange(event: FrameValue.Event): void;
}

/**
 * The object attached to the `ref` prop by the `useSprings` hook.
 *
 * The `T` parameter should only contain animated props.
 */
interface SpringHandle<T extends Lookup = UnknownProps> {
    controllers: ReadonlyArray<Controller<T>>;
    update: (props: SpringsUpdate<T>) => SpringHandle<T>;
    start: SpringStartFn<T>;
    stop: SpringStopFn<T>;
    pause: SpringPauseFn<T>;
    resume: SpringResumeFn<T>;
}
/** Create an imperative API for manipulating an array of `Controller` objects. */
declare const SpringHandle: {
    create: (getControllers: () => Controller<Lookup<any>>[]) => SpringHandle<UnknownProps>;
};

declare function useChain(
  refs: ReadonlyArray<RefObject<SpringHandle>>,
  timeSteps?: number[],
  timeFrame?: number
): void

/**
 * The props that `useSpring` recognizes.
 */
declare type UseSpringProps<Props extends object = any> = unknown & PickAnimated<Props> extends infer State ? Remap<ControllerUpdate<State> & {
    /**
     * Used to access the imperative API.
     *
     * When defined, the render animation won't auto-start.
     */
    ref?: RefProp<SpringHandle<State>>;
}> : never;
/**
 * The `props` function is only called on the first render, unless
 * `deps` change (when defined). State is inferred from forward props.
 */
declare function useSpring<Props extends object>(props: () => (Props & Valid<Props, UseSpringProps<Props>>) | UseSpringProps, deps?: readonly any[] | undefined): [SpringValues<PickAnimated<Props>>, SpringStartFn<PickAnimated<Props>>, SpringStopFn<UnknownProps>];
/**
 * Updated on every render, with state inferred from forward props.
 */
declare function useSpring<Props extends object>(props: (Props & Valid<Props, UseSpringProps<Props>>) | UseSpringProps): SpringValues<PickAnimated<Props>>;
/**
 * Updated only when `deps` change, with state inferred from forwad props.
 */
declare function useSpring<Props extends object>(props: (Props & Valid<Props, UseSpringProps<Props>>) | UseSpringProps, deps: readonly any[] | undefined): [SpringValues<PickAnimated<Props>>, SpringStartFn<PickAnimated<Props>>, SpringStopFn<UnknownProps>];

declare type UseSpringsProps<State extends Lookup = Lookup> = unknown & ControllerUpdate<State> & {
    ref?: RefProp<SpringHandle<State>>;
};
/**
 * When the `deps` argument exists, the `props` function is called whenever
 * the `deps` change on re-render.
 *
 * Without the `deps` argument, the `props` function is only called once.
 */
declare function useSprings<Props extends UseSpringProps>(length: number, props: (i: number, ctrl: Controller) => Props, deps?: readonly any[]): PickAnimated<Props> extends infer State ? [SpringValues<State & object>[], SpringStartFn<State>, SpringStopFn<State>] : never;
/**
 * Animations are updated on re-render.
 */
declare function useSprings<Props extends UseSpringsProps>(length: number, props: Props[] & UseSpringsProps<PickAnimated<Props>>[]): SpringValues<PickAnimated<Props>>[];
/**
 * When the `deps` argument exists, you get the `update` and `stop` function.
 */
declare function useSprings<Props extends UseSpringsProps>(length: number, props: Props[] & UseSpringsProps<PickAnimated<Props>>[], deps: readonly any[] | undefined): PickAnimated<Props> extends infer State ? [SpringValues<State & object>[], SpringStartFn<State>, SpringStopFn<State>] : never;

declare type UseTrailProps<Props extends object = any> = UseSpringProps<Props>;
declare function useTrail<Props extends object>(length: number, props: (i: number, ctrl: Controller) => UseTrailProps | (Props & Valid<Props, UseTrailProps<Props>>), deps?: readonly any[]): PickAnimated<Props> extends infer State ? [SpringValues<State & object>[], SpringStartFn<State>, SpringStopFn<State>] : never;
declare function useTrail<Props extends object>(length: number, props: UseTrailProps | (Props & Valid<Props, UseTrailProps<Props>>)): SpringValues<PickAnimated<Props>>[];
declare function useTrail<Props extends object>(length: number, props: UseTrailProps | (Props & Valid<Props, UseTrailProps<Props>>), deps: readonly any[]): PickAnimated<Props> extends infer State ? [SpringValues<State & object>[], SpringStartFn<State>, SpringStopFn<State>] : never;

declare function useTransition<Item, Props extends object>(data: OneOrMore<Item>, props: UseTransitionProps<Item> | (Props & Valid<Props, UseTransitionProps<Item>>)): TransitionFn<Item, PickAnimated<Props>>;
declare function useTransition<Item, Props extends object>(data: OneOrMore<Item>, props: UseTransitionProps<Item> | (Props & Valid<Props, UseTransitionProps<Item>>), deps: any[] | undefined): PickAnimated<Props> extends infer State ? [TransitionFn<Item, State & object>, SpringStartFn<State>, SpringStopFn<State>] : never;

declare type SpringComponentProps<State extends object = UnknownProps$1> = unknown & UseSpringProps<State> & {
    children: (values: SpringValues<State>) => JSX.Element | null;
};
declare function Spring<State extends object>(props: {
    from: State;
    to?: SpringChain<NoInfer$1<State>> | SpringToFn<NoInfer$1<State>>;
} & Omit<SpringComponentProps<NoInfer$1<State>>, 'from' | 'to'>): JSX.Element | null;
declare function Spring<State extends object>(props: {
    to: State;
} & Omit<SpringComponentProps<NoInfer$1<State>>, 'to'>): JSX.Element | null;

declare type TrailComponentProps<Item, Props extends object = any> = unknown & UseSpringProps<Props> & {
    items: readonly Item[];
    children: (item: NoInfer<Item>, index: number) => ((values: SpringValues<PickAnimated<Props>>) => ReactNode) | Falsy;
};
declare function Trail<Item, Props extends TrailComponentProps<Item>>({ items, children, ...props }: Props & Valid<Props, TrailComponentProps<Item, Props>>): ({} | null | undefined)[];

declare function Transition<Item extends any, Props extends TransitionComponentProps<Item>>({ items, children, ...props }: TransitionComponentProps<Item> | (Props & Valid<Props, TransitionComponentProps<Item, Props>>)): JSX.Element;

/** Map the value of one or more dependencies */
declare const to: Interpolator;
/** @deprecated Use the `to` export instead */
declare const interpolate: Interpolator;
/** Extract the raw value types that are being interpolated */
declare type Interpolated<T extends ReadonlyArray<any>> = {
    [P in keyof T]: T[P] extends {
        get(): infer U;
    } ? U : never;
};
/**
 * This interpolates one or more `FluidValue` objects.
 * The exported `interpolate` function uses this type.
 */
interface Interpolator {
    <In, Out>(parent: FluidValue<In>, interpolator: InterpolatorFn<In, Out>): Interpolation<Out>;
    <In extends ReadonlyArray<FluidValue>, Out>(parents: In, interpolator: (...args: Interpolated<In>) => Out): Interpolation<Out>;
    <Out>(parents: OneOrMore<FluidValue>, config: InterpolatorConfig<Out>): Interpolation<Animatable<Out>>;
    <Out>(parents: OneOrMore<FluidValue<number>> | FluidValue<number[]>, range: readonly number[], output: readonly Constrain<Out, Animatable>[], extrapolate?: ExtrapolateType): Interpolation<Animatable<Out>>;
}

declare const config: {
    readonly default: {
        readonly tension: 170;
        readonly friction: 26;
    };
    readonly gentle: {
        readonly tension: 120;
        readonly friction: 14;
    };
    readonly wobbly: {
        readonly tension: 180;
        readonly friction: 12;
    };
    readonly stiff: {
        readonly tension: 210;
        readonly friction: 20;
    };
    readonly slow: {
        readonly tension: 280;
        readonly friction: 60;
    };
    readonly molasses: {
        readonly tension: 280;
        readonly friction: 120;
    };
};

/** Advance all animations forward one frame */
declare const update: () => void;

/**
 * This context affects all new and existing `SpringValue` objects
 * created with the hook API or the renderprops API.
 */
interface SpringContext {
    /** Pause all new and existing animations. */
    pause?: boolean;
    /** Cancel all new and existing animations. */
    cancel?: boolean;
    /** Force all new and existing animations to be immediate. */
    immediate?: boolean;
    /** Set the default `config` prop for future animations. */
    config?: SpringConfig;
}
declare const SpringContext: {
    ({ children, ...props }: PropsWithChildren<SpringContext>): JSX.Element;
    Provider: Provider<SpringContext>;
    Consumer: Consumer<SpringContext>;
};

export { AnimationProps, AnimationRange, AnimationResolver, AnimationResult, BailSignal, Change, Controller, ControllerDefaultProps, ControllerFlushFn, ControllerProps, ControllerUpdate, EventProp, ForwardProps, FrameValue, GoalProp, GoalValue, GoalValues, InferTo, InlineToProps, Interpolated, Interpolation, Interpolator, ItemKeys, LoopProp, MatchProp, OnChange, OnDelayEnd, OnProps, OnRest, OnStart, PickAnimated, ReservedProps, Spring, SpringChain, SpringComponentProps, SpringConfig, SpringContext, SpringDefaultProps, SpringHandle, SpringPauseFn, SpringProps, SpringResumeFn, SpringStartFn, SpringStopFn, SpringTo, SpringToFn, SpringUpdate, SpringUpdateFn, SpringValue, SpringValues, Springify, SpringsUpdate, ToProps, Trail, TrailComponentProps, Transition, TransitionComponentProps, TransitionDefaultProps, TransitionFn, TransitionFrom, TransitionKey, TransitionRenderFn, TransitionState, TransitionTo, TransitionValues, UseSpringProps, UseSpringsProps, UseTrailProps, UseTransitionProps, VelocityProp, config, inferTo, interpolate, to, update, useChain, useSpring, useSprings, useTrail, useTransition };
