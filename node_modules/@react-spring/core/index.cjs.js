'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var reactLayoutEffect = require('react-layout-effect');
var shared = require('@react-spring/shared');
var _extends = _interopDefault(require('@babel/runtime/helpers/extends'));
var React = require('react');
var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/asyncToGenerator'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
var _inheritsLoose = _interopDefault(require('@babel/runtime/helpers/inheritsLoose'));
var animated = require('@react-spring/animated/index.cjs.js');
var G = require('@react-spring/shared/globals');
var useMemoOne = require('use-memo-one');
var _wrapNativeSuper = _interopDefault(require('@babel/runtime/helpers/wrapNativeSuper'));
var deprecations = require('@react-spring/shared/deprecations');
var _objectWithoutPropertiesLoose = _interopDefault(require('@babel/runtime/helpers/objectWithoutPropertiesLoose'));
var _assertThisInitialized = _interopDefault(require('@babel/runtime/helpers/assertThisInitialized'));
var stringInterpolation = require('@react-spring/shared/stringInterpolation');
var types = require('@react-spring/shared/types');

/** API
 *  useChain(references, timeSteps, timeFrame)
 */

function useChain(refs, timeSteps, timeFrame) {
  if (timeFrame === void 0) {
    timeFrame = 1000;
  }

  reactLayoutEffect.useLayoutEffect(function () {
    if (timeSteps) {
      var prevDelay = 0;
      shared.each(refs, function (ref, i) {
        if (!ref.current) return;
        var controllers = ref.current.controllers;

        if (controllers.length) {
          var delay = timeFrame * timeSteps[i]; // Use the previous delay if none exists.

          if (isNaN(delay)) delay = prevDelay;else prevDelay = delay;
          shared.each(controllers, function (ctrl) {
            shared.each(ctrl.queue, function (props) {
              props.delay = delay + (props.delay || 0);
            });
            ctrl.start();
          });
        }
      });
    } else {
      var p = Promise.resolve();
      shared.each(refs, function (ref) {
        var _ref = ref.current || {},
            controllers = _ref.controllers,
            start = _ref.start;

        if (controllers && controllers.length) {
          // Take the queue of each controller
          var updates = controllers.map(function (ctrl) {
            var q = ctrl.queue;
            ctrl.queue = [];
            return q;
          }); // Apply the queue when the previous ref stops animating

          p = p.then(function () {
            shared.each(controllers, function (ctrl, i) {
              var _ctrl$queue;

              return (_ctrl$queue = ctrl.queue).push.apply(_ctrl$queue, updates[i]);
            });
            return start();
          });
        }
      });
    }
  });
}

