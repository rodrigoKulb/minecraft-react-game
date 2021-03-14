import { FrameRequestCallback } from './types';
export declare type RequestFrameFn = (cb: FrameRequestCallback) => number | void;
export interface OpaqueAnimation {
    idle: boolean;
    priority: number;
    advance(dt: number): void;
}
export interface Timeout {
    time: number;
    handler: () => void;
    cancel: () => void;
}
/**
 * FrameLoop executes its animations in order of lowest priority first.
 * Animations are retained until idle.
 */
export declare class FrameLoop {
    /**
     * Start a new animation, or reorder an active animation in
     * the animations array in response to a priority change.
     */
    start: (animation: OpaqueAnimation) => void;
    /**
     * Advance the animations to the current time.
     */
    advance: () => void;
    /**
     * Invoke the given `handler` on the soonest frame after the given
     * `ms` delay is completed. When the delay is `<= 0`, the handler is
     * invoked immediately.
     */
    setTimeout: (handler: () => void, ms: number) => Timeout;
    /**
     * Execute a function once after all animations have updated.
     */
    onFrame: (cb: FrameRequestCallback) => void;
    /**
     * Execute a function once at the very end of the current frame.
     *
     * Only call this within an `onFrame` callback.
     */
    onWrite: (cb: FrameRequestCallback) => void;
    protected _animations: OpaqueAnimation[];
    protected _dispose: () => void;
    constructor(raf?: RequestFrameFn);
}
