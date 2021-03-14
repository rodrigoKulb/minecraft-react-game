import { useLayoutEffect } from 'react-layout-effect';
import { each, is, toArray, isAnimatedString, getFluidConfig, Globals, FluidValue, getFluidValue, flush, isEqual, noop, useForceUpdate, usePrev, useOnce, createInterpolator } from '@react-spring/shared';
export { FrameLoop, Globals, createInterpolator } from '@react-spring/shared';
import _extends from '@babel/runtime/helpers/esm/extends';
import { createContext, useContext, createElement, useRef, useState, useMemo as useMemo$1, useImperativeHandle, Fragment } from 'react';
import { getAnimated, AnimatedValue, getPayload, setAnimated, AnimatedArray, AnimatedString } from '@react-spring/animated';
import { createStringInterpolator, batchedUpdates, to as to$1, frameLoop, skipAnimation } from '@react-spring/shared/globals';
import { useMemoOne, useCallbackOne } from 'use-memo-one';
import { deprecateInterpolate } from '@react-spring/shared/deprecations';
import _objectWithoutPropertiesLoose from '@babel/runtime/helpers/esm/objectWithoutPropertiesLoose';
import { createStringInterpolator as createStringInterpolator$1 } from '@react-spring/shared/stringInterpolation';
export * from '@react-spring/shared/types';

/** API
 *  useChain(references, timeSteps, timeFrame)
 */

function useChain(refs, timeSteps, timeFrame = 1000) {
  useLayoutEffect(() => {
    if (timeSteps) {
      let prevDelay = 0;
      each(refs, (ref, i) => {
        if (!ref.current) return;
        const {
          controllers
        } = ref.current;

        if (controllers.length) {
          let delay = timeFrame * timeSteps[i]; // Use the previous delay if none exists.

          if (isNaN(delay)) delay = prevDelay;else prevDelay = delay;
          each(controllers, ctrl => {
            each(ctrl.queue, props => {
              props.delay = delay + (props.delay || 0);
            });
            ctrl.start();
          });
        }
      });
    } else {
      let p = Promise.resolve();
      each(refs, ref => {
        const {
          controllers,
          start
        } = ref.current || {};

        if (controllers && controllers.length) {
          // Take the queue of each controller
          const updates = controllers.map(ctrl => {
            const q = ctrl.queue;
            ctrl.queue = [];
            return q;
          }); // Apply the queue when the previous ref stops animating

          p = p.then(() => {
            each(controllers, (ctrl, i) => ctrl.queue.push(...updates[i]));
            return start();
          });
        }
      });
    }
  });
}

// The `mass` prop defaults to 1
const config = {
  default: {
    tension: 170,
    friction: 26
  },
  gentle: {
    tension: 120,
    friction: 14
  },
  wobbly: {
    tension: 180,
    friction: 12
  },
  stiff: {
    tension: 210,
    friction: 20
  },
  slow: {
    tension: 280,
    friction: 60
  },
  molasses: {
    tension: 280,
    friction: 120
  }
};

const linear = t => t;

const defaults = _extends(_extends({}, config.default), {}, {
  mass: 1,
  damping: 1,
  easing: linear,
  clamp: false
});

class AnimationConfig {
  /**
   * With higher tension, the spring will resist bouncing and try harder to stop at its end value.
   *
   * When tension is zero, no animation occurs.
   */

  /**
   * The damping ratio coefficient, or just the damping ratio when `speed` is defined.
   *
   * When `speed` is defined, this value should be between 0 and 1.
   *
   * Higher friction means the spring will slow down faster.
   */

  /**
   * The natural frequency (in seconds), which dictates the number of bounces
   * per second when no damping exists.
   *
   * When defined, `tension` is derived from this, and `friction` is derived
   * from `tension` and `damping`.
   */

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

  /**
   * Higher mass means more friction is required to slow down.
   *
   * Defaults to 1, which works fine most of the time.
   */

  /**
   * The initial velocity of one or more values.
   */

  /**
   * The smallest velocity before the animation is considered "not moving".
   *
   * When undefined, `precision` is used instead.
   */

  /**
   * The smallest distance from a value before that distance is essentially zero.
   *
   * This helps in deciding when a spring is "at rest". The spring must be within
   * this distance from its final value, and its velocity must be lower than this
   * value too (unless `restVelocity` is defined).
   */

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

  /**
   * Animation length in number of milliseconds.
   */

  /**
   * The animation curve. Only used when `duration` is defined.
   *
   * Defaults to quadratic ease-in-out.
   */

  /**
   * Avoid overshooting by ending abruptly at the goal value.
   */

  /**
   * When above zero, the spring will bounce instead of overshooting when
   * exceeding its goal value. Its velocity is multiplied by `-1 + bounce`
   * whenever its current value equals or exceeds its goal. For example,
   * setting `bounce` to `0.5` chops the velocity in half on each bounce,
   * in addition to any friction.
   */

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

  /**
   * While animating, round to the nearest multiple of this number.
   * The `from` and `to` values are never rounded, as well as any value
   * passed to the `set` method of an animated value.
   */
  constructor() {
    this.tension = void 0;
    this.friction = void 0;
    this.frequency = void 0;
    this.damping = void 0;
    this.mass = void 0;
    this.velocity = 0;
    this.restVelocity = void 0;
    this.precision = void 0;
    this.progress = void 0;
    this.duration = void 0;
    this.easing = void 0;
    this.clamp = void 0;
    this.bounce = void 0;
    this.decay = void 0;
    this.round = void 0;
    Object.assign(this, defaults);
  }

}
function mergeConfig(config, newConfig, defaultConfig) {
  if (defaultConfig) {
    defaultConfig = _extends({}, defaultConfig);
    sanitizeConfig(defaultConfig, newConfig);
    newConfig = _extends(_extends({}, defaultConfig), newConfig);
  }

  sanitizeConfig(config, newConfig);
  Object.assign(config, newConfig);

  for (const key in defaults) {
    if (config[key] == null) {
      config[key] = defaults[key];
    }
  }

  let {
    mass,
    frequency,
    damping
  } = config;

  if (!is.und(frequency)) {
    if (frequency < 0.01) frequency = 0.01;
    if (damping < 0) damping = 0;
    config.tension = Math.pow(2 * Math.PI / frequency, 2) * mass;
    config.friction = 4 * Math.PI * damping * mass / frequency;
  }

  return config;
} // Prevent a config from accidentally overriding new props.
// This depends on which "config" props take precedence when defined.

function sanitizeConfig(config, props) {
  if (!is.und(props.decay)) {
    config.duration = undefined;
  } else {
    const isTensionConfig = !is.und(props.tension) || !is.und(props.friction);

    if (isTensionConfig || !is.und(props.frequency) || !is.und(props.damping) || !is.und(props.mass)) {
      config.duration = undefined;
      config.decay = undefined;
    }

    if (isTensionConfig) {
      config.frequency = undefined;
    }
  }
}

const emptyArray = [];
/** @internal */

/** An animation being executed by the frameloop */
class Animation {
  constructor() {
    this.changed = false;
    this.values = emptyArray;
    this.toValues = null;
    this.fromValues = emptyArray;
    this.to = void 0;
    this.from = void 0;
    this.config = new AnimationConfig();
    this.immediate = false;
    this.onStart = void 0;
    this.onChange = void 0;
    this.onRest = [];
  }

}

// @see https://github.com/alexreardon/use-memo-one/pull/10
const useMemo = (create, deps) => useMemoOne(create, deps || [{}]);
function callProp(value, ...args) {
  return is.fun(value) ? value(...args) : value;
}
/** Try to coerce the given value into a boolean using the given key */

const matchProp = (value, key) => value === true || !!(key && value && (is.fun(value) ? value(key) : toArray(value).includes(key)));
const getProps = (props, i, arg) => props && (is.fun(props) ? props(i, arg) : is.arr(props) ? props[i] : _extends({}, props));
/** Returns `true` if the given prop is having its default value set. */

const hasDefaultProp = (props, key) => !is.und(getDefaultProp(props, key));
/** Get the default value being set for the given `key` */

const getDefaultProp = (props, key) => props.default === true ? props[key] : props.default ? props.default[key] : undefined;
/**
 * Extract the default props from an update.
 *
 * When the `default` prop is falsy, this function still behaves as if
 * `default: true` was used. The `default` prop is always respected when
 * truthy.
 */

const getDefaultProps = (props, omitKeys = [], defaults = {}) => {
  let keys = DEFAULT_PROPS;

  if (props.default && props.default !== true) {
    props = props.default;
    keys = Object.keys(props);
  }

  for (const key of keys) {
    const value = props[key];

    if (!is.und(value) && !omitKeys.includes(key)) {
      defaults[key] = value;
    }
  }

  return defaults;
};
/** Merge the default props of an update into a props cache. */

const mergeDefaultProps = (defaults, props, omitKeys) => getDefaultProps(props, omitKeys, defaults);
/** These props can have default values */