// The `mass` prop defaults to 1
var config = {
  "default": {
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

var linear = function linear(t) {
  return t;
};

var defaults = _extends(_extends({}, config["default"]), {}, {
  mass: 1,
  damping: 1,
  easing: linear,
  clamp: false
});

var AnimationConfig =
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
function AnimationConfig() {
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
};
function mergeConfig(config, newConfig, defaultConfig) {
  if (defaultConfig) {
    defaultConfig = _extends({}, defaultConfig);
    sanitizeConfig(defaultConfig, newConfig);
    newConfig = _extends(_extends({}, defaultConfig), newConfig);
  }

  sanitizeConfig(config, newConfig);
  Object.assign(config, newConfig);

  for (var key in defaults) {
    if (config[key] == null) {
      config[key] = defaults[key];
    }
  }

  var mass = config.mass,
      frequency = config.frequency,
      damping = config.damping;

  if (!shared.is.und(frequency)) {
    if (frequency < 0.01) frequency = 0.01;
    if (damping < 0) damping = 0;
    config.tension = Math.pow(2 * Math.PI / frequency, 2) * mass;
    config.friction = 4 * Math.PI * damping * mass / frequency;
  }

  return config;
} // Prevent a config from accidentally overriding new props.
// This depends on which "config" props take precedence when defined.

function sanitizeConfig(config, props) {
  if (!shared.is.und(props.decay)) {
    config.duration = undefined;
  } else {
    var isTensionConfig = !shared.is.und(props.tension) || !shared.is.und(props.friction);

    if (isTensionConfig || !shared.is.und(props.frequency) || !shared.is.und(props.damping) || !shared.is.und(props.mass)) {
      config.duration = undefined;
      config.decay = undefined;
    }

    if (isTensionConfig) {
      config.frequency = undefined;
    }
  }
}

var emptyArray = [];
/** @internal */

/** An animation being executed by the frameloop */
var Animation = function Animation() {
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
};

function _createForOfIteratorHelperLoose(o) { var i = 0; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } i = o[Symbol.iterator](); return i.next.bind(i); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
// @see https://github.com/alexreardon/use-memo-one/pull/10
var useMemo = function useMemo(create, deps) {
  return useMemoOne.useMemoOne(create, deps || [{}]);
};
function callProp(value) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return shared.is.fun(value) ? value.apply(void 0, args) : value;
}
/** Try to coerce the given value into a boolean using the given key */

var matchProp = function matchProp(value, key) {
  return value === true || !!(key && value && (shared.is.fun(value) ? value(key) : shared.toArray(value).includes(key)));
};
var getProps = function getProps(props, i, arg) {
  return props && (shared.is.fun(props) ? props(i, arg) : shared.is.arr(props) ? props[i] : _extends({}, props));
};
/** Returns `true` if the given prop is having its default value set. */

var hasDefaultProp = function hasDefaultProp(props, key) {
  return !shared.is.und(getDefaultProp(props, key));
};
/** Get the default value being set for the given `key` */

var getDefaultProp = function getDefaultProp(props, key) {
  return props["default"] === true ? props[key] : props["default"] ? props["default"][key] : undefined;
};
/**
 * Extract the default props from an update.
 *
 * When the `default` prop is falsy, this function still behaves as if
 * `default: true` was used. The `default` prop is always respected when
 * truthy.
 */

var getDefaultProps = function getDefaultProps(props, omitKeys, defaults) {
  if (omitKeys === void 0) {
    omitKeys = [];
  }

  if (defaults === void 0) {
    defaults = {};
  }

  var keys = DEFAULT_PROPS;

  if (props["default"] && props["default"] !== true) {
    props = props["default"];
    keys = Object.keys(props);
  }

  for (var _iterator = _createForOfIteratorHelperLoose(keys), _step; !(_step = _iterator()).done;) {
    var key = _step.value;
    var value = props[key];

    if (!shared.is.und(value) && !omitKeys.includes(key)) {
      defaults[key] = value;
    }
  }

  return defaults;
};
/** Merge the default props of an update into a props cache. */

var mergeDefaultProps = function mergeDefaultProps(defaults, props, omitKeys) {
  return getDefaultProps(props, omitKeys, defaults);
};
/** These props can have default values */

var DEFAULT_PROPS = ['pause', 'cancel', 'config', 'immediate', 'onDelayEnd', 'onProps', 'onStart', 'onChange', 'onRest'];
var RESERVED_PROPS = {
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
  "default": 1,
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
  var forward = {};
  var count = 0;
  shared.each(props, function (value, prop) {
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
  var to = getForwardProps(props);

  if (to) {
    var out = {
      to: to
    };
    shared.each(props, function (val, key) {
      return key in to || (out[key] = val);
    });
    return out;
  }

  return _extends({}, props);
} // Compute the goal value, converting "red" to "rgba(255, 0, 0, 1)" in the process

function computeGoal(value) {
  var config = shared.getFluidConfig(value);
  return config ? computeGoal(config.get()) : shared.is.arr(value) ? value.map(computeGoal) : shared.isAnimatedString(value) ? G.createStringInterpolator({
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
function scheduleProps(callId, _ref) {
  var key = _ref.key,
      props = _ref.props,
      state = _ref.state,
      actions = _ref.actions;
  return new Promise(function (resolve, reject) {
    var delay;
    var timeout;
    var pause = false;
    var cancel = matchProp(props.cancel, key);

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

      delay = timeout.time - shared.Globals.now();
    }

    function onResume() {
      if (delay > 0) {
        state.pauseQueue.add(onPause);
        timeout = shared.Globals.frameLoop.setTimeout(onStart, delay);
      } else {
        onStart();
      }
    }

    function onStart() {
      state.pauseQueue["delete"](onPause); // Maybe cancelled during its delay.

      if (callId <= (state.cancelId || 0)) {
        cancel = true;
      }

      try {
        actions.start(_extends(_extends({}, props), {}, {
          callId: callId,
          delay: delay,
          cancel: cancel,
          pause: pause
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
var getCombinedResult = function getCombinedResult(target, results) {
  return results.length == 1 ? results[0] : results.some(function (result) {
    return result.cancelled;
  }) ? getCancelledResult(target) : results.every(function (result) {
    return result.noop;
  }) ? getNoopResult(target) : getFinishedResult(target, results.every(function (result) {
    return result.finished;
  }));
};
/** No-op results are for updates that never start an animation. */

var getNoopResult = function getNoopResult(target, value) {
  if (value === void 0) {
    value = target.get();
  }

  return {
    value: value,
    noop: true,
    finished: true,
    target: target
  };
};
var getFinishedResult = function getFinishedResult(target, finished, value) {
  if (value === void 0) {
    value = target.get();
  }

  return {
    value: value,
    finished: finished,
    target: target
  };
};
var getCancelledResult = function getCancelledResult(target, value) {
  if (value === void 0) {
    value = target.get();
  }

  return {
    value: value,
    cancelled: true,
    target: target
  };
};

function _createForOfIteratorHelperLoose$1(o) { var i = 0; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray$1(o))) return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } i = o[Symbol.iterator](); return i.next.bind(i); }

function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * Start an async chain or an async script.
 *
 * Always call `runAsync` in the action callback of a `scheduleProps` call.
 *
 * The `T` parameter can be a set of animated values (as an object type)
 * or a primitive type for a single animated value.
 */
function runAsync(_x, _x2, _x3, _x4) {
  return _runAsync.apply(this, arguments);
}

function _runAsync() {
  _runAsync = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(to, props, state, target) {
    var callId, parentId, onRest, prevTo, prevPromise;
    return _regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!props.pause) {
              _context4.next = 3;
              break;
            }

            _context4.next = 3;
            return new Promise(function (resume) {
              state.resumeQueue.add(resume);
            });

          case 3:
            callId = props.callId, parentId = props.parentId, onRest = props.onRest;
            prevTo = state.asyncTo, prevPromise = state.promise;

            if (!(!parentId && to === prevTo && !props.reset)) {
              _context4.next = 7;
              break;
            }

            return _context4.abrupt("return", prevPromise);

          case 7:
            return _context4.abrupt("return", state.promise = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
              var defaultProps, preventBail, bail, bailPromise, withBailHandler, bailIfEnded, animate, result, animating;
              return _regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      state.asyncId = callId;
                      state.asyncTo = to; // The default props of any `animate` calls.

                      defaultProps = getDefaultProps(props, [// The `onRest` prop is only called when the `runAsync` promise is resolved.
                      'onRest']);
                      // This promise is rejected when the animation is interrupted.
                      bailPromise = new Promise(function (resolve, reject) {
                        return preventBail = resolve, bail = reject;
                      }); // Stop animating when an error is caught.

                      withBailHandler = function withBailHandler(fn) {
                        return function () {
                          var onError = function onError(err) {
                            if (err instanceof BailSignal) {
                              bail(err); // Stop animating.
                            }

                            throw err;
                          };

                          try {
                            return fn.apply(void 0, arguments)["catch"](onError);
                          } catch (err) {
                            onError(err);
                          }
                        };
                      };

                      bailIfEnded = function bailIfEnded(bailSignal) {
                        var bailResult = // The `cancel` prop or `stop` method was used.
                        callId <= (state.cancelId || 0) && getCancelledResult(target) || // The async `to` prop was replaced.
                        callId !== state.asyncId && getFinishedResult(target, false);

                        if (bailResult) {
                          bailSignal.result = bailResult;
                          throw bailSignal;
                        }
                      }; // Note: This function cannot use the `async` keyword, because we want the
                      // `throw` statements to interrupt the caller.


                      animate = withBailHandler(function (arg1, arg2) {
                        var bailSignal = new BailSignal();
                        bailIfEnded(bailSignal);
                        var props = shared.is.obj(arg1) ? _extends({}, arg1) : _extends(_extends({}, arg2), {}, {
                          to: arg1
                        });
                        props.parentId = callId;
                        shared.each(defaultProps, function (value, key) {
                          if (shared.is.und(props[key])) {
                            props[key] = value;
                          }
                        });
                        return target.start(props).then( /*#__PURE__*/function () {
                          var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(result) {
                            return _regeneratorRuntime.wrap(function _callee$(_context) {
                              while (1) {
                                switch (_context.prev = _context.next) {
                                  case 0:
                                    bailIfEnded(bailSignal);

                                    if (!target.is('PAUSED')) {
                                      _context.next = 4;
                                      break;
                                    }

                                    _context.next = 4;
                                    return new Promise(function (resume) {
                                      state.resumeQueue.add(resume);
                                    });

                                  case 4:
                                    return _context.abrupt("return", result);

                                  case 5:
                                  case "end":
                                    return _context.stop();
                                }
                              }
                            }, _callee);
                          }));

                          return function (_x5) {
                            return _ref2.apply(this, arguments);
                          };
                        }());
                      });
                      _context3.prev = 7;

                      // Async sequence
                      if (shared.is.arr(to)) {
                        animating = function () {
                          var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(queue) {
                            var _iterator, _step, _props;

                            return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                              while (1) {
                                switch (_context2.prev = _context2.next) {
                                  case 0:
                                    _iterator = _createForOfIteratorHelperLoose$1(queue);

                                  case 1:
                                    if ((_step = _iterator()).done) {
                                      _context2.next = 7;
                                      break;
                                    }

                                    _props = _step.value;
                                    _context2.next = 5;
                                    return animate(_props);

                                  case 5:
                                    _context2.next = 1;
                                    break;

                                  case 7:
                                  case "end":
                                    return _context2.stop();
                                }
                              }
                            }, _callee2);
                          }));

                          return function (_x6) {
                            return _ref3.apply(this, arguments);
                          };
                        }()(to);
                      } // Async script
                      else if (shared.is.fun(to)) {
                          animating = Promise.resolve(to(animate, target.stop.bind(target)));
                        }

                      _context3.next = 11;
                      return Promise.all([animating.then(preventBail), bailPromise]);

                    case 11:
                      result = getFinishedResult(target, true); // Bail handling

                      _context3.next = 21;
                      break;

                    case 14:
                      _context3.prev = 14;
                      _context3.t0 = _context3["catch"](7);

                      if (!(_context3.t0 instanceof BailSignal)) {
                        _context3.next = 20;
                        break;
                      }

                      result = _context3.t0.result;
                      _context3.next = 21;
                      break;

                    case 20:
                      throw _context3.t0;

                    case 21:
                      _context3.prev = 21;

                      if (callId == state.asyncId) {
                        state.asyncId = parentId;
                        state.asyncTo = parentId ? prevTo : undefined;
                        state.promise = parentId ? prevPromise : undefined;
                      }

                      return _context3.finish(21);

                    case 24:
                      if (shared.is.fun(onRest)) {
                        G.batchedUpdates(function () {
                          onRest(result);
                        });
                      }

                      return _context3.abrupt("return", result);

                    case 26:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, _callee3, null, [[7, 14, 21, 24]]);
            }))());

          case 8:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _runAsync.apply(this, arguments);
}

function cancelAsync(state, callId) {
  state.cancelId = callId;
  state.asyncId = state.asyncTo = state.promise = undefined;
}
/** This error is thrown to signal an interrupted async animation. */

var BailSignal = /*#__PURE__*/function (_Error) {
  _inheritsLoose(BailSignal, _Error);

  function BailSignal() {
    var _this;

    _this = _Error.call(this, 'An async animation has been interrupted. You see this error because you ' + 'forgot to use `await` or `.catch(...)` on its returned promise.') || this;
    _this.result = void 0;
    return _this;
  }

  return BailSignal;
}( /*#__PURE__*/_wrapNativeSuper(Error));

var isFrameValue = function isFrameValue(value) {
  return value instanceof FrameValue;
};
var nextId = 1;
/**
 * A kind of `FluidValue` that manages an `AnimatedValue` node.
 *
 * Its underlying value can be accessed and even observed.
 */

