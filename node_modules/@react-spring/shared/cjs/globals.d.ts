import { FluidValue } from 'fluids';
import { OneOrMore } from './types.util';
import { InterpolatorConfig, InterpolatorArgs } from './types';
import { FrameLoop, OpaqueAnimation } from './FrameLoop';
export declare let createStringInterpolator: (config: InterpolatorConfig<string>) => (input: number) => string;
export declare let frameLoop: FrameLoop;
export declare let to: <In, Out>(source: OneOrMore<FluidValue>, args: InterpolatorArgs<In, Out>) => FluidValue<Out>;
export declare let now: () => number;
export declare let colorNames: {
    [key: string]: number;
} | null;
export declare let skipAnimation: boolean;
export declare let requestAnimationFrame: (cb: (time: number) => void) => void;
export declare let batchedUpdates: (callback: () => void) => void;
export declare let willAdvance: (animations: OpaqueAnimation[]) => void;
export interface AnimatedGlobals {
    /** Returns a new `Interpolation` object */
    to?: typeof to;
    /** Used to measure frame length. Read more [here](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now) */
    now?: typeof now;
    /** Provide a custom `FrameLoop` instance */
    frameLoop?: typeof frameLoop;
    /** Provide custom color names for interpolation */
    colorNames?: typeof colorNames;
    /** Make all animations instant and skip the frameloop entirely */
    skipAnimation?: typeof skipAnimation;
    /** Provide custom logic for string interpolation */
    createStringInterpolator?: typeof createStringInterpolator;
    /** Schedule a function to run on the next frame */
    requestAnimationFrame?: typeof requestAnimationFrame;
    /** Event props are called with `batchedUpdates` to reduce extraneous renders */
    batchedUpdates?: typeof batchedUpdates;
    /** @internal Exposed for testing purposes */
    willAdvance?: typeof willAdvance;
}
export declare const assign: (globals: AnimatedGlobals) => AnimatedGlobals;