const DEFAULT_PROPS = ['pause', 'cancel', 'config', 'immediate', 'onDelayEnd', 'onProps', 'onStart', 'onChange', 'onRest'];
const RESERVED_PROPS = {
  config: 1,
  from: 1,
  to: 1,
  ref: 1,
  loop: 1,
  reset: 1,
  pause: 1,
  cancel: 1,
  reverse: 1,
  immediate: 1,
  default: 1,
  delay: 1,
  onDelayEnd: 1,
  onProps: 1,
  onStart: 1,
  onChange: 1,
  onRest: 1,
  // Transition props
  items: 1,
  trail: 1,
  sort: 1,
  expires: 1,
  initial: 1,
  enter: 1,
  update: 1,
  leave: 1,
  children: 1,
  // Internal props
  keys: 1,
  callId: 1,
  parentId: 1
};
/**
 * Extract any properties whose keys are *not* reserved for customizing your
 * animations. All hooks use this function, which means `useTransition` props
 * are reserved for `useSpring` calls, etc.
 */

function getForwardProps(props) {
  const forward = {};
  let count = 0;
  each(props, (value, prop) => {
    if (!RESERVED_PROPS[prop]) {
      forward[prop] = value;
      count++;
    }
  });

  if (count) {
    return forward;
  }
}
/**
 * Clone the given `props` and move all non-reserved props
 * into the `to` prop.
 */


function inferTo(props) {
  const to = getForwardProps(props);

  if (to) {
    const out = {
      to
    };
    each(props, (val, key) => key in to || (out[key] = val));
    return out;
  }

  return _extends({}, props);
} // Compute the goal value, converting "red" to "rgba(255, 0, 0, 1)" in the process

function computeGoal(value) {
  const config = getFluidConfig(value);
  return config ? computeGoal(config.get()) : is.arr(value) ? value.map(computeGoal) : isAnimatedString(value) ? createStringInterpolator({
    range: [0, 1],
    output: [value, value]
  })(1) : value;
}

/**
 * This function sets a timeout if both the `delay` prop exists and
 * the `cancel` prop is not `true`.
 *
 * The `actions.start` function must handle the `cancel` prop itself,
 * but the `pause` prop is taken care of.
 */
function scheduleProps(callId, {
  key,
  props,
  state,
  actions
}) {
  return new Promise((resolve, reject) => {
    let delay;
    let timeout;
    let pause = false;
    let cancel = matchProp(props.cancel, key);

    if (cancel) {
      onStart();
    } else {
      delay = callProp(props.delay || 0, key);
      pause = matchProp(props.pause, key);

      if (pause) {
        state.resumeQueue.add(onResume);
        actions.pause();
      } else {
        actions.resume();
        onResume();
      }
    }

    function onPause() {
      state.resumeQueue.add(onResume);
      timeout.cancel(); // Cache the remaining delay.

      delay = timeout.time - Globals.now();
    }

    function onResume() {
      if (delay > 0) {
        state.pauseQueue.add(onPause);
        timeout = Globals.frameLoop.setTimeout(onStart, delay);
      } else {
        onStart();
      }
    }

    function onStart() {
      state.pauseQueue.delete(onPause); // Maybe cancelled during its delay.

      if (callId <= (state.cancelId || 0)) {
        cancel = true;
      }

      try {
        actions.start(_extends(_extends({}, props), {}, {
          callId,
          delay,
          cancel,
          pause
        }), resolve);
      } catch (err) {
        reject(err);
      }
    }
  });
}

/** @internal */

/** The object given to the `onRest` prop and `start` promise. */

/** The promised result of an animation. */

/** @internal */
const getCombinedResult = (target, results) => results.length == 1 ? results[0] : results.some(result => result.cancelled) ? getCancelledResult(target) : results.every(result => result.noop) ? getNoopResult(target) : getFinishedResult(target, results.every(result => result.finished));
/** No-op results are for updates that never start an animation. */

const getNoopResult = (target, value = target.get()) => ({
  value,
  noop: true,
  finished: true,
  target
});
const getFinishedResult = (target, finished, value = target.get()) => ({
  value,
  finished,
  target
});
const getCancelledResult = (target, value = target.get()) => ({
  value,
  cancelled: true,
  target
});

/**
 * Start an async chain or an async script.
 *
 * Always call `runAsync` in the action callback of a `scheduleProps` call.
 *
 * The `T` parameter can be a set of animated values (as an object type)
 * or a primitive type for a single animated value.
 */
async function runAsync(to, props, state, target) {
  if (props.pause) {
    await new Promise(resume => {
      state.resumeQueue.add(resume);
    });
  }

  const {
    callId,
    parentId,
    onRest
  } = props;
  const {
    asyncTo: prevTo,
    promise: prevPromise
  } = state;

  if (!parentId && to === prevTo && !props.reset) {
    return prevPromise;
  }

  return state.promise = (async () => {
    state.asyncId = callId;
    state.asyncTo = to; // The default props of any `animate` calls.

    const defaultProps = getDefaultProps(props, [// The `onRest` prop is only called when the `runAsync` promise is resolved.
    'onRest']);
    let preventBail;
    let bail; // This promise is rejected when the animation is interrupted.

    const bailPromise = new Promise((resolve, reject) => (preventBail = resolve, bail = reject)); // Stop animating when an error is caught.

    const withBailHandler = fn => (...args) => {
      const onError = err => {
        if (err instanceof BailSignal) {
          bail(err); // Stop animating.
        }

        throw err;
      };

      try {
        return fn(...args).catch(onError);
      } catch (err) {
        onError(err);
      }
    };

    const bailIfEnded = bailSignal => {
      const bailResult = // The `cancel` prop or `stop` method was used.
      callId <= (state.cancelId || 0) && getCancelledResult(target) || // The async `to` prop was replaced.
      callId !== state.asyncId && getFinishedResult(target, false);

      if (bailResult) {
        bailSignal.result = bailResult;
        throw bailSignal;
      }
    }; // Note: This function cannot use the `async` keyword, because we want the
    // `throw` statements to interrupt the caller.


    const animate = withBailHandler((arg1, arg2) => {
      const bailSignal = new BailSignal();
      bailIfEnded(bailSignal);
      const props = is.obj(arg1) ? _extends({}, arg1) : _extends(_extends({}, arg2), {}, {
        to: arg1
      });
      props.parentId = callId;
      each(defaultProps, (value, key) => {
        if (is.und(props[key])) {
          props[key] = value;
        }
      });
      return target.start(props).then(async result => {
        bailIfEnded(bailSignal);

        if (target.is('PAUSED')) {
          await new Promise(resume => {
            state.resumeQueue.add(resume);
          });
        }

        return result;
      });
    });
    let result;

    try {
      let animating; // Async sequence

      if (is.arr(to)) {
        animating = (async queue => {
          for (const props of queue) {
            await animate(props);
          }
        })(to);
      } // Async script
      else if (is.fun(to)) {
          animating = Promise.resolve(to(animate, target.stop.bind(target)));
        }

      await Promise.all([animating.then(preventBail), bailPromise]);
      result = getFinishedResult(target, true); // Bail handling
    } catch (err) {
      if (err instanceof BailSignal) {
        result = err.result;
      } else {
        throw err;
      } // Reset the async state.

    } finally {
      if (callId == state.asyncId) {
        state.asyncId = parentId;
        state.asyncTo = parentId ? prevTo : undefined;
        state.promise = parentId ? prevPromise : undefined;
      }
    }

    if (is.fun(onRest)) {
      batchedUpdates(() => {
        onRest(result);
      });
    }

    return result;
  })();
}
function cancelAsync(state, callId) {
  state.cancelId = callId;
  state.asyncId = state.asyncTo = state.promise = undefined;
}
/** This error is thrown to signal an interrupted async animation. */

class BailSignal extends Error {
  constructor() {
    super('An async animation has been interrupted. You see this error because you ' + 'forgot to use `await` or `.catch(...)` on its returned promise.');
    this.result = void 0;
  }

}

const isFrameValue = value => value instanceof FrameValue;
let nextId = 1;
/**
 * A kind of `FluidValue` that manages an `AnimatedValue` node.
 *
 * Its underlying value can be accessed and even observed.
 */

class FrameValue extends FluidValue {
  constructor(...args) {
    super(...args);
    this.id = nextId++;
    this.key = void 0;
    this._priority = 0;
    this._children = new Set();
  }

  get priority() {
    return this._priority;
  }

  set priority(priority) {
    if (this._priority != priority) {
      this._priority = priority;

      this._onPriorityChange(priority);
    }
  }
  /** Get the current value */


  get() {
    const node = getAnimated(this);
    return node && node.getValue();
  }
  /** Create a spring that maps our value to another value */


  to(...args) {
    return to$1(this, args);
  }
  /** @deprecated Use the `to` method instead. */


  interpolate(...args) {
    deprecateInterpolate();
    return to$1(this, args);
  }
  /** @internal */


  /** @internal */
  addChild(child) {
    if (!this._children.size) this._attach();

    this._children.add(child);
  }
  /** @internal */


  removeChild(child) {
    this._children.delete(child);

    if (!this._children.size) this._detach();
  }
  /** @internal */