var FrameValue = /*#__PURE__*/function (_FluidValue) {
  _inheritsLoose(FrameValue, _FluidValue);

  function FrameValue() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _FluidValue.call.apply(_FluidValue, [this].concat(args)) || this;
    _this.id = nextId++;
    _this.key = void 0;
    _this._priority = 0;
    _this._children = new Set();
    return _this;
  }

  var _proto = FrameValue.prototype;

  /** Get the current value */
  _proto.get = function get() {
    var node = animated.getAnimated(this);
    return node && node.getValue();
  }
  /** Create a spring that maps our value to another value */
  ;

  _proto.to = function to() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return G.to(this, args);
  }
  /** @deprecated Use the `to` method instead. */
  ;

  _proto.interpolate = function interpolate() {
    deprecations.deprecateInterpolate();

    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return G.to(this, args);
  }
  /** @internal */
  ;

  /** @internal */
  _proto.addChild = function addChild(child) {
    if (!this._children.size) this._attach();

    this._children.add(child);
  }
  /** @internal */
  ;

  _proto.removeChild = function removeChild(child) {
    this._children["delete"](child);

    if (!this._children.size) this._detach();
  }
  /** @internal */
  ;

  _proto.onParentChange = function onParentChange(_ref) {
    var type = _ref.type;

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
  ;

  _proto._attach = function _attach() {}
  /** Called when the last child is removed. */
  ;

  _proto._detach = function _detach() {}
  /**
   * Reset our animation state (eg: start values, velocity, etc)
   * and tell our children to do the same.
   *
   * This is called when our goal value is changed during (or before)
   * an animation.
   */
  ;

  _proto._reset = function _reset() {
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
  ;

  _proto._start = function _start() {
    this._emit({
      type: 'start',
      parent: this
    });
  }
  /** Tell our children about our new value */
  ;

  _proto._onChange = function _onChange(value, idle) {
    if (idle === void 0) {
      idle = false;
    }

    this._emit({
      type: 'change',
      parent: this,
      value: value,
      idle: idle
    });
  }
  /** Tell our children about our new priority */
  ;

  _proto._onPriorityChange = function _onPriorityChange(priority) {
    if (!this.idle) {
      // Make the frameloop aware of our new priority.
      G.frameLoop.start(this);
    }

    this._emit({
      type: 'priority',
      parent: this,
      priority: priority
    });
  };

  _proto._emit = function _emit(event) {
    // Clone "_children" so it can be safely mutated inside the loop.
    shared.each(Array.from(this._children), function (child) {
      child.onParentChange(event);
    });
  };

  _createClass(FrameValue, [{
    key: "priority",
    get: function get() {
      return this._priority;
    },
    set: function set(priority) {
      if (this._priority != priority) {
        this._priority = priority;

        this._onPriorityChange(priority);
      }
    }
  }]);

  return FrameValue;
}(shared.FluidValue);

// TODO: use "const enum" when Babel supports it

/** The spring has not animated yet */
var CREATED = 'CREATED';
/** The spring has animated before */

var IDLE = 'IDLE';
/** The spring is animating */

var ACTIVE = 'ACTIVE';
/** The spring is frozen in time */

var PAUSED = 'PAUSED';
/** The spring cannot be animated */

var DISPOSED = 'DISPOSED';

/**
 * Only numbers, strings, and arrays of numbers/strings are supported.
 * Non-animatable strings are also supported.
 */
var SpringValue = /*#__PURE__*/function (_FrameValue) {
  _inheritsLoose(SpringValue, _FrameValue);

  function SpringValue(arg1, arg2) {
    var _this;

    _this = _FrameValue.call(this) || this;
    _this.key = void 0;
    _this.animation = new Animation();
    _this.queue = void 0;
    _this._phase = CREATED;
    _this._state = {
      pauseQueue: new Set(),
      resumeQueue: new Set()
    };
    _this._defaultProps = {};
    _this._lastCallId = 0;
    _this._lastToId = 0;

    if (!shared.is.und(arg1) || !shared.is.und(arg2)) {
      var _props = shared.is.obj(arg1) ? _extends({}, arg1) : _extends(_extends({}, arg2), {}, {
        from: arg1
      });

      _props["default"] = true;

      _this.start(_props);
    }

    return _this;
  }

  var _proto = SpringValue.prototype;

  /** Advance the current animation by a number of milliseconds */
  _proto.advance = function advance(dt) {
    var _this2 = this;

    var idle = true;
    var changed = false;
    var anim = this.animation;
    var config = anim.config,
        toValues = anim.toValues;
    var payload = animated.getPayload(anim.to);

    if (!payload) {
      var toConfig = shared.getFluidConfig(anim.to);

      if (toConfig) {
        toValues = shared.toArray(toConfig.get());
      }
    }

    anim.values.forEach(function (node, i) {
      if (node.done) return; // The "anim.toValues" array must exist when no parent exists.

      var to = payload ? payload[i].lastPosition : toValues[i];
      var finished = anim.immediate;
      var position = to;

      if (!finished) {
        position = node.lastPosition; // Loose springs never move.

        if (config.tension <= 0) {
          node.done = true;
          return;
        }

        var elapsed = node.elapsedTime += dt;
        var _from = anim.fromValues[i];
        var v0 = node.v0 != null ? node.v0 : node.v0 = shared.is.arr(config.velocity) ? config.velocity[i] : config.velocity;
        var velocity; // Duration easing

        if (!shared.is.und(config.duration)) {
          var p = config.progress || 0;
          if (config.duration <= 0) p = 1;else p += (1 - p) * Math.min(1, elapsed / config.duration);
          position = _from + config.easing(p) * (to - _from);
          velocity = (position - node.lastPosition) / dt;
          finished = p == 1;
        } // Decay easing
        else if (config.decay) {
            var decay = config.decay === true ? 0.998 : config.decay;
            var e = Math.exp(-(1 - decay) * elapsed);
            position = _from + v0 / (1 - decay) * (1 - e);
            finished = Math.abs(node.lastPosition - position) < 0.1; // derivative of position

            velocity = v0 * e;
          } // Spring easing
          else {
              velocity = node.lastVelocity == null ? v0 : node.lastVelocity;
              /** The smallest distance from a value before being treated like said value. */

              var precision = config.precision || (_from == to ? 0.005 : Math.min(1, Math.abs(to - _from) * 0.001));
              /** The velocity at which movement is essentially none */

              var restVelocity = config.restVelocity || precision / 10; // Bouncing is opt-in (not to be confused with overshooting)

              var bounceFactor = config.clamp ? 0 : config.bounce;
              var canBounce = !shared.is.und(bounceFactor);
              /** When `true`, the value is increasing over time */

              var isGrowing = _from == to ? node.v0 > 0 : _from < to;
              /** When `true`, the velocity is considered moving */

              var isMoving;
              /** When `true`, the velocity is being deflected or clamped */

              var isBouncing = false;
              var step = 1; // 1ms

              var numSteps = Math.ceil(dt / step);

              for (var n = 0; n < numSteps; ++n) {
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

                var springForce = -config.tension * 0.000001 * (position - to);
                var dampingForce = -config.friction * 0.001 * velocity;
                var acceleration = (springForce + dampingForce) / config.mass; // pt/ms^2

                velocity = velocity + acceleration * step; // pt/ms

                position = position + velocity * step;
              }
            }

        node.lastVelocity = velocity;

        if (Number.isNaN(position)) {
          console.warn("Got NaN while animating:", _this2);
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
  ;

  _proto.is = function is(phase) {
    return this._phase == phase;
  }
  /** Set the current value, while stopping the current animation */
  ;

  _proto.set = function set(value) {
    var _this3 = this;

    G.batchedUpdates(function () {
      _this3._focus(value);

      if (_this3._set(value)) {
        // Ensure change observers are notified. When active,
        // the "_stop" method handles this.
        if (!_this3.is(ACTIVE)) {
          return _this3._onChange(_this3.get(), true);
        }
      }

      _this3._stop();
    });
    return this;
  }
  /**
   * Freeze the active animation in time.
   * This does nothing when not animating.
   */
  ;

  _proto.pause = function pause() {
    checkDisposed(this, 'pause');

    if (!this.is(PAUSED)) {
      this._phase = PAUSED;
      shared.flush(this._state.pauseQueue, function (onPause) {
        return onPause();
      });
    }
  }
  /** Resume the animation if paused. */
  ;

  _proto.resume = function resume() {
    checkDisposed(this, 'resume');

    if (this.is(PAUSED)) {
      this._start();

      shared.flush(this._state.resumeQueue, function (onResume) {
        return onResume();
      });
    }
  }
  /**
   * Skip to the end of the current animation.
   *
   * All `onRest` callbacks are passed `{finished: true}`
   */
  ;

  _proto.finish = function finish(to) {
    var _this4 = this;

    this.resume();

    if (this.is(ACTIVE)) {
      var anim = this.animation; // Decay animations have an implicit goal.

      if (!anim.config.decay && shared.is.und(to)) {
        to = anim.to;
      } // Set the value if we can.


      if (!shared.is.und(to)) {
        this._set(to);
      }

      G.batchedUpdates(function () {
        // Ensure the "onStart" and "onRest" props are called.
        if (!anim.changed) {
          anim.changed = true;

          if (anim.onStart) {
            anim.onStart(_this4);
          }
        } // Exit the frameloop.


        _this4._stop();
      });
    }

    return this;
  }
  /** Push props into the pending queue. */
  ;

  _proto.update = function update(props) {
    checkDisposed(this, 'update');
    var queue = this.queue || (this.queue = []);
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
  ;

  _proto.start = /*#__PURE__*/function () {
    var _start2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(to, arg2) {
      var _this5 = this;

      var queue, results;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              checkDisposed(this, 'start');

              if (!shared.is.und(to)) {
                queue = [shared.is.obj(to) ? to : _extends(_extends({}, arg2), {}, {
                  to: to
                })];
              } else {
                queue = this.queue || [];
                this.queue = [];
              }

              _context.next = 4;
              return Promise.all(queue.map(function (props) {
                return _this5._update(props);
              }));

            case 4:
              results = _context.sent;
              return _context.abrupt("return", getCombinedResult(this, results));

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function start(_x, _x2) {
      return _start2.apply(this, arguments);
    }

    return start;
  }()
  /**
   * Stop the current animation, and cancel any delayed updates.
   *
   * Pass `true` to call `onRest` with `cancelled: true`.
   */
  ;

  _proto.stop = function stop(cancel) {
    var _this6 = this;

    if (!this.is(DISPOSED)) {
      cancelAsync(this._state, this._lastCallId); // Ensure the `to` value equals the current value.

      this._focus(this.get()); // Exit the frameloop and notify `onRest` listeners.


      G.batchedUpdates(function () {
        return _this6._stop(cancel);
      });
    }

    return this;
  }
  /** Restart the animation. */
  ;

  _proto.reset = function reset() {
    this._update({
      reset: true
    });
  }
  /** Prevent future animations, and stop the current animation */
  ;

  _proto.dispose = function dispose() {
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
  ;

  _proto.onParentChange = function onParentChange(event) {
    _FrameValue.prototype.onParentChange.call(this, event);

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
  ;

  _proto._prepareNode = function _prepareNode(_ref) {
    var to = _ref.to,
        from = _ref.from,
        reverse = _ref.reverse;
    var key = this.key || '';
    to = !shared.is.obj(to) || shared.getFluidConfig(to) ? to : to[key];
    from = !shared.is.obj(from) || shared.getFluidConfig(from) ? from : from[key]; // Create the range now to avoid "reverse" logic.

    var range = {
      to: to,
      from: from
    }; // Before ever animating, this method ensures an `Animated` node
    // exists and keeps its value in sync with the "from" prop.

    if (this.is(CREATED)) {
      if (reverse) {
        var _ref2 = [from, to];
        to = _ref2[0];
        from = _ref2[1];
      }

      from = shared.getFluidValue(from);

      var node = this._updateNode(shared.is.und(from) ? shared.getFluidValue(to) : from);

      if (node && !shared.is.und(from)) {
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
  ;

  _proto._updateNode = function _updateNode(value) {
    var node = animated.getAnimated(this);

    if (!shared.is.und(value)) {
      var nodeType = this._getNodeType(value);

      if (!node || node.constructor !== nodeType) {
        animated.setAnimated(this, node = nodeType.create(value));
      }
    }

    return node;
  }
  /** Return the `Animated` node constructor for a given value */
  ;

  _proto._getNodeType = function _getNodeType(value) {
    var parentNode = animated.getAnimated(value);
    return parentNode ? parentNode.constructor : shared.is.arr(value) ? animated.AnimatedArray : shared.isAnimatedString(value) ? animated.AnimatedString : animated.AnimatedValue;
  }
  /** Schedule an animation to run after an optional delay */
  ;

  _proto._update = function _update(props, isLoop) {
    var _this7 = this;

    var defaultProps = this._defaultProps;

    var mergeDefaultProp = function mergeDefaultProp(key) {
      var value = getDefaultProp(props, key);

      if (!shared.is.und(value)) {
        defaultProps[key] = value;
      } // For `cancel` and `pause`, a truthy default always wins.


      if (defaultProps[key]) {
        props[key] = defaultProps[key];
      }
    }; // These props are coerced into booleans by the `scheduleProps` function,
    // so they need their default values processed before then.


    mergeDefaultProp('cancel');
    mergeDefaultProp('pause'); // Ensure the initial value can be accessed by animated components.

    var range = this._prepareNode(props);

    return scheduleProps(++this._lastCallId, {
      key: this.key,
      props: props,
      state: this._state,
      actions: {
        pause: this.pause.bind(this),
        resume: this.resume.bind(this),
        start: this._merge.bind(this, range)
      }
    }).then(function (result) {
      if (props.loop && result.finished && !(isLoop && result.noop)) {
        var nextProps = createLoopUpdate(props);

        if (nextProps) {
          return _this7._update(nextProps, true);
        }
      }

      return result;
    });
  }
  /** Merge props into the current animation */
  ;

  _proto._merge = function _merge(range, props, resolve) {
    // The "cancel" prop cancels all pending delays and it forces the
    // active animation to stop where it is.
    if (props.cancel) {
      this.stop(true);
      return resolve(getCancelledResult(this));
    }

    var key = this.key,
        anim = this.animation;
    var defaultProps = this._defaultProps;
    /** The "to" prop is defined. */

    var hasToProp = !shared.is.und(range.to);
    /** The "from" prop is defined. */

    var hasFromProp = !shared.is.und(range.from); // Avoid merging other props if implicitly prevented, except
    // when both the "to" and "from" props are undefined.

    if (hasToProp || hasFromProp) {
      if (props.callId > this._lastToId) {
        this._lastToId = props.callId;
      } else {
        return resolve(getCancelledResult(this));
      }
    }
    /** Get the value of a prop, or its default value */


    var get = function get(prop) {
      return !shared.is.und(props[prop]) ? props[prop] : defaultProps[prop];
    }; // Call "onDelayEnd" before merging props, but after cancellation checks.


    var onDelayEnd = coerceEventProp(get('onDelayEnd'), key);

    if (onDelayEnd) {
      onDelayEnd(props, this);
    }

    if (props["default"]) {
      mergeDefaultProps(defaultProps, props, ['pause', 'cancel']);
    }

    var prevTo = anim.to,
        prevFrom = anim.from;
    var _range$to = range.to,
        to = _range$to === void 0 ? prevTo : _range$to,
        _range$from = range.from,
        from = _range$from === void 0 ? prevFrom : _range$from; // Focus the "from" value if changing without a "to" value.

    if (hasFromProp && !hasToProp) {
      to = from;
    } // Flip the current range if "reverse" is true.


    if (props.reverse) {
      var _ref3 = [from, to];
      to = _ref3[0];
      from = _ref3[1];
    }
    /** The "from" value is changing. */


    var hasFromChanged = !shared.isEqual(from, prevFrom);

    if (hasFromChanged) {
      anim.from = from;
    }
    /** The "to" value is changing. */


    var hasToChanged = !shared.isEqual(to, prevTo);

    if (hasToChanged) {
      this._focus(to);
    } // Both "from" and "to" can use a fluid config (thanks to http://npmjs.org/fluids).


    var toConfig = shared.getFluidConfig(to);
    var fromConfig = shared.getFluidConfig(from);

    if (fromConfig) {
      from = fromConfig.get();
    }
    /** The "to" prop is async. */


    var hasAsyncTo = shared.is.arr(props.to) || shared.is.fun(props.to);
    var config = anim.config;
    var decay = config.decay,
        velocity = config.velocity; // The "runAsync" function treats the "config" prop as a default,
    // so we must avoid merging it when the "to" prop is async.

    if (props.config && !hasAsyncTo) {
      mergeConfig(config, callProp(props.config, key), // Avoid calling the same "config" prop twice.
      props.config !== defaultProps.config ? callProp(defaultProps.config, key) : void 0);
    } // This instance might not have its Animated node yet. For example,
    // the constructor can be given props without a "to" or "from" value.


    var node = animated.getAnimated(this);

    if (!node || shared.is.und(to)) {
      return resolve(getFinishedResult(this, true));
    }
    /** When true, start at the "from" value. */


    var reset = // When `reset` is undefined, the `from` prop implies `reset: true`,
    // except for declarative updates. When `reset` is defined, there
    // must exist a value to animate from.
    shared.is.und(props.reset) ? hasFromProp && !props["default"] : !shared.is.und(from) && matchProp(props.reset, key); // The current value, where the animation starts from.

    var value = reset ? from : this.get(); // The animation ends at this value, unless "to" is fluid.

    var goal = computeGoal(to); // Only specific types can be animated to/from.

    var isAnimatable = shared.is.num(goal) || shared.is.arr(goal) || shared.isAnimatedString(goal); // When true, the value changes instantly on the next frame.

    var immediate = !hasAsyncTo && (!isAnimatable || matchProp(defaultProps.immediate || props.immediate, key));

    if (hasToChanged) {
      if (immediate) {
        node = this._updateNode(goal);
      } else {
        var nodeType = this._getNodeType(to);

        if (nodeType !== node.constructor) {
          throw Error("Cannot animate between " + node.constructor.name + " and " + nodeType.name + ", as the \"to\" prop suggests");
        }
      }
    } // The type of Animated node for the goal value.


    var goalType = node.constructor; // When the goal value is fluid, we don't know if its value
    // will change before the next animation frame, so it always
    // starts the animation to be safe.

    var started = !!toConfig;
    var finished = false;

    if (!started) {
      // When true, the current value has probably changed.
      var hasValueChanged = reset || this.is(CREATED) && hasFromChanged; // When the "to" value or current value are changed,
      // start animating if not already finished.

      if (hasToChanged || hasValueChanged) {
        finished = shared.isEqual(computeGoal(value), goal);
        started = !finished;
      } // Changing "decay" or "velocity" starts the animation.


      if (!shared.isEqual(config.decay, decay) || !shared.isEqual(config.velocity, velocity)) {
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
      if (started || shared.getFluidConfig(prevTo)) {
        anim.values = node.getPayload();
        anim.toValues = toConfig ? null : goalType == animated.AnimatedString ? [1] : shared.toArray(goal);
      }

      anim.immediate = immediate;
      anim.onStart = coerceEventProp(get('onStart'), key);
      anim.onChange = coerceEventProp(get('onChange'), key); // The "reset" prop tries to reuse the old "onRest" prop,
      // unless you defined a new "onRest" prop.

      var onRestQueue = anim.onRest;
      var onRest = reset && !props.onRest ? onRestQueue[0] || shared.noop : checkFinishedOnRest(coerceEventProp(get('onRest'), key), this); // In most cases, the animation after this one won't reuse our
      // "onRest" prop. Instead, the _default_ "onRest" prop is used
      // when the next animation has an undefined "onRest" prop.

      if (started) {
        anim.onRest = [onRest, checkFinishedOnRest(resolve, this)]; // Flush the "onRest" queue for the previous animation.

        var onRestIndex = reset ? 0 : 1;

        if (onRestIndex < onRestQueue.length) {
          G.batchedUpdates(function () {
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


    var onProps = coerceEventProp(get('onProps'), key);

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
  ;

  _proto._focus = function _focus(value) {
    var anim = this.animation;

    if (value !== anim.to) {
      var config = shared.getFluidConfig(anim.to);

      if (config) {
        config.removeChild(this);
      }

      anim.to = value;
      var priority = 0;

      if (config = shared.getFluidConfig(value)) {
        config.addChild(this);

        if (isFrameValue(value)) {
          priority = (value.priority || 0) + 1;
        }
      }

      this.priority = priority;
    }
  }
  /** Set the current value and our `node` if necessary. The `_onChange` method is *not* called. */
  ;

  _proto._set = function _set(value) {
    var config = shared.getFluidConfig(value);

    if (config) {
      value = config.get();
    }

    var node = animated.getAnimated(this);
    var oldValue = node && node.getValue();

    if (node) {
      node.setValue(value);
    } else {
      this._updateNode(value);
    }

    return !shared.isEqual(value, oldValue);
  };

  _proto._onChange = function _onChange(value, idle) {
    if (idle === void 0) {
      idle = false;
    }

    var anim = this.animation; // The "onStart" prop is called on the first change after entering the
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

    _FrameValue.prototype._onChange.call(this, value, idle);
  };

  _proto._reset = function _reset() {
    var anim = this.animation; // Reset the state of each Animated node.

    animated.getAnimated(this).reset(anim.to); // Ensure the `onStart` prop will be called.

    if (!this.is(ACTIVE)) {
      anim.changed = false;
    } // Use the current values as the from values.


    if (!anim.immediate) {
      anim.fromValues = anim.values.map(function (node) {
        return node.lastPosition;
      });
    }

    _FrameValue.prototype._reset.call(this);
  };

  _proto._start = function _start() {
    if (!this.is(ACTIVE)) {
      this._phase = ACTIVE;

      _FrameValue.prototype._start.call(this); // The "skipAnimation" global avoids the frameloop.


      if (G.skipAnimation) {
        this.finish();
      } else {
        G.frameLoop.start(this);
      }
    }
  }
  /**
   * Exit the frameloop and notify `onRest` listeners.
   *
   * Always wrap `_stop` calls with `batchedUpdates`.
   */
  ;

  _proto._stop = function _stop(cancel) {
    this.resume();

    if (this.is(ACTIVE)) {
      this._phase = IDLE; // Always let change observers know when a spring becomes idle.

      this._onChange(this.get(), true);

      var anim = this.animation;
      shared.each(anim.values, function (node) {
        node.done = true;
      });
      var onRestQueue = anim.onRest;

      if (onRestQueue.length) {
        // Preserve the "onRest" prop when the goal is dynamic.
        anim.onRest = [anim.toValues ? shared.noop : onRestQueue[0]]; // Never call the "onRest" prop for no-op animations.

        if (!anim.changed) {
          onRestQueue[0] = shared.noop;
        }

        shared.each(onRestQueue, function (onRest) {
          return onRest(cancel);
        });
      }
    }
  };

  _createClass(SpringValue, [{
    key: "idle",
    get: function get() {
      return !this.is(ACTIVE) && !this._state.asyncTo;
    }
  }, {
    key: "goal",
    get: function get() {
      return shared.getFluidValue(this.animation.to);
    }
  }, {
    key: "velocity",
    get: function get() {
      var node = animated.getAnimated(this);
      return node instanceof animated.AnimatedValue ? node.lastVelocity || 0 : node.getPayload().map(function (node) {
        return node.lastVelocity || 0;
      });
    }
  }]);

  return SpringValue;
}(FrameValue);

function checkDisposed(spring, name) {
  if (spring.is(DISPOSED)) {
    throw Error("Cannot call \"" + name + "\" of disposed \"" + spring.constructor.name + "\" object");
  }
}
/** Coerce an event prop to an event handler */


function coerceEventProp(prop, key) {
  return shared.is.fun(prop) ? prop : key && prop ? prop[key] : undefined;
}
/**
 * The "finished" value is determined by each "onRest" handler,
 * based on whether the current value equals the goal value that
 * was calculated at the time the "onRest" handler was set.
 */


var checkFinishedOnRest = function checkFinishedOnRest(onRest, spring) {
  var to = spring.animation.to;
  return onRest ? function (cancel) {
    if (cancel) {
      onRest(getCancelledResult(spring));
    } else {
      var goal = computeGoal(to);
      var value = computeGoal(spring.get());
      var finished = shared.isEqual(value, goal);
      onRest(getFinishedResult(spring, finished));
    }
  } : shared.noop;
};

function createLoopUpdate(props, loop, to) {
  if (loop === void 0) {
    loop = props.loop;
  }

  if (to === void 0) {
    to = props.to;
  }

  var loopRet = callProp(loop);

  if (loopRet) {
    var overrides = loopRet !== true && inferTo(loopRet);
    var reverse = (overrides || props).reverse;
    var reset = !overrides || overrides.reset;
    return createUpdate(_extends(_extends({}, props), {}, {
      loop: loop,
      // Avoid updating default props when looping.
      "default": false,
      // For the "reverse" prop to loop as expected, the "to" prop
      // must be undefined. The "reverse" prop is ignored when the
      // "to" prop is an array or function.
      to: !reverse || shared.is.arr(to) || shared.is.fun(to) ? to : undefined,
      // Avoid defining the "from" prop if a reset is unwanted.
      from: reset ? props.from : undefined,
      reset: reset
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
  var _props2 = props = inferTo(props),
      to = _props2.to,
      from = _props2.from; // Collect the keys affected by this update.


  var keys = new Set();

  if (from) {
    findDefined(from, keys);
  } else {
    // Falsy values are deleted to avoid merging issues.
    delete props.from;
  }

  if (shared.is.obj(to)) {
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
  var update = createUpdate(props);

  if (shared.is.und(update["default"])) {
    update["default"] = getDefaultProps(update, [// Avoid forcing `immediate: true` onto imperative updates.
    update.immediate === true && 'immediate']);
  }

  return update;
}
/** Find keys with defined values */

function findDefined(values, keys) {
  shared.each(values, function (value, key) {
    return value != null && keys.add(key);
  });
}

/** Events batched by the `Controller` class */
var BATCHED_EVENTS = ['onStart', 'onChange', 'onRest'];
var nextId$1 = 1;
/** Queue of pending updates for a `Controller` instance. */

var Controller = /*#__PURE__*/function () {
  /** The animated values */

  /** The queue of props passed to the `update` method. */

  /** Custom handler for flushing update queues */

  /** These props are used by all future spring values */

  /** The combined phase of our spring values */

  /** The counter for tracking `scheduleProps` calls */

  /** The values currently being animated */

  /** State used by the `runAsync` function */

  /** The event queues that are flushed once per frame maximum */
  function Controller(props, flush) {
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


  var _proto = Controller.prototype;

  /** Check the current phase */
  _proto.is = function is(phase) {
    return this._phase == phase;
  }
  /** Get the current values of our springs */
  ;

  _proto.get = function get() {
    var values = {};
    this.each(function (spring, key) {
      return values[key] = spring.get();
    });
    return values;
  }
  /** Push an update onto the queue of each value. */
  ;

  _proto.update = function update(props) {
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
  ;

  _proto.start = function start(props) {
    var queue = props ? shared.toArray(props).map(createUpdate) : this.queue;

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
  ;

  _proto.stop = function stop(keys) {
    if (shared.is.und(keys)) {
      this.each(function (spring) {
        return spring.stop();
      });
      cancelAsync(this._state, this._lastAsyncId);
    } else {
      var springs = this.springs;

      shared.each(shared.toArray(keys), function (key) {
        return springs[key].stop();
      });
    }

    return this;
  }
  /** Freeze the active animation in time */
  ;

  _proto.pause = function pause(keys) {
    if (shared.is.und(keys)) {
      this.each(function (spring) {
        return spring.pause();
      });
    } else {
      var springs = this.springs;

      shared.each(shared.toArray(keys), function (key) {
        return springs[key].pause();
      });
    }

    return this;
  }
  /** Resume the animation if paused. */
  ;

  _proto.resume = function resume(keys) {
    if (shared.is.und(keys)) {
      this.each(function (spring) {
        return spring.resume();
      });
    } else {
      var springs = this.springs;

      shared.each(shared.toArray(keys), function (key) {
        return springs[key].resume();
      });
    }

    return this;
  }
  /** Restart every animation. */
  ;

  _proto.reset = function reset() {
    this.each(function (spring) {
      return spring.reset();
    }); // TODO: restart async "to" prop

    return this;
  }
  /** Call a function once per spring value */
  ;

  _proto.each = function each(iterator) {
    shared.each(this.springs, iterator);
  }
  /** Destroy every spring in this controller */
  ;

  _proto.dispose = function dispose() {
    this._state.asyncTo = undefined;
    this.each(function (spring) {
      return spring.dispose();
    });
    this.springs = {};
  }
  /** @internal Called at the end of every animation frame */
  ;

  _proto._onFrame = function _onFrame() {
    var _this = this;

    var _this$_events = this._events,
        onStart = _this$_events.onStart,
        onChange = _this$_events.onChange,
        onRest = _this$_events.onRest;
    var isActive = this._active.size > 0;

    if (isActive && this._phase != ACTIVE) {
      this._phase = ACTIVE;
      shared.flush(onStart, function (onStart) {
        return onStart(_this);
      });
    }

    var values = (onChange.size || !isActive && onRest.size) && this.get();
    shared.flush(onChange, function (onChange) {
      return onChange(values);
    }); // The "onRest" queue is only flushed when all springs are idle.

    if (!isActive) {
      this._phase = IDLE;
      shared.flush(onRest, function (_ref) {
        var onRest = _ref[0],
            result = _ref[1];
        result.value = values;
        onRest(result);
      });
    }
  }
  /** @internal */
  ;

  _proto.onParentChange = function onParentChange(event) {
    if (event.type == 'change') {
      this._active[event.idle ? 'delete' : 'add'](event.parent);

      G.frameLoop.onFrame(this._onFrame);
    }
  };

  _createClass(Controller, [{
    key: "idle",
    get: function get() {
      return !this._state.asyncTo && Object.values(this.springs).every(function (spring) {
        return spring.idle;
      });
    }
  }]);

  return Controller;
}();
/**
 * Warning: Props might be mutated.
 */

function flushUpdateQueue(ctrl, queue) {
  return Promise.all(queue.map(function (props) {
    return flushUpdate(ctrl, props);
  })).then(function (results) {
    return getCombinedResult(ctrl, results);
  });
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
  var to = props.to,
      loop = props.loop,
      onRest = props.onRest; // Looping must be handled in this function, or else the values
  // would end up looping out-of-sync in many common cases.

  if (loop) {
    props.loop = false;
  }

  var asyncTo = shared.is.arr(to) || shared.is.fun(to) ? to : undefined;

  if (asyncTo) {
    props.to = undefined;
    props.onRest = undefined;
  } else {
    // For certain events, use batching to prevent multiple calls per frame.
    // However, batching is avoided when the `to` prop is async, because any
    // event props are used as default props instead.
    shared.each(BATCHED_EVENTS, function (key) {
      var handler = props[key];

      if (shared.is.fun(handler)) {
        var queue = ctrl['_events'][key];

        if (queue instanceof Set) {
          props[key] = function () {
            return queue.add(handler);
          };
        } else {
          props[key] = function (_ref2) {
            var finished = _ref2.finished,
                cancelled = _ref2.cancelled;
            var result = queue.get(handler);

            if (result) {
              if (!finished) result.finished = false;
              if (cancelled) result.cancelled = true;
            } else {
              // The "value" is set before the "handler" is called.
              queue.set(handler, {
                value: null,
                finished: finished,
                cancelled: cancelled
              });
            }
          };
        }
      }
    });
  }

  var keys = props.keys || Object.keys(ctrl.springs);
  var promises = keys.map(function (key) {
    return ctrl.springs[key].start(props);
  }); // Schedule the "asyncTo" if defined.

  var state = ctrl['_state'];

  if (asyncTo) {
    promises.push(scheduleProps(++ctrl['_lastAsyncId'], {
      props: props,
      state: state,
      actions: {
        pause: shared.noop,
        resume: shared.noop,
        start: function start(props, resolve) {
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

  return Promise.all(promises).then(function (results) {
    var result = getCombinedResult(ctrl, results);

    if (loop && result.finished && !(isLoop && result.noop)) {
      var nextProps = createLoopUpdate(props, loop, to);

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
  var springs = _extends({}, ctrl.springs);

  if (props) {
    shared.each(shared.toArray(props), function (props) {
      if (shared.is.und(props.keys)) {
        props = createUpdate(props);
      }

      if (!shared.is.obj(props.to)) {
        // Avoid passing array/function to each spring.
        props = _extends(_extends({}, props), {}, {
          to: undefined
        });
      }

      prepareSprings(springs, props, function (key) {
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
  shared.each(springs, function (spring, key) {
    if (!ctrl.springs[key]) {
      ctrl.springs[key] = spring;
      spring.addChild(ctrl);
    }
  });
}

function createSpring(key, observer) {
  var spring = new SpringValue();
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
    shared.each(props.keys, function (key) {
      var spring = springs[key] || (springs[key] = create(key));
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
  shared.each(queue, function (props) {
    prepareSprings(ctrl.springs, props, function (key) {
      return createSpring(key, ctrl);
    });
  });
}

/**
 * This context affects all new and existing `SpringValue` objects
 * created with the hook API or the renderprops API.
 */

var ctx = React.createContext({});
var SpringContext = function SpringContext(_ref) {
  var children = _ref.children,
      props = _objectWithoutPropertiesLoose(_ref, ["children"]);

  var inherited = React.useContext(ctx); // Memoize the context to avoid unwanted renders.

  props = useMemo(function () {
    return _extends(_extends({}, inherited), props);
  }, [inherited, props.pause, props.cancel, props.immediate, props.config]);
  var Provider = ctx.Provider;
  return /*#__PURE__*/React.createElement(Provider, {
    value: props
  }, children);
};
SpringContext.Provider = ctx.Provider;
SpringContext.Consumer = ctx.Consumer;
/** Get the current values of nearest `SpringContext` component. */

var useSpringContext = function useSpringContext() {
  return React.useContext(ctx);
};

/** Create an imperative API for manipulating an array of `Controller` objects. */
var SpringHandle = {
  create: function create(getControllers) {
    return {
      get controllers() {
        return getControllers();
      },

      update: function update(props) {
        shared.each(getControllers(), function (ctrl, i) {
          ctrl.update(getProps(props, i, ctrl));
        });
        return this;
      },
      start: function start(props) {
        return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
          var results;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return Promise.all(getControllers().map(function (ctrl, i) {
                    var update = getProps(props, i, ctrl);
                    return ctrl.start(update);
                  }));

                case 2:
                  results = _context.sent;
                  return _context.abrupt("return", {
                    value: results.map(function (result) {
                      return result.value;
                    }),
                    finished: results.every(function (result) {
                      return result.finished;
                    })
                  });

                case 4:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }))();
      },
      stop: function stop(keys) {
        return shared.each(getControllers(), function (ctrl) {
          return ctrl.stop(keys);
        });
      },
      pause: function pause(keys) {
        return shared.each(getControllers(), function (ctrl) {
          return ctrl.pause(keys);
        });
      },
      resume: function resume(keys) {
        return shared.each(getControllers(), function (ctrl) {
          return ctrl.resume(keys);
        });
      }
    };
  }
};

/** @internal */
function useSprings(length, props, deps) {
  var propsFn = shared.is.fun(props) && props;
  if (propsFn && !deps) deps = [];
  // Set to 0 to prevent sync flush.
  var layoutId = React.useRef(0);
  var forceUpdate = shared.useForceUpdate(); // State is updated on commit.

  var _useState = React.useState(function () {
    return {
      ctrls: [],
      queue: [],
      flush: function flush(ctrl, updates) {
        var springs = getSprings(ctrl, updates); // Flushing is postponed until the component's commit phase
        // if a spring was created since the last commit.

        var canFlushSync = layoutId.current > 0 && !state.queue.length && !Object.keys(springs).some(function (key) {
          return !ctrl.springs[key];
        });
        return canFlushSync ? flushUpdateQueue(ctrl, updates) : new Promise(function (resolve) {
          setSprings(ctrl, springs);
          state.queue.push(function () {
            resolve(flushUpdateQueue(ctrl, updates));
          });
          forceUpdate();
        });
      }
    };
  }),
      state = _useState[0]; // The imperative API ref from the props of the first controller.


  var refProp = React.useRef();
  var ctrls = [].concat(state.ctrls);
  var updates = []; // Cache old controllers to dispose in the commit phase.

  var prevLength = shared.usePrev(length) || 0;
  var disposed = ctrls.slice(length, prevLength); // Create new controllers when "length" increases, and destroy
  // the affected controllers when "length" decreases.

  useMemo(function () {
    ctrls.length = length;
    declareUpdates(prevLength, length);
  }, [length]); // Update existing controllers when "deps" are changed.

  useMemo(function () {
    declareUpdates(0, Math.min(prevLength, length));
  }, deps);
  /** Fill the `updates` array with declarative updates for the given index range. */

  function declareUpdates(startIndex, endIndex) {
    for (var _i = startIndex; _i < endIndex; _i++) {
      var _ctrl = ctrls[_i] || (ctrls[_i] = new Controller(null, state.flush));

      var update = propsFn ? propsFn(_i, _ctrl) : props[_i];

      if (update) {
        update = updates[_i] = declareUpdate(update);

        if (_i == 0) {
          refProp.current = update.ref;
          update.ref = undefined;
        }
      }
    }
  }

  var api = React.useMemo(function () {
    return SpringHandle.create(function () {
      return state.ctrls;
    });
  }, []); // New springs are created during render so users can pass them to
  // their animated components, but new springs aren't cached until the
  // commit phase (see the `useLayoutEffect` callback below).

  var springs = ctrls.map(function (ctrl, i) {
    return getSprings(ctrl, updates[i]);
  });
  var context = useSpringContext();
  reactLayoutEffect.useLayoutEffect(function () {
    layoutId.current++; // Replace the cached controllers.

    state.ctrls = ctrls; // Update the ref prop.

    if (refProp.current) {
      refProp.current.current = api;
    } // Flush the commit queue.


    var queue = state.queue;

    if (queue.length) {
      state.queue = [];
      shared.each(queue, function (cb) {
        return cb();
      });
    } // Dispose unused controllers.


    shared.each(disposed, function (ctrl) {
      return ctrl.dispose();
    }); // Update existing controllers.

    shared.each(ctrls, function (ctrl, i) {
      var values = springs[i];
      setSprings(ctrl, values); // Update the default props.

      ctrl.start({
        "default": context
      }); // Apply updates created during render.

      var update = updates[i];

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

  shared.useOnce(function () {
    return function () {
      shared.each(state.ctrls, function (ctrl) {
        return ctrl.dispose();
      });
    };
  }); // Return a deep copy of the `springs` array so the caller can
  // safely mutate it during render.

  var values = springs.map(function (x) {
    return _extends({}, x);
  });
  return propsFn || arguments.length == 3 ? [values, api.start, api.stop] : values;
}

/**
 * The props that `useSpring` recognizes.
 */

/** @internal */
function useSpring(props, deps) {
  var isFn = shared.is.fun(props);

  var _useSprings = useSprings(1, isFn ? props : [props], isFn ? deps || [] : deps),
      _useSprings$ = _useSprings[0],
      values = _useSprings$[0],
      update = _useSprings[1],
      stop = _useSprings[2];

  return isFn || arguments.length == 2 ? [values, update, stop] : values;
}

function useTrail(length, propsArg, deps) {
  var propsFn = shared.is.fun(propsArg) && propsArg;
  if (propsFn && !deps) deps = [];
  var ctrls = [];
  var result = useSprings(length, function (i, ctrl) {
    ctrls[i] = ctrl;
    return getProps(propsArg, i, ctrl);
  }, // Ensure the props function is called when no deps exist.
  // This works around the 3 argument rule.
  deps || [{}]);
  reactLayoutEffect.useLayoutEffect(function () {
    var reverse = shared.is.obj(propsArg) && propsArg.reverse;

    for (var _i = 0; _i < ctrls.length; _i++) {
      var parent = ctrls[_i + (reverse ? 1 : -1)];
      if (parent) ctrls[_i].update({
        to: parent.springs
      }).start();
    }
  }, deps);

  if (propsFn || arguments.length == 3) {
    var update = result[1];
    result[1] = useMemoOne.useCallbackOne(function (propsArg) {
      var reverse = shared.is.obj(propsArg) && propsArg.reverse;
      return update(function (i, ctrl) {
        var props = getProps(propsArg, i, ctrl);
        var parent = ctrls[i + (reverse ? 1 : -1)];
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
var MOUNT = 'mount';
/** This transition is entering or has entered */

var ENTER = 'enter';
/** This transition had its animations updated */

var UPDATE = 'update';
/** This transition will expire after animating */

var LEAVE = 'leave';

function useTransition(data, props, deps) {
  var ref = props.ref,
      reset = props.reset,
      sort = props.sort,
      _props$trail = props.trail,
      trail = _props$trail === void 0 ? 0 : _props$trail,
      _props$expires = props.expires,
      expires = _props$expires === void 0 ? true : _props$expires; // Every item has its own transition.

  var items = shared.toArray(data);
  var transitions = []; // Keys help with reusing transitions between renders.
  // The `key` prop can be undefined (which means the items themselves are used
  // as keys), or a function (which maps each item to its key), or an array of
  // keys (which are assigned to each item by index).

  var keys = getKeys(items, props); // The "onRest" callbacks need a ref to the latest transitions.

  var usedTransitions = React.useRef(null);
  var prevTransitions = reset ? null : usedTransitions.current;
  reactLayoutEffect.useLayoutEffect(function () {
    usedTransitions.current = transitions;
  }); // Destroy all transitions on dismount.

  shared.useOnce(function () {
    return function () {
      return shared.each(usedTransitions.current, function (t) {
        if (t.expired) {
          clearTimeout(t.expirationId);
        }

        t.ctrl.dispose();
      });
    };
  }); // Map old indices to new indices.

  var reused = [];
  if (prevTransitions) shared.each(prevTransitions, function (t, i) {
    // Expired transitions are not rendered.
    if (t.expired) {
      clearTimeout(t.expirationId);
    } else {
      i = reused[i] = keys.indexOf(t.key);
      if (~i) transitions[i] = t;
    }
  }); // Mount new items with fresh transitions.

  shared.each(items, function (item, i) {
    transitions[i] || (transitions[i] = {
      key: keys[i],
      item: item,
      phase: MOUNT,
      ctrl: new Controller()
    });
  }); // Update the item of any transition whose key still exists,
  // and ensure leaving transitions are rendered until they finish.

  if (reused.length) {
    var i = -1;
    shared.each(reused, function (keyIndex, prevIndex) {
      var t = prevTransitions[prevIndex];

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

  if (shared.is.fun(sort)) {
    transitions.sort(function (a, b) {
      return sort(a.item, b.item);
    });
  } // Track cumulative delay for the "trail" prop.


  var delay = -trail; // Expired transitions use this to dismount.

  var forceUpdate = shared.useForceUpdate(); // These props are inherited by every phase change.

  var defaultProps = getDefaultProps(props); // Generate changes to apply in useEffect.

  var changes = new Map();
  shared.each(transitions, function (t, i) {
    var key = t.key;
    var prevPhase = t.phase;
    var to;
    var phase;

    if (prevPhase == MOUNT) {
      to = props.enter;
      phase = ENTER;
    } else {
      var isLeave = keys.indexOf(key) < 0;

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
    to = shared.is.obj(to) ? inferTo(to) : {
      to: to
    };

    if (!to.config) {
      var config = props.config || defaultProps.config;
      to.config = callProp(config, t.item, i);
    } // The payload is used to update the spring props once the current render is committed.


    var payload = _extends(_extends({}, defaultProps), {}, {
      delay: delay += trail,
      // This prevents implied resets.
      reset: false
    }, to);

    if (phase == ENTER && shared.is.und(payload.from)) {
      // The `initial` prop is used on the first render of our parent component,
      // as well as when `reset: true` is passed. It overrides the `from` prop
      // when defined, and it makes `enter` instant when null.
      var from = shared.is.und(props.initial) || prevTransitions ? props.from : props.initial;
      payload.from = callProp(from, t.item, i);
    }

    var onRest = payload.onRest;

    payload.onRest = function (result) {
      var transitions = usedTransitions.current;
      var t = transitions.find(function (t) {
        return t.key === key;
      });
      if (!t) return;

      if (shared.is.fun(onRest)) {
        onRest(result, t);
      } // Reset the phase of a cancelled enter/leave transition, so it can
      // retry the animation on the next render.


      if (result.cancelled && t.phase != UPDATE) {
        t.phase = prevPhase;
        return;
      }

      if (t.ctrl.idle) {
        var idle = transitions.every(function (t) {
          return t.ctrl.idle;
        });

        if (t.phase == LEAVE) {
          var expiry = callProp(expires, t.item);

          if (expiry !== false) {
            var expiryMs = expiry === true ? 0 : expiry;
            t.expired = true; // Force update once the expiration delay ends.

            if (!idle && expiryMs > 0) {
              // The maximum timeout is 2^31-1
              if (expiryMs <= 0x7fffffff) t.expirationId = setTimeout(forceUpdate, expiryMs);
              return;
            }
          }
        } // Force update once idle and expired items exist.


        if (idle && transitions.some(function (t) {
          return t.expired;
        })) {
          forceUpdate();
        }
      }
    };

    var springs = getSprings(t.ctrl, payload);
    changes.set(t, {
      phase: phase,
      springs: springs,
      payload: payload
    });
  }); // The prop overrides from an ancestor.

  var context = useSpringContext(); // Merge the context into each transition.

  reactLayoutEffect.useLayoutEffect(function () {
    shared.each(transitions, function (t) {
      t.ctrl.start({
        "default": context
      });
    });
  }, [context]);
  var api = React.useMemo(function () {
    return SpringHandle.create(function () {
      return usedTransitions.current.map(function (t) {
        return t.ctrl;
      });
    });
  }, []);
  React.useImperativeHandle(ref, function () {
    return api;
  });
  reactLayoutEffect.useLayoutEffect(function () {
    shared.each(changes, function (_ref, t) {
      var phase = _ref.phase,
          springs = _ref.springs,
          payload = _ref.payload;
      setSprings(t.ctrl, springs);

      if (!context.cancel) {
        t.phase = phase;

        if (phase == ENTER) {
          t.ctrl.start({
            "default": context
          });
        }

        t.ctrl[ref ? 'update' : 'start'](payload);
      }
    });
  }, reset ? void 0 : deps);

  var renderTransitions = function renderTransitions(render) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, transitions.map(function (t, i) {
      var _ref2 = changes.get(t) || t.ctrl,
          springs = _ref2.springs;

      var elem = render(_extends({}, springs), t.item, t, i);
      return elem && elem.type ? /*#__PURE__*/React.createElement(elem.type, _extends({}, elem.props, {
        key: shared.is.str(t.key) || shared.is.num(t.key) ? t.key : t.ctrl.id,
        ref: elem.ref
      })) : elem;
    }));
  };

  return arguments.length == 3 ? [renderTransitions, api.start, api.stop] : renderTransitions;
}

function getKeys(items, _ref3) {
  var key = _ref3.key,
      _ref3$keys = _ref3.keys,
      keys = _ref3$keys === void 0 ? key : _ref3$keys;
  return shared.is.und(keys) ? items : shared.is.fun(keys) ? items.map(keys) : shared.toArray(keys);
}

/**
 * The `Spring` component passes `SpringValue` objects to your render prop.
 */
function Spring(_ref) {
  var children = _ref.children,
      props = _objectWithoutPropertiesLoose(_ref, ["children"]);

  return children(useSpring(props));
}

function Trail(_ref) {
  var items = _ref.items,
      children = _ref.children,
      props = _objectWithoutPropertiesLoose(_ref, ["items", "children"]);

  var trails = useTrail(items.length, props);
  return items.map(function (item, index) {
    var result = children(item, index);
    return shared.is.fun(result) ? result(trails[index]) : result;
  });
}

function Transition(_ref) {
  var items = _ref.items,
      children = _ref.children,
      props = _objectWithoutPropertiesLoose(_ref, ["items", "children"]);

  return /*#__PURE__*/React.createElement(React.Fragment, null, useTransition(items, props)(children));
}

/**
 * An `Interpolation` is a memoized value that's computed whenever one of its
 * `FluidValue` dependencies has its value changed.
 *
 * Other `FrameValue` objects can depend on this. For example, passing an
 * `Interpolation` as the `to` prop of a `useSpring` call will trigger an
 * animation toward the memoized value.
 */

var Interpolation = /*#__PURE__*/function (_FrameValue) {
  _inheritsLoose(Interpolation, _FrameValue);

  /** Useful for debugging. */

  /** Equals false when in the frameloop */

  /** The function that maps inputs values to output */
  function Interpolation(source, args) {
    var _this;

    _this = _FrameValue.call(this) || this;
    _this.source = source;
    _this.key = void 0;
    _this.idle = true;
    _this.calc = void 0;
    _this.calc = shared.createInterpolator.apply(void 0, args);

    var value = _this._get();

    var nodeType = shared.is.arr(value) ? animated.AnimatedArray : animated.AnimatedValue; // Assume the computed value never changes type.

    animated.setAnimated(_assertThisInitialized(_this), nodeType.create(value));
    return _this;
  }

  var _proto = Interpolation.prototype;

  _proto.advance = function advance(_dt) {
    var value = this._get();

    var oldValue = this.get();

    if (!shared.isEqual(value, oldValue)) {
      animated.getAnimated(this).setValue(value);

      this._onChange(value, this.idle);
    }
  };

  _proto._get = function _get() {
    var inputs = shared.is.arr(this.source) ? this.source.map(function (node) {
      return node.get();
    }) : shared.toArray(this.source.get());
    return this.calc.apply(this, inputs);
  };

  _proto._reset = function _reset() {
    shared.each(animated.getPayload(this), function (node) {
      return node.reset();
    });

    _FrameValue.prototype._reset.call(this);
  };

  _proto._start = function _start() {
    this.idle = false;

    _FrameValue.prototype._start.call(this);

    if (G.skipAnimation) {
      this.idle = true;
      this.advance();
    } else {
      G.frameLoop.start(this);
    }
  };

  _proto._attach = function _attach() {
    var _this2 = this;

    // Start observing our "source" once we have an observer.
    var idle = true;
    var priority = 1;
    shared.each(shared.toArray(this.source), function (source) {
      if (isFrameValue(source)) {
        if (!source.idle) idle = false;
        priority = Math.max(priority, source.priority + 1);
      }

      source.addChild(_this2);
    });
    this.priority = priority;

    if (!idle) {
      this._reset();

      this._start();
    }
  };

  _proto._detach = function _detach() {
    var _this3 = this;

    // Stop observing our "source" once we have no observers.
    shared.each(shared.toArray(this.source), function (source) {
      source.removeChild(_this3);
    }); // This removes us from the frameloop.

    this.idle = true;
  }
  /** @internal */
  ;

  _proto.onParentChange = function onParentChange(event) {
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
            this.idle = shared.toArray(this.source).every(function (source) {
              return source.idle !== false;
            });

            if (this.idle) {
              this.advance();
              shared.each(animated.getPayload(this), function (node) {
                node.done = true;
              });
            }
          }
      } // Ensure our priority is greater than all parents, which means
      // our value won't be updated until our parents have updated.
      else if (event.type == 'priority') {
          this.priority = shared.toArray(this.source).reduce(function (max, source) {
            return Math.max(max, (source.priority || 0) + 1);
          }, 0);
        }

    _FrameValue.prototype.onParentChange.call(this, event);
  };

  return Interpolation;
}(FrameValue);

/** Map the value of one or more dependencies */

var to = function to(source) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return new Interpolation(source, args);
};
/** @deprecated Use the `to` export instead */

var interpolate = function interpolate(source) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  return deprecations.deprecateInterpolate(), new Interpolation(source, args);
};
/** Extract the raw value types that are being interpolated */

shared.Globals.assign({
  createStringInterpolator: stringInterpolation.createStringInterpolator,
  to: function to(source, args) {
    return new Interpolation(source, args);
  }
});
/** Advance all animations forward one frame */

var update = function update() {
  return shared.Globals.frameLoop.advance();
};

Object.keys(types).forEach(function (k) {
  if (k !== 'default') Object.defineProperty(exports, k, {
    enumerable: true,
    get: function () {
      return types[k];
    }
  });
});
Object.defineProperty(exports, 'FrameLoop', {
  enumerable: true,
  get: function () {
    return shared.FrameLoop;
  }
});
Object.defineProperty(exports, 'Globals', {
  enumerable: true,
  get: function () {
    return shared.Globals;
  }
});
Object.defineProperty(exports, 'createInterpolator', {
  enumerable: true,
  get: function () {
    return shared.createInterpolator;
  }
});
exports.BailSignal = BailSignal;
exports.Controller = Controller;
exports.FrameValue = FrameValue;
exports.Interpolation = Interpolation;
exports.Spring = Spring;
exports.SpringContext = SpringContext;
exports.SpringHandle = SpringHandle;
exports.SpringValue = SpringValue;
exports.Trail = Trail;
exports.Transition = Transition;
exports.config = config;
exports.inferTo = inferTo;
exports.interpolate = interpolate;
exports.to = to;
exports.update = update;
exports.useChain = useChain;
exports.useSpring = useSpring;
exports.useSprings = useSprings;
exports.useTrail = useTrail;
exports.useTransition = useTransition;
//# sourceMappingURL=index.cjs.js.map