  onParentChange({
    type
  }) {
    if (this.idle) {
      // Start animating when a parent does.
      if (type == 'start') {
        this._reset();

        this._start();
      }
    } // Reset our animation state when a parent does, but only when
    // our animation is active.
    else if (type == 'reset') {
        this._reset();
      }
  }
  /** Called when the first child is added. */


  _attach() {}
  /** Called when the last child is removed. */


  _detach() {}
  /**
   * Reset our animation state (eg: start values, velocity, etc)
   * and tell our children to do the same.
   *
   * This is called when our goal value is changed during (or before)
   * an animation.
   */


  _reset() {
    this._emit({
      type: 'reset',
      parent: this
    });
  }
  /**
   * Start animating if possible.
   *
   * Note: Be sure to call `_reset` first, or the animation will break.
   * This method would like to call `_reset` for you, but that would
   * interfere with paused animations.
   */


  _start() {
    this._emit({
      type: 'start',
      parent: this
    });
  }
  /** Tell our children about our new value */


  _onChange(value, idle = false) {
    this._emit({
      type: 'change',
      parent: this,
      value,
      idle
    });
  }
  /** Tell our children about our new priority */


  _onPriorityChange(priority) {
    if (!this.idle) {
      // Make the frameloop aware of our new priority.
      frameLoop.start(this);
    }

    this._emit({
      type: 'priority',
      parent: this,
      priority
    });
  }

  _emit(event) {
    // Clone "_children" so it can be safely mutated inside the loop.
    each(Array.from(this._children), child => {
      child.onParentChange(event);
    });
  }

}

// TODO: use "const enum" when Babel supports it

/** The spring has not animated yet */
const CREATED = 'CREATED';
/** The spring has animated before */

const IDLE = 'IDLE';
/** The spring is animating */

const ACTIVE = 'ACTIVE';
/** The spring is frozen in time */

const PAUSED = 'PAUSED';
/** The spring cannot be animated */

const DISPOSED = 'DISPOSED';

/**
 * Only numbers, strings, and arrays of numbers/strings are supported.
 * Non-animatable strings are also supported.
 */
class SpringValue extends FrameValue {
  /** The property name used when `to` or `from` is an object. Useful when debugging too. */

  /** The animation state */

  /** The queue of pending props */

  /** The lifecycle phase of this spring */

  /** The state for `runAsync` calls */

  /** Some props have customizable default values */

  /** The counter for tracking `scheduleProps` calls */

  /** The last `scheduleProps` call that changed the `to` prop */
  constructor(arg1, arg2) {
    super();
    this.key = void 0;
    this.animation = new Animation();
    this.queue = void 0;
    this._phase = CREATED;
    this._state = {
      pauseQueue: new Set(),
      resumeQueue: new Set()
    };
    this._defaultProps = {};
    this._lastCallId = 0;
    this._lastToId = 0;

    if (!is.und(arg1) || !is.und(arg2)) {
      const props = is.obj(arg1) ? _extends({}, arg1) : _extends(_extends({}, arg2), {}, {
        from: arg1
      });
      props.default = true;
      this.start(props);
    }
  }

  get idle() {
    return !this.is(ACTIVE) && !this._state.asyncTo;
  }

  get goal() {
    return getFluidValue(this.animation.to);
  }

  get velocity() {
    const node = getAnimated(this);
    return node instanceof AnimatedValue ? node.lastVelocity || 0 : node.getPayload().map(node => node.lastVelocity || 0);
  }
  /** Advance the current animation by a number of milliseconds */


  advance(dt) {
    let idle = true;
    let changed = false;
    const anim = this.animation;
    let {
      config,
      toValues
    } = anim;
    const payload = getPayload(anim.to);

    if (!payload) {
      const toConfig = getFluidConfig(anim.to);

      if (toConfig) {
        toValues = toArray(toConfig.get());
      }
    }

    anim.values.forEach((node, i) => {
      if (node.done) return; // The "anim.toValues" array must exist when no parent exists.

      let to = payload ? payload[i].lastPosition : toValues[i];
      let finished = anim.immediate;
      let position = to;

      if (!finished) {
        position = node.lastPosition; // Loose springs never move.

        if (config.tension <= 0) {
          node.done = true;
          return;
        }

        const elapsed = node.elapsedTime += dt;
        const from = anim.fromValues[i];
        const v0 = node.v0 != null ? node.v0 : node.v0 = is.arr(config.velocity) ? config.velocity[i] : config.velocity;
        let velocity; // Duration easing

        if (!is.und(config.duration)) {
          let p = config.progress || 0;
          if (config.duration <= 0) p = 1;else p += (1 - p) * Math.min(1, elapsed / config.duration);
          position = from + config.easing(p) * (to - from);
          velocity = (position - node.lastPosition) / dt;
          finished = p == 1;
        } // Decay easing
        else if (config.decay) {
            const decay = config.decay === true ? 0.998 : config.decay;
            const e = Math.exp(-(1 - decay) * elapsed);
            position = from + v0 / (1 - decay) * (1 - e);
            finished = Math.abs(node.lastPosition - position) < 0.1; // derivative of position

            velocity = v0 * e;
          } // Spring easing
          else {
              velocity = node.lastVelocity == null ? v0 : node.lastVelocity;
              /** The smallest distance from a value before being treated like said value. */

              const precision = config.precision || (from == to ? 0.005 : Math.min(1, Math.abs(to - from) * 0.001));
              /** The velocity at which movement is essentially none */

              const restVelocity = config.restVelocity || precision / 10; // Bouncing is opt-in (not to be confused with overshooting)

              const bounceFactor = config.clamp ? 0 : config.bounce;
              const canBounce = !is.und(bounceFactor);
              /** When `true`, the value is increasing over time */

              const isGrowing = from == to ? node.v0 > 0 : from < to;
              /** When `true`, the velocity is considered moving */

              let isMoving;
              /** When `true`, the velocity is being deflected or clamped */

              let isBouncing = false;
              const step = 1; // 1ms

              const numSteps = Math.ceil(dt / step);

              for (let n = 0; n < numSteps; ++n) {
                isMoving = Math.abs(velocity) > restVelocity;

                if (!isMoving) {
                  finished = Math.abs(to - position) <= precision;

                  if (finished) {
                    break;
                  }
                }

                if (canBounce) {
                  isBouncing = position == to || position > to == isGrowing; // Invert the velocity with a magnitude, or clamp it.

                  if (isBouncing) {
                    velocity = -velocity * bounceFactor;
                    position = to;
                  }
                }

                const springForce = -config.tension * 0.000001 * (position - to);
                const dampingForce = -config.friction * 0.001 * velocity;
                const acceleration = (springForce + dampingForce) / config.mass; // pt/ms^2

                velocity = velocity + acceleration * step; // pt/ms

                position = position + velocity * step;
              }
            }

        node.lastVelocity = velocity;

        if (Number.isNaN(position)) {
          console.warn("Got NaN while animating:", this);
          finished = true;
        }
      } // Parent springs must finish before their children can.


      if (payload && !payload[i].done) {
        finished = false;
      }

      if (finished) {
        node.done = true;
      } else {
        idle = false;
      }

      if (node.setValue(position, config.round)) {
        changed = true;
      }
    });

    if (idle) {
      this.finish();
    } else if (changed) {
      this._onChange(this.get());
    }

    return idle;
  }
  /** Check the current phase */


  is(phase) {
    return this._phase == phase;
  }
  /** Set the current value, while stopping the current animation */


  set(value) {
    batchedUpdates(() => {
      this._focus(value);

      if (this._set(value)) {
        // Ensure change observers are notified. When active,
        // the "_stop" method handles this.
        if (!this.is(ACTIVE)) {
          return this._onChange(this.get(), true);
        }
      }

      this._stop();
    });
    return this;
  }
  /**
   * Freeze the active animation in time.
   * This does nothing when not animating.
   */


  pause() {
    checkDisposed(this, 'pause');

    if (!this.is(PAUSED)) {
      this._phase = PAUSED;
      flush(this._state.pauseQueue, onPause => onPause());
    }
  }
  /** Resume the animation if paused. */


  resume() {
    checkDisposed(this, 'resume');

    if (this.is(PAUSED)) {
      this._start();

      flush(this._state.resumeQueue, onResume => onResume());
    }
  }
  /**
   * Skip to the end of the current animation.
   *
   * All `onRest` callbacks are passed `{finished: true}`
   */


  finish(to) {
    this.resume();

    if (this.is(ACTIVE)) {
      const anim = this.animation; // Decay animations have an implicit goal.

      if (!anim.config.decay && is.und(to)) {
        to = anim.to;
      } // Set the value if we can.


      if (!is.und(to)) {
        this._set(to);
      }

      batchedUpdates(() => {
        // Ensure the "onStart" and "onRest" props are called.
        if (!anim.changed) {
          anim.changed = true;

          if (anim.onStart) {
            anim.onStart(this);
          }
        } // Exit the frameloop.


        this._stop();
      });
    }

    return this;
  }
  /** Push props into the pending queue. */


  update(props) {
    checkDisposed(this, 'update');
    const queue = this.queue || (this.queue = []);
    queue.push(props);
    return this;
  }
  /**
   * Update this value's animation using the queue of pending props,
   * and unpause the current animation (if one is frozen).
   *
   * When arguments are passed, a new animation is created, and the
   * queued animations are left alone.
   */


  async start(to, arg2) {
    checkDisposed(this, 'start');
    let queue;

    if (!is.und(to)) {
      queue = [is.obj(to) ? to : _extends(_extends({}, arg2), {}, {
        to
      })];
    } else {
      queue = this.queue || [];
      this.queue = [];
    }

    const results = await Promise.all(queue.map(props => this._update(props)));
    return getCombinedResult(this, results);
  }
  /**
   * Stop the current animation, and cancel any delayed updates.
   *
   * Pass `true` to call `onRest` with `cancelled: true`.
   */


  stop(cancel) {
    if (!this.is(DISPOSED)) {
      cancelAsync(this._state, this._lastCallId); // Ensure the `to` value equals the current value.

      this._focus(this.get()); // Exit the frameloop and notify `onRest` listeners.


      batchedUpdates(() => this._stop(cancel));
    }

    return this;
  }
  /** Restart the animation. */


  reset() {
    this._update({
      reset: true
    });
  }
  /** Prevent future animations, and stop the current animation */


  dispose() {
    if (!this.is(DISPOSED)) {
      if (this.animation) {
        // Prevent "onRest" calls when disposed.
        this.animation.onRest = [];
      }

      this.stop();
      this._phase = DISPOSED;
    }
  }
  /** @internal */


  onParentChange(event) {
    super.onParentChange(event);

    if (event.type == 'change') {
      if (!this.is(ACTIVE)) {
        this._reset();

        if (!this.is(PAUSED)) {
          this._start();
        }
      }
    } else if (event.type == 'priority') {
      this.priority = event.priority + 1;
    }
  }
  /**
   * Parse the `to` and `from` range from the given `props` object.
   *
   * This also ensures the initial value is available to animated components
   * during the render phase.
   */


  _prepareNode({
    to,
    from,
    reverse
  }) {
    const key = this.key || '';
    to = !is.obj(to) || getFluidConfig(to) ? to : to[key];
    from = !is.obj(from) || getFluidConfig(from) ? from : from[key]; // Create the range now to avoid "reverse" logic.

    const range = {
      to,
      from
    }; // Before ever animating, this method ensures an `Animated` node
    // exists and keeps its value in sync with the "from" prop.

    if (this.is(CREATED)) {
      if (reverse) [to, from] = [from, to];
      from = getFluidValue(from);

      const node = this._updateNode(is.und(from) ? getFluidValue(to) : from);

      if (node && !is.und(from)) {
        node.setValue(from);
      }
    }

    return range;
  }
  /**
   * Create an `Animated` node if none exists or the given value has an
   * incompatible type. Do nothing if `value` is undefined.
   *
   * The newest `Animated` node is returned.
   */


  _updateNode(value) {
    let node = getAnimated(this);

    if (!is.und(value)) {
      const nodeType = this._getNodeType(value);

      if (!node || node.constructor !== nodeType) {
        setAnimated(this, node = nodeType.create(value));
      }
    }

    return node;
  }
  /** Return the `Animated` node constructor for a given value */


  _getNodeType(value) {
    const parentNode = getAnimated(value);
    return parentNode ? parentNode.constructor : is.arr(value) ? AnimatedArray : isAnimatedString(value) ? AnimatedString : AnimatedValue;
  }
  /** Schedule an animation to run after an optional delay */


  _update(props, isLoop) {
    const defaultProps = this._defaultProps;

    const mergeDefaultProp = key => {
      const value = getDefaultProp(props, key);

      if (!is.und(value)) {
        defaultProps[key] = value;
      } // For `cancel` and `pause`, a truthy default always wins.


      if (defaultProps[key]) {
        props[key] = defaultProps[key];
      }
    }; // These props are coerced into booleans by the `scheduleProps` function,
    // so they need their default values processed before then.


    mergeDefaultProp('cancel');
    mergeDefaultProp('pause'); // Ensure the initial value can be accessed by animated components.

    const range = this._prepareNode(props);

    return scheduleProps(++this._lastCallId, {
      key: this.key,
      props,
      state: this._state,
      actions: {
        pause: this.pause.bind(this),
        resume: this.resume.bind(this),
        start: this._merge.bind(this, range)
      }
    }).then(result => {
      if (props.loop && result.finished && !(isLoop && result.noop)) {
        const nextProps = createLoopUpdate(props);

        if (nextProps) {
          return this._update(nextProps, true);
        }
      }

      return result;
    });
  }
  /** Merge props into the current animation */


  _merge(range, props, resolve) {
    // The "cancel" prop cancels all pending delays and it forces the
    // active animation to stop where it is.
    if (props.cancel) {
      this.stop(true);
      return resolve(getCancelledResult(this));
    }

    const {
      key,
      animation: anim
    } = this;
    const defaultProps = this._defaultProps;
    /** The "to" prop is defined. */

    const hasToProp = !is.und(range.to);
    /** The "from" prop is defined. */

    const hasFromProp = !is.und(range.from); // Avoid merging other props if implicitly prevented, except
    // when both the "to" and "from" props are undefined.

    if (hasToProp || hasFromProp) {
      if (props.callId > this._lastToId) {
        this._lastToId = props.callId;
      } else {
        return resolve(getCancelledResult(this));
      }
    }
    /** Get the value of a prop, or its default value */


    const get = prop => !is.und(props[prop]) ? props[prop] : defaultProps[prop]; // Call "onDelayEnd" before merging props, but after cancellation checks.


    const onDelayEnd = coerceEventProp(get('onDelayEnd'), key);

    if (onDelayEnd) {
      onDelayEnd(props, this);
    }

    if (props.default) {
      mergeDefaultProps(defaultProps, props, ['pause', 'cancel']);
    }

    const {
      to: prevTo,
      from: prevFrom
    } = anim;
    let {
      to = prevTo,
      from = prevFrom
    } = range; // Focus the "from" value if changing without a "to" value.

    if (hasFromProp && !hasToProp) {
      to = from;
    } // Flip the current range if "reverse" is true.


    if (props.reverse) [to, from] = [from, to];
    /** The "from" value is changing. */

    const hasFromChanged = !isEqual(from, prevFrom);

    if (hasFromChanged) {
      anim.from = from;
    }
    /** The "to" value is changing. */


    const hasToChanged = !isEqual(to, prevTo);

    if (hasToChanged) {
      this._focus(to);
    } // Both "from" and "to" can use a fluid config (thanks to http://npmjs.org/fluids).


    const toConfig = getFluidConfig(to);
    const fromConfig = getFluidConfig(from);

    if (fromConfig) {
      from = fromConfig.get();
    }
    /** The "to" prop is async. */


    const hasAsyncTo = is.arr(props.to) || is.fun(props.to);
    const {
      config
    } = anim;
    const {
      decay,
      velocity
    } = config; // The "runAsync" function treats the "config" prop as a default,
    // so we must avoid merging it when the "to" prop is async.

    if (props.config && !hasAsyncTo) {
      mergeConfig(config, callProp(props.config, key), // Avoid calling the same "config" prop twice.
      props.config !== defaultProps.config ? callProp(defaultProps.config, key) : void 0);
    } // This instance might not have its Animated node yet. For example,
    // the constructor can be given props without a "to" or "from" value.


    let node = getAnimated(this);

    if (!node || is.und(to)) {
      return resolve(getFinishedResult(this, true));
    }
    /** When true, start at the "from" value. */


    const reset = // When `reset` is undefined, the `from` prop implies `reset: true`,
    // except for declarative updates. When `reset` is defined, there
    // must exist a value to animate from.
    is.und(props.reset) ? hasFromProp && !props.default : !is.und(from) && matchProp(props.reset, key); // The current value, where the animation starts from.

    const value = reset ? from : this.get(); // The animation ends at this value, unless "to" is fluid.

    const goal = computeGoal(to); // Only specific types can be animated to/from.

    const isAnimatable = is.num(goal) || is.arr(goal) || isAnimatedString(goal); // When true, the value changes instantly on the next frame.

    const immediate = !hasAsyncTo && (!isAnimatable || matchProp(defaultProps.immediate || props.immediate, key));

    if (hasToChanged) {
      if (immediate) {
        node = this._updateNode(goal);
      } else {
        const nodeType = this._getNodeType(to);

        if (nodeType !== node.constructor) {
          throw Error("Cannot animate between " + node.constructor.name + " and " + nodeType.name + ", as the \"to\" prop suggests");
        }
      }
    } // The type of Animated node for the goal value.


    const goalType = node.constructor; // When the goal value is fluid, we don't know if its value
    // will change before the next animation frame, so it always
    // starts the animation to be safe.

    let started = !!toConfig;
    let finished = false;

    if (!started) {
      // When true, the current value has probably changed.
      const hasValueChanged = reset || this.is(CREATED) && hasFromChanged; // When the "to" value or current value are changed,
      // start animating if not already finished.

      if (hasToChanged || hasValueChanged) {
        finished = isEqual(computeGoal(value), goal);
        started = !finished;
      } // Changing "decay" or "velocity" starts the animation.


      if (!isEqual(config.decay, decay) || !isEqual(config.velocity, velocity)) {
        started = true;
      }
    } // When an active animation changes its goal to its current value:


    if (finished && this.is(ACTIVE)) {
      // Avoid an abrupt stop unless the animation is being reset.
      if (anim.changed && !reset) {
        started = true;
      } // Stop the animation before its first frame.
      else if (!started) {
          this._stop();
        }
    }

    if (!hasAsyncTo) {
      // Make sure our "toValues" are updated even if our previous
      // "to" prop is a fluid value whose current value is also ours.
      if (started || getFluidConfig(prevTo)) {
        anim.values = node.getPayload();
        anim.toValues = toConfig ? null : goalType == AnimatedString ? [1] : toArray(goal);
      }

      anim.immediate = immediate;
      anim.onStart = coerceEventProp(get('onStart'), key);
      anim.onChange = coerceEventProp(get('onChange'), key); // The "reset" prop tries to reuse the old "onRest" prop,
      // unless you defined a new "onRest" prop.

      const onRestQueue = anim.onRest;
      const onRest = reset && !props.onRest ? onRestQueue[0] || noop : checkFinishedOnRest(coerceEventProp(get('onRest'), key), this); // In most cases, the animation after this one won't reuse our
      // "onRest" prop. Instead, the _default_ "onRest" prop is used
      // when the next animation has an undefined "onRest" prop.

      if (started) {
        anim.onRest = [onRest, checkFinishedOnRest(resolve, this)]; // Flush the "onRest" queue for the previous animation.

        let onRestIndex = reset ? 0 : 1;

        if (onRestIndex < onRestQueue.length) {
          batchedUpdates(() => {
            for (; onRestIndex < onRestQueue.length; onRestIndex++) {
              onRestQueue[onRestIndex]();
            }
          });
        }
      } // The "onRest" prop is always first, and it can be updated even
      // if a new animation is not started by this update.
      else if (reset || props.onRest) {
          anim.onRest[0] = onRest;
        }
    } // By this point, every prop has been merged.


    const onProps = coerceEventProp(get('onProps'), key);

    if (onProps) {
      onProps(props, this);
    } // Update our node even if the animation is idle.


    if (reset) {
      node.setValue(value);
    }

    if (hasAsyncTo) {
      resolve(runAsync(props.to, props, this._state, this));
    } // Start an animation
    else if (started) {
        // Must be idle for "onStart" to be called again.
        if (reset) this._phase = IDLE;

        this._reset();

        this._start();
      } // Postpone promise resolution until the animation is finished,
      // so that no-op updates still resolve at the expected time.
      else if (this.is(ACTIVE) && !hasToChanged) {
          anim.onRest.push(checkFinishedOnRest(resolve, this));
        } // Resolve our promise immediately.
        else {
            resolve(getNoopResult(this, value));
          }
  }
  /** Update the `animation.to` value, which might be a `FluidValue` */


  _focus(value) {
    const anim = this.animation;

    if (value !== anim.to) {
      let config = getFluidConfig(anim.to);

      if (config) {
        config.removeChild(this);
      }

      anim.to = value;
      let priority = 0;

      if (config = getFluidConfig(value)) {
        config.addChild(this);

        if (isFrameValue(value)) {
          priority = (value.priority || 0) + 1;
        }
      }

      this.priority = priority;
    }
  }
  /** Set the current value and our `node` if necessary. The `_onChange` method is *not* called. */


  _set(value) {
    const config = getFluidConfig(value);

    if (config) {
      value = config.get();
    }

    const node = getAnimated(this);
    const oldValue = node && node.getValue();

    if (node) {
      node.setValue(value);
    } else {
      this._updateNode(value);
    }

    return !isEqual(value, oldValue);
  }

  _onChange(value, idle = false) {
    const anim = this.animation; // The "onStart" prop is called on the first change after entering the
    // frameloop, but never for immediate animations.

    if (!anim.changed && !idle) {
      anim.changed = true;

      if (anim.onStart) {
        anim.onStart(this);
      }
    }

    if (anim.onChange) {
      anim.onChange(value, this);
    }

    super._onChange(value, idle);
  }

  _reset() {
    const anim = this.animation; // Reset the state of each Animated node.

    getAnimated(this).reset(anim.to); // Ensure the `onStart` prop will be called.

    if (!this.is(ACTIVE)) {
      anim.changed = false;
    } // Use the current values as the from values.


    if (!anim.immediate) {
      anim.fromValues = anim.values.map(node => node.lastPosition);
    }

    super._reset();
  }

  _start() {
    if (!this.is(ACTIVE)) {
      this._phase = ACTIVE;

      super._start(); // The "skipAnimation" global avoids the frameloop.


      if (skipAnimation) {
        this.finish();
      } else {
        frameLoop.start(this);
      }
    }
  }
  /**
   * Exit the frameloop and notify `onRest` listeners.
   *
   * Always wrap `_stop` calls with `batchedUpdates`.
   */


  _stop(cancel) {
    this.resume();

    if (this.is(ACTIVE)) {
      this._phase = IDLE; // Always let change observers know when a spring becomes idle.

      this._onChange(this.get(), true);

      const anim = this.animation;
      each(anim.values, node => {
        node.done = true;
      });
      const onRestQueue = anim.onRest;

      if (onRestQueue.length) {
        // Preserve the "onRest" prop when the goal is dynamic.
        anim.onRest = [anim.toValues ? noop : onRestQueue[0]]; // Never call the "onRest" prop for no-op animations.

        if (!anim.changed) {
          onRestQueue[0] = noop;
        }

        each(onRestQueue, onRest => onRest(cancel));
      }
    }
  }

}

function checkDisposed(spring, name) {
  if (spring.is(DISPOSED)) {
    throw Error("Cannot call \"" + name + "\" of disposed \"" + spring.constructor.name + "\" object");
  }
}
/** Coerce an event prop to an event handler */


function coerceEventProp(prop, key) {
  return is.fun(prop) ? prop : key && prop ? prop[key] : undefined;
}
/**
 * The "finished" value is determined by each "onRest" handler,
 * based on whether the current value equals the goal value that
 * was calculated at the time the "onRest" handler was set.
 */


const checkFinishedOnRest = (onRest, spring) => {
  const {
    to
  } = spring.animation;
  return onRest ? cancel => {
    if (cancel) {
      onRest(getCancelledResult(spring));
    } else {
      const goal = computeGoal(to);
      const value = computeGoal(spring.get());
      const finished = isEqual(value, goal);
      onRest(getFinishedResult(spring, finished));
    }
  } : noop;
};

function createLoopUpdate(props, loop = props.loop, to = props.to) {
  let loopRet = callProp(loop);

  if (loopRet) {
    const overrides = loopRet !== true && inferTo(loopRet);
    const reverse = (overrides || props).reverse;
    const reset = !overrides || overrides.reset;
    return createUpdate(_extends(_extends({}, props), {}, {
      loop,
      // Avoid updating default props when looping.
      default: false,
      // For the "reverse" prop to loop as expected, the "to" prop
      // must be undefined. The "reverse" prop is ignored when the
      // "to" prop is an array or function.
      to: !reverse || is.arr(to) || is.fun(to) ? to : undefined,
      // Avoid defining the "from" prop if a reset is unwanted.
      from: reset ? props.from : undefined,
      reset
    }, overrides));
  }
}
/**
 * Return a new object based on the given `props`.
 *
 * - All unreserved props are moved into the `to` prop object.
 * - The `to` and `from` props are deleted when falsy.
 * - The `keys` prop is set to an array of affected keys,
 *   or `null` if all keys are affected.
 */

function createUpdate(props) {
  const {
    to,
    from
  } = props = inferTo(props); // Collect the keys affected by this update.

  const keys = new Set();

  if (from) {
    findDefined(from, keys);
  } else {
    // Falsy values are deleted to avoid merging issues.
    delete props.from;
  }

  if (is.obj(to)) {
    findDefined(to, keys);
  } else if (!to) {
    // Falsy values are deleted to avoid merging issues.
    delete props.to;
  } // The "keys" prop helps in applying updates to affected keys only.


  props.keys = keys.size ? Array.from(keys) : null;
  return props;
}
/**
 * A modified version of `createUpdate` meant for declarative APIs.
 */

function declareUpdate(props) {
  const update = createUpdate(props);

  if (is.und(update.default)) {
    update.default = getDefaultProps(update, [// Avoid forcing `immediate: true` onto imperative updates.
    update.immediate === true && 'immediate']);
  }

  return update;
}
/** Find keys with defined values */

function findDefined(values, keys) {
  each(values, (value, key) => value != null && keys.add(key));
}

/** Events batched by the `Controller` class */
const BATCHED_EVENTS = ['onStart', 'onChange', 'onRest'];
let nextId$1 = 1;
/** Queue of pending updates for a `Controller` instance. */

class Controller {
  /** The animated values */

  /** The queue of props passed to the `update` method. */

  /** Custom handler for flushing update queues */

  /** These props are used by all future spring values */

  /** The combined phase of our spring values */

  /** The counter for tracking `scheduleProps` calls */

  /** The values currently being animated */

  /** State used by the `runAsync` function */

  /** The event queues that are flushed once per frame maximum */
  constructor(props, flush) {
    this.id = nextId$1++;
    this.springs = {};
    this.queue = [];
    this._flush = void 0;
    this._initialProps = void 0;
    this._phase = CREATED;
    this._lastAsyncId = 0;
    this._active = new Set();
    this._state = {
      pauseQueue: new Set(),
      resumeQueue: new Set()
    };
    this._events = {
      onStart: new Set(),
      onChange: new Set(),
      onRest: new Map()
    };
    this._onFrame = this._onFrame.bind(this);

    if (flush) {
      this._flush = flush;
    }

    if (props) {
      this.start(props);
    }
  }
  /**
   * Equals `true` when no spring values are in the frameloop, and
   * no async animation is currently active.
   */


  get idle() {
    return !this._state.asyncTo && Object.values(this.springs).every(spring => spring.idle);
  }
  /** Check the current phase */


  is(phase) {
    return this._phase == phase;
  }
  /** Get the current values of our springs */


  get() {
    const values = {};
    this.each((spring, key) => values[key] = spring.get());
    return values;
  }
  /** Push an update onto the queue of each value. */


  update(props) {
    if (props) this.queue.push(createUpdate(props));
    return this;
  }
  /**
   * Start the queued animations for every spring, and resolve the returned
   * promise once all queued animations have finished or been cancelled.
   *
   * When you pass a queue (instead of nothing), that queue is used instead of
   * the queued animations added with the `update` method, which are left alone.
   */


  start(props) {
    const queue = props ? toArray(props).map(createUpdate) : this.queue;

    if (!props) {
      this.queue = [];
    }

    if (this._flush) {
      return this._flush(this, queue);
    }

    prepareKeys(this, queue);
    return flushUpdateQueue(this, queue);
  }
  /** Stop one animation, some animations, or all animations */


  stop(keys) {
    if (is.und(keys)) {
      this.each(spring => spring.stop());
      cancelAsync(this._state, this._lastAsyncId);
    } else {
      const springs = this.springs;
      each(toArray(keys), key => springs[key].stop());
    }

    return this;
  }
  /** Freeze the active animation in time */


  pause(keys) {
    if (is.und(keys)) {
      this.each(spring => spring.pause());
    } else {
      const springs = this.springs;
      each(toArray(keys), key => springs[key].pause());
    }

    return this;
  }
  /** Resume the animation if paused. */


  resume(keys) {
    if (is.und(keys)) {
      this.each(spring => spring.resume());
    } else {
      const springs = this.springs;
      each(toArray(keys), key => springs[key].resume());
    }

    return this;
  }
  /** Restart every animation. */


  reset() {
    this.each(spring => spring.reset()); // TODO: restart async "to" prop

    return this;
  }
  /** Call a function once per spring value */


  each(iterator) {
    each(this.springs, iterator);
  }
  /** Destroy every spring in this controller */


  dispose() {
    this._state.asyncTo = undefined;
    this.each(spring => spring.dispose());
    this.springs = {};
  }
  /** @internal Called at the end of every animation frame */


  _onFrame() {
    const {
      onStart,
      onChange,
      onRest
    } = this._events;
    const isActive = this._active.size > 0;

    if (isActive && this._phase != ACTIVE) {
      this._phase = ACTIVE;
      flush(onStart, onStart => onStart(this));
    }

    const values = (onChange.size || !isActive && onRest.size) && this.get();
    flush(onChange, onChange => onChange(values)); // The "onRest" queue is only flushed when all springs are idle.

    if (!isActive) {
      this._phase = IDLE;
      flush(onRest, ([onRest, result]) => {
        result.value = values;
        onRest(result);
      });
    }
  }
  /** @internal */


  onParentChange(event) {
    if (event.type == 'change') {
      this._active[event.idle ? 'delete' : 'add'](event.parent);

      frameLoop.onFrame(this._onFrame);
    }
  }

}
/**
 * Warning: Props might be mutated.
 */

function flushUpdateQueue(ctrl, queue) {
  return Promise.all(queue.map(props => flushUpdate(ctrl, props))).then(results => getCombinedResult(ctrl, results));
}
/**
 * Warning: Props might be mutated.
 *
 * Process a single set of props using the given controller.
 *
 * The returned promise resolves to `true` once the update is
 * applied and any animations it starts are finished without being
 * stopped or cancelled.
 */

function flushUpdate(ctrl, props, isLoop) {
  const {
    to,
    loop,
    onRest
  } = props; // Looping must be handled in this function, or else the values
  // would end up looping out-of-sync in many common cases.

  if (loop) {
    props.loop = false;
  }

  const asyncTo = is.arr(to) || is.fun(to) ? to : undefined;

  if (asyncTo) {
    props.to = undefined;
    props.onRest = undefined;
  } else {
    // For certain events, use batching to prevent multiple calls per frame.
    // However, batching is avoided when the `to` prop is async, because any
    // event props are used as default props instead.
    each(BATCHED_EVENTS, key => {
      const handler = props[key];

      if (is.fun(handler)) {
        const queue = ctrl['_events'][key];

        if (queue instanceof Set) {
          props[key] = () => queue.add(handler);
        } else {
          props[key] = ({
            finished,
            cancelled
          }) => {
            const result = queue.get(handler);

            if (result) {
              if (!finished) result.finished = false;
              if (cancelled) result.cancelled = true;
            } else {
              // The "value" is set before the "handler" is called.
              queue.set(handler, {
                value: null,
                finished,
                cancelled
              });
            }
          };
        }
      }
    });
  }

  const keys = props.keys || Object.keys(ctrl.springs);
  const promises = keys.map(key => ctrl.springs[key].start(props)); // Schedule the "asyncTo" if defined.

  const state = ctrl['_state'];

  if (asyncTo) {
    promises.push(scheduleProps(++ctrl['_lastAsyncId'], {
      props,
      state,
      actions: {
        pause: noop,
        resume: noop,

        start(props, resolve) {
          props.onRest = onRest;

          if (!props.cancel) {
            resolve(runAsync(asyncTo, props, state, ctrl));
          } // Prevent `cancel: true` from ending the current `runAsync` call,
          // except when the default `cancel` prop is being set.
          else if (hasDefaultProp(props, 'cancel')) {
              cancelAsync(state, props.callId);
            }
        }

      }
    }));
  } // Respect the `cancel` prop when no keys are affected.
  else if (!props.keys && props.cancel === true) {
      cancelAsync(state, ctrl['_lastAsyncId']);
    }

  return Promise.all(promises).then(results => {
    const result = getCombinedResult(ctrl, results);

    if (loop && result.finished && !(isLoop && result.noop)) {
      const nextProps = createLoopUpdate(props, loop, to);

      if (nextProps) {
        prepareKeys(ctrl, [nextProps]);
        return flushUpdate(ctrl, nextProps, true);
      }
    }

    return result;
  });
}
/**
 * From an array of updates, get the map of `SpringValue` objects
 * by their keys. Springs are created when any update wants to
 * animate a new key.
 *
 * Springs created by `getSprings` are neither cached nor observed
 * until they're given to `setSprings`.
 */

function getSprings(ctrl, props) {
  const springs = _extends({}, ctrl.springs);

  if (props) {
    each(toArray(props), props => {
      if (is.und(props.keys)) {
        props = createUpdate(props);
      }

      if (!is.obj(props.to)) {
        // Avoid passing array/function to each spring.
        props = _extends(_extends({}, props), {}, {
          to: undefined
        });
      }

      prepareSprings(springs, props, key => {
        return createSpring(key);
      });
    });
  }

  return springs;
}
/**
 * Tell a controller to manage the given `SpringValue` objects
 * whose key is not already in use.
 */

function setSprings(ctrl, springs) {
  each(springs, (spring, key) => {
    if (!ctrl.springs[key]) {
      ctrl.springs[key] = spring;
      spring.addChild(ctrl);
    }
  });
}

function createSpring(key, observer) {
  const spring = new SpringValue();
  spring.key = key;

  if (observer) {
    spring.addChild(observer);
  }

  return spring;
}
/**
 * Ensure spring objects exist for each defined key.
 *
 * Using the `props`, the `Animated` node of each `SpringValue` may
 * be created or updated.
 */


function prepareSprings(springs, props, create) {
  if (props.keys) {
    each(props.keys, key => {
      const spring = springs[key] || (springs[key] = create(key));
      spring['_prepareNode'](props);
    });
  }
}
/**
 * Ensure spring objects exist for each defined key, and attach the
 * `ctrl` to them for observation.
 *
 * The queue is expected to contain `createUpdate` results.
 */


function prepareKeys(ctrl, queue) {
  each(queue, props => {
    prepareSprings(ctrl.springs, props, key => {
      return createSpring(key, ctrl);
    });
  });
}

/**
 * This context affects all new and existing `SpringValue` objects
 * created with the hook API or the renderprops API.
 */

const ctx = createContext({});
const SpringContext = (_ref) => {
  let {
    children
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["children"]);

  const inherited = useContext(ctx); // Memoize the context to avoid unwanted renders.

  props = useMemo(() => _extends(_extends({}, inherited), props), [inherited, props.pause, props.cancel, props.immediate, props.config]);
  const {
    Provider
  } = ctx;
  return /*#__PURE__*/createElement(Provider, {
    value: props
  }, children);
};
SpringContext.Provider = ctx.Provider;
SpringContext.Consumer = ctx.Consumer;
/** Get the current values of nearest `SpringContext` component. */

const useSpringContext = () => useContext(ctx);

/** Create an imperative API for manipulating an array of `Controller` objects. */
const SpringHandle = {
  create: getControllers => ({
    get controllers() {
      return getControllers();
    },

    update(props) {
      each(getControllers(), (ctrl, i) => {
        ctrl.update(getProps(props, i, ctrl));
      });
      return this;
    },

    async start(props) {
      const results = await Promise.all(getControllers().map((ctrl, i) => {
        const update = getProps(props, i, ctrl);
        return ctrl.start(update);
      }));
      return {
        value: results.map(result => result.value),
        finished: results.every(result => result.finished)
      };
    },

    stop: keys => each(getControllers(), ctrl => ctrl.stop(keys)),
    pause: keys => each(getControllers(), ctrl => ctrl.pause(keys)),
    resume: keys => each(getControllers(), ctrl => ctrl.resume(keys))
  })
};

/** @internal */
function useSprings(length, props, deps) {
  const propsFn = is.fun(props) && props;
  if (propsFn && !deps) deps = [];
  // Set to 0 to prevent sync flush.
  const layoutId = useRef(0);
  const forceUpdate = useForceUpdate(); // State is updated on commit.

  const [state] = useState(() => ({
    ctrls: [],
    queue: [],

    flush(ctrl, updates) {
      const springs = getSprings(ctrl, updates); // Flushing is postponed until the component's commit phase
      // if a spring was created since the last commit.

      const canFlushSync = layoutId.current > 0 && !state.queue.length && !Object.keys(springs).some(key => !ctrl.springs[key]);
      return canFlushSync ? flushUpdateQueue(ctrl, updates) : new Promise(resolve => {
        setSprings(ctrl, springs);
        state.queue.push(() => {
          resolve(flushUpdateQueue(ctrl, updates));
        });
        forceUpdate();
      });
    }

  })); // The imperative API ref from the props of the first controller.

  const refProp = useRef();
  const ctrls = [...state.ctrls];
  const updates = []; // Cache old controllers to dispose in the commit phase.

  const prevLength = usePrev(length) || 0;
  const disposed = ctrls.slice(length, prevLength); // Create new controllers when "length" increases, and destroy
  // the affected controllers when "length" decreases.

  useMemo(() => {
    ctrls.length = length;
    declareUpdates(prevLength, length);
  }, [length]); // Update existing controllers when "deps" are changed.

  useMemo(() => {
    declareUpdates(0, Math.min(prevLength, length));
  }, deps);
  /** Fill the `updates` array with declarative updates for the given index range. */

  function declareUpdates(startIndex, endIndex) {
    for (let i = startIndex; i < endIndex; i++) {
      const ctrl = ctrls[i] || (ctrls[i] = new Controller(null, state.flush));
      let update = propsFn ? propsFn(i, ctrl) : props[i];

      if (update) {
        update = updates[i] = declareUpdate(update);

        if (i == 0) {
          refProp.current = update.ref;
          update.ref = undefined;
        }
      }
    }
  }

  const api = useMemo$1(() => {
    return SpringHandle.create(() => state.ctrls);
  }, []); // New springs are created during render so users can pass them to
  // their animated components, but new springs aren't cached until the
  // commit phase (see the `useLayoutEffect` callback below).

  const springs = ctrls.map((ctrl, i) => getSprings(ctrl, updates[i]));
  const context = useSpringContext();
  useLayoutEffect(() => {
    layoutId.current++; // Replace the cached controllers.

    state.ctrls = ctrls; // Update the ref prop.

    if (refProp.current) {
      refProp.current.current = api;
    } // Flush the commit queue.


    const {
      queue
    } = state;

    if (queue.length) {
      state.queue = [];
      each(queue, cb => cb());
    } // Dispose unused controllers.


    each(disposed, ctrl => ctrl.dispose()); // Update existing controllers.

    each(ctrls, (ctrl, i) => {
      const values = springs[i];
      setSprings(ctrl, values); // Update the default props.

      ctrl.start({
        default: context
      }); // Apply updates created during render.

      const update = updates[i];

      if (update) {
        // Start animating unless a ref exists.
        if (refProp.current) {
          ctrl.queue.push(update);
        } else {
          ctrl.start(update);
        }
      }
    });
  }); // Dispose all controllers on unmount.

  useOnce(() => () => {
    each(state.ctrls, ctrl => ctrl.dispose());
  }); // Return a deep copy of the `springs` array so the caller can
  // safely mutate it during render.

  const values = springs.map(x => _extends({}, x));
  return propsFn || arguments.length == 3 ? [values, api.start, api.stop] : values;
}

/**
 * The props that `useSpring` recognizes.
 */

/** @internal */
function useSpring(props, deps) {
  const isFn = is.fun(props);
  const [[values], update, stop] = useSprings(1, isFn ? props : [props], isFn ? deps || [] : deps);
  return isFn || arguments.length == 2 ? [values, update, stop] : values;
}

function useTrail(length, propsArg, deps) {
  const propsFn = is.fun(propsArg) && propsArg;
  if (propsFn && !deps) deps = [];
  const ctrls = [];
  const result = useSprings(length, (i, ctrl) => {
    ctrls[i] = ctrl;
    return getProps(propsArg, i, ctrl);
  }, // Ensure the props function is called when no deps exist.
  // This works around the 3 argument rule.
  deps || [{}]);
  useLayoutEffect(() => {
    const reverse = is.obj(propsArg) && propsArg.reverse;

    for (let i = 0; i < ctrls.length; i++) {
      const parent = ctrls[i + (reverse ? 1 : -1)];
      if (parent) ctrls[i].update({
        to: parent.springs
      }).start();
    }
  }, deps);

  if (propsFn || arguments.length == 3) {
    const update = result[1];
    result[1] = useCallbackOne(propsArg => {
      const reverse = is.obj(propsArg) && propsArg.reverse;
      return update((i, ctrl) => {
        const props = getProps(propsArg, i, ctrl);
        const parent = ctrls[i + (reverse ? 1 : -1)];
        if (parent) props.to = parent.springs;
        return props;
      });
    }, deps);
    return result;
  }

  return result[0];
}

// TODO: convert to "const enum" once Babel supports it

/** This transition is being mounted */
const MOUNT = 'mount';
/** This transition is entering or has entered */

const ENTER = 'enter';
/** This transition had its animations updated */

const UPDATE = 'update';
/** This transition will expire after animating */

const LEAVE = 'leave';

function useTransition(data, props, deps) {
  const {
    ref,
    reset,
    sort,
    trail = 0,
    expires = true
  } = props; // Every item has its own transition.

  const items = toArray(data);
  const transitions = []; // Keys help with reusing transitions between renders.
  // The `key` prop can be undefined (which means the items themselves are used
  // as keys), or a function (which maps each item to its key), or an array of
  // keys (which are assigned to each item by index).

  const keys = getKeys(items, props); // The "onRest" callbacks need a ref to the latest transitions.

  const usedTransitions = useRef(null);
  const prevTransitions = reset ? null : usedTransitions.current;
  useLayoutEffect(() => {
    usedTransitions.current = transitions;
  }); // Destroy all transitions on dismount.

  useOnce(() => () => each(usedTransitions.current, t => {
    if (t.expired) {
      clearTimeout(t.expirationId);
    }

    t.ctrl.dispose();
  })); // Map old indices to new indices.

  const reused = [];
  if (prevTransitions) each(prevTransitions, (t, i) => {
    // Expired transitions are not rendered.
    if (t.expired) {
      clearTimeout(t.expirationId);
    } else {
      i = reused[i] = keys.indexOf(t.key);
      if (~i) transitions[i] = t;
    }
  }); // Mount new items with fresh transitions.

  each(items, (item, i) => {
    transitions[i] || (transitions[i] = {
      key: keys[i],
      item,
      phase: MOUNT,
      ctrl: new Controller()
    });
  }); // Update the item of any transition whose key still exists,
  // and ensure leaving transitions are rendered until they finish.

  if (reused.length) {
    let i = -1;
    each(reused, (keyIndex, prevIndex) => {
      const t = prevTransitions[prevIndex];

      if (~keyIndex) {
        i = transitions.indexOf(t);
        transitions[i] = _extends(_extends({}, t), {}, {
          item: items[keyIndex]
        });
      } else if (props.leave) {
        transitions.splice(++i, 0, t);
      }
    });
  }

  if (is.fun(sort)) {
    transitions.sort((a, b) => sort(a.item, b.item));
  } // Track cumulative delay for the "trail" prop.


  let delay = -trail; // Expired transitions use this to dismount.

  const forceUpdate = useForceUpdate(); // These props are inherited by every phase change.

  const defaultProps = getDefaultProps(props); // Generate changes to apply in useEffect.

  const changes = new Map();
  each(transitions, (t, i) => {
    const key = t.key;
    const prevPhase = t.phase;
    let to;
    let phase;

    if (prevPhase == MOUNT) {
      to = props.enter;
      phase = ENTER;
    } else {
      const isLeave = keys.indexOf(key) < 0;

      if (prevPhase != LEAVE) {
        if (isLeave) {
          to = props.leave;
          phase = LEAVE;
        } else if (to = props.update) {
          phase = UPDATE;
        } else return;
      } else if (!isLeave) {
        to = props.enter;
        phase = ENTER;
      } else return;
    } // When "to" is a function, it can return (1) an array of "useSpring" props,
    // (2) an async function, or (3) an object with any "useSpring" props.


    to = callProp(to, t.item, i);
    to = is.obj(to) ? inferTo(to) : {
      to
    };

    if (!to.config) {
      const config = props.config || defaultProps.config;
      to.config = callProp(config, t.item, i);
    } // The payload is used to update the spring props once the current render is committed.


    const payload = _extends(_extends({}, defaultProps), {}, {
      delay: delay += trail,
      // This prevents implied resets.
      reset: false
    }, to);

    if (phase == ENTER && is.und(payload.from)) {
      // The `initial` prop is used on the first render of our parent component,
      // as well as when `reset: true` is passed. It overrides the `from` prop
      // when defined, and it makes `enter` instant when null.
      const from = is.und(props.initial) || prevTransitions ? props.from : props.initial;
      payload.from = callProp(from, t.item, i);
    }

    const {
      onRest
    } = payload;

    payload.onRest = result => {
      const transitions = usedTransitions.current;
      const t = transitions.find(t => t.key === key);
      if (!t) return;

      if (is.fun(onRest)) {
        onRest(result, t);
      } // Reset the phase of a cancelled enter/leave transition, so it can
      // retry the animation on the next render.


      if (result.cancelled && t.phase != UPDATE) {
        t.phase = prevPhase;
        return;
      }

      if (t.ctrl.idle) {
        const idle = transitions.every(t => t.ctrl.idle);

        if (t.phase == LEAVE) {
          const expiry = callProp(expires, t.item);

          if (expiry !== false) {
            const expiryMs = expiry === true ? 0 : expiry;
            t.expired = true; // Force update once the expiration delay ends.

            if (!idle && expiryMs > 0) {
              // The maximum timeout is 2^31-1
              if (expiryMs <= 0x7fffffff) t.expirationId = setTimeout(forceUpdate, expiryMs);
              return;
            }
          }
        } // Force update once idle and expired items exist.


        if (idle && transitions.some(t => t.expired)) {
          forceUpdate();
        }
      }
    };

    const springs = getSprings(t.ctrl, payload);
    changes.set(t, {
      phase,
      springs,
      payload
    });
  }); // The prop overrides from an ancestor.

  const context = useSpringContext(); // Merge the context into each transition.

  useLayoutEffect(() => {
    each(transitions, t => {
      t.ctrl.start({
        default: context
      });
    });
  }, [context]);
  const api = useMemo$1(() => {
    return SpringHandle.create(() => {
      return usedTransitions.current.map(t => t.ctrl);
    });
  }, []);
  useImperativeHandle(ref, () => api);
  useLayoutEffect(() => {
    each(changes, ({
      phase,
      springs,
      payload
    }, t) => {
      setSprings(t.ctrl, springs);

      if (!context.cancel) {
        t.phase = phase;

        if (phase == ENTER) {
          t.ctrl.start({
            default: context
          });
        }

        t.ctrl[ref ? 'update' : 'start'](payload);
      }
    });
  }, reset ? void 0 : deps);

  const renderTransitions = render => /*#__PURE__*/createElement(Fragment, null, transitions.map((t, i) => {
    const {
      springs
    } = changes.get(t) || t.ctrl;
    const elem = render(_extends({}, springs), t.item, t, i);
    return elem && elem.type ? /*#__PURE__*/createElement(elem.type, _extends({}, elem.props, {
      key: is.str(t.key) || is.num(t.key) ? t.key : t.ctrl.id,
      ref: elem.ref
    })) : elem;
  }));

  return arguments.length == 3 ? [renderTransitions, api.start, api.stop] : renderTransitions;
}

function getKeys(items, {
  key,
  keys = key
}) {
  return is.und(keys) ? items : is.fun(keys) ? items.map(keys) : toArray(keys);
}

/**
 * The `Spring` component passes `SpringValue` objects to your render prop.
 */
function Spring(_ref) {
  let {
    children
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["children"]);

  return children(useSpring(props));
}

function Trail(_ref) {
  let {
    items,
    children
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["items", "children"]);

  const trails = useTrail(items.length, props);
  return items.map((item, index) => {
    const result = children(item, index);
    return is.fun(result) ? result(trails[index]) : result;
  });
}

function Transition(_ref) {
  let {
    items,
    children
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["items", "children"]);

  return /*#__PURE__*/createElement(Fragment, null, useTransition(items, props)(children));
}

/**
 * An `Interpolation` is a memoized value that's computed whenever one of its
 * `FluidValue` dependencies has its value changed.
 *
 * Other `FrameValue` objects can depend on this. For example, passing an
 * `Interpolation` as the `to` prop of a `useSpring` call will trigger an
 * animation toward the memoized value.
 */

class Interpolation extends FrameValue {
  /** Useful for debugging. */

  /** Equals false when in the frameloop */

  /** The function that maps inputs values to output */
  constructor(source, args) {
    super();
    this.source = source;
    this.key = void 0;
    this.idle = true;
    this.calc = void 0;
    this.calc = createInterpolator(...args);

    const value = this._get();

    const nodeType = is.arr(value) ? AnimatedArray : AnimatedValue; // Assume the computed value never changes type.

    setAnimated(this, nodeType.create(value));
  }

  advance(_dt) {
    const value = this._get();

    const oldValue = this.get();

    if (!isEqual(value, oldValue)) {
      getAnimated(this).setValue(value);

      this._onChange(value, this.idle);
    }
  }

  _get() {
    const inputs = is.arr(this.source) ? this.source.map(node => node.get()) : toArray(this.source.get());
    return this.calc(...inputs);
  }

  _reset() {
    each(getPayload(this), node => node.reset());

    super._reset();
  }

  _start() {
    this.idle = false;

    super._start();

    if (skipAnimation) {
      this.idle = true;
      this.advance();
    } else {
      frameLoop.start(this);
    }
  }

  _attach() {
    // Start observing our "source" once we have an observer.
    let idle = true;
    let priority = 1;
    each(toArray(this.source), source => {
      if (isFrameValue(source)) {
        if (!source.idle) idle = false;
        priority = Math.max(priority, source.priority + 1);
      }

      source.addChild(this);
    });
    this.priority = priority;

    if (!idle) {
      this._reset();

      this._start();
    }
  }

  _detach() {
    // Stop observing our "source" once we have no observers.
    each(toArray(this.source), source => {
      source.removeChild(this);
    }); // This removes us from the frameloop.

    this.idle = true;
  }
  /** @internal */


  onParentChange(event) {
    // Ensure our start value respects our parent values, in case
    // any of their animations were restarted with the "reset" prop.
    if (event.type == 'start') {
      this.advance();
    } // Change events are useful for (1) reacting to non-animated parents
    // and (2) reacting to the last change in a parent animation.
    else if (event.type == 'change') {
        // If we're idle, we know for sure that this change is *not*
        // caused by an animation.
        if (this.idle) {
          this.advance();
        } // Leave the frameloop when all parents are done animating.
        else if (event.idle) {
            this.idle = toArray(this.source).every(source => source.idle !== false);

            if (this.idle) {
              this.advance();
              each(getPayload(this), node => {
                node.done = true;
              });
            }
          }
      } // Ensure our priority is greater than all parents, which means
      // our value won't be updated until our parents have updated.
      else if (event.type == 'priority') {
          this.priority = toArray(this.source).reduce((max, source) => Math.max(max, (source.priority || 0) + 1), 0);
        }

    super.onParentChange(event);
  }

}

/** Map the value of one or more dependencies */

const to = (source, ...args) => new Interpolation(source, args);
/** @deprecated Use the `to` export instead */

const interpolate = (source, ...args) => (deprecateInterpolate(), new Interpolation(source, args));
/** Extract the raw value types that are being interpolated */

Globals.assign({
  createStringInterpolator: createStringInterpolator$1,
  to: (source, args) => new Interpolation(source, args)
});
/** Advance all animations forward one frame */

const update = () => Globals.frameLoop.advance();

export { BailSignal, Controller, FrameValue, Interpolation, Spring, SpringContext, SpringHandle, SpringValue, Trail, Transition, config, inferTo, interpolate, to, update, useChain, useSpring, useSprings, useTrail, useTransition };
//# sourceMappingURL=index.js.map
