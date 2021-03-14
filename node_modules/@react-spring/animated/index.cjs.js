'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var shared = require('@react-spring/shared');
var _inheritsLoose = _interopDefault(require('@babel/runtime/helpers/inheritsLoose'));
var _assertThisInitialized = _interopDefault(require('@babel/runtime/helpers/assertThisInitialized'));
var _extends = _interopDefault(require('@babel/runtime/helpers/extends'));
var G = require('@react-spring/shared/globals');
var React = require('react');
var reactLayoutEffect = require('react-layout-effect');

var $node = Symbol["for"]('Animated:node');
var isAnimated = function isAnimated(value) {
  return !!value && value[$node] === value;
};
/** Get the owner's `Animated` node. */

var getAnimated = function getAnimated(owner) {
  return owner && owner[$node];
};
/** Set the owner's `Animated` node. */

var setAnimated = function setAnimated(owner, node) {
  return shared.defineHidden(owner, $node, node);
};
/** Get every `AnimatedValue` in the owner's `Animated` node. */

var getPayload = function getPayload(owner) {
  return owner && owner[$node] && owner[$node].getPayload();
};
var Animated = /*#__PURE__*/function () {
  /** The cache of animated values */
  function Animated() {
    this.payload = void 0;
    // This makes "isAnimated" return true.
    setAnimated(this, this);
  }
  /** Get the current value. Pass `true` for only animated values. */


  var _proto = Animated.prototype;

  /** Get every `AnimatedValue` used by this node. */
  _proto.getPayload = function getPayload() {
    return this.payload || [];
  };

  return Animated;
}();

/** An animated number or a native attribute value */

var AnimatedValue = /*#__PURE__*/function (_Animated) {
  _inheritsLoose(AnimatedValue, _Animated);

  function AnimatedValue(_value) {
    var _this;

    _this = _Animated.call(this) || this;
    _this._value = _value;
    _this.done = true;
    _this.elapsedTime = void 0;
    _this.lastPosition = void 0;
    _this.lastVelocity = void 0;
    _this.v0 = void 0;

    if (shared.is.num(_this._value)) {
      _this.lastPosition = _this._value;
    }

    return _this;
  }

  AnimatedValue.create = function create(from, _to) {
    return new AnimatedValue(from);
  };

  var _proto = AnimatedValue.prototype;

  _proto.getPayload = function getPayload() {
    return [this];
  };

  _proto.getValue = function getValue() {
    return this._value;
  }
  /**
   * Set the current value and optionally round it.
   *
   * The `step` argument does nothing whenever it equals `undefined` or `0`.
   * It works with fractions and whole numbers. The best use case is (probably)
   * rounding to the pixel grid with a step of:
   *
   *      1 / window.devicePixelRatio
   */
  ;

  _proto.setValue = function setValue(value, step) {
    if (shared.is.num(value)) {
      this.lastPosition = value;

      if (step) {
        value = Math.round(value / step) * step;

        if (this.done) {
          this.lastPosition = value;
        }
      }
    }

    if (this._value === value) {
      return false;
    }

    this._value = value;
    return true;
  };

  _proto.reset = function reset() {
    var done = this.done;
    this.done = false;

    if (shared.is.num(this._value)) {
      this.elapsedTime = 0;
      this.lastPosition = this._value;
      if (done) this.lastVelocity = null;
      this.v0 = null;
    }
  };

  return AnimatedValue;
}(Animated);

var AnimatedString = /*#__PURE__*/function (_AnimatedValue) {
  _inheritsLoose(AnimatedString, _AnimatedValue);

  function AnimatedString(from, to) {
    var _this;

    _this = _AnimatedValue.call(this, 0) || this;
    _this._value = void 0;
    _this._string = null;
    _this._toString = void 0;
    _this._toString = shared.createInterpolator({
      output: [from, to]
    });
    return _this;
  }

  AnimatedString.create = function create(from, to) {
    if (to === void 0) {
      to = from;
    }

    if (shared.is.str(from) && shared.is.str(to)) {
      return new AnimatedString(from, to);
    }

    throw TypeError('Expected "from" and "to" to be strings');
  };

  var _proto = AnimatedString.prototype;

  _proto.getValue = function getValue() {
    var value = this._string;
    return value == null ? this._string = this._toString(this._value) : value;
  };

  _proto.setValue = function setValue(value) {
    if (!shared.is.num(value)) {
      this._string = value;
      this._value = 1;
    } else if (_AnimatedValue.prototype.setValue.call(this, value)) {
      this._string = null;
    } else {
      return false;
    }

    return true;
  };

  _proto.reset = function reset(goal) {
    if (goal) {
      this._toString = shared.createInterpolator({
        output: [this.getValue(), goal]
      });
    }

    this._value = 0;

    _AnimatedValue.prototype.reset.call(this);
  };

  return AnimatedString;
}(AnimatedValue);

var TreeContext = {
  current: null
};

/** An object containing `Animated` nodes */
var AnimatedObject = /*#__PURE__*/function (_Animated) {
  _inheritsLoose(AnimatedObject, _Animated);

  function AnimatedObject(source) {
    var _this;

    if (source === void 0) {
      source = null;
    }

    _this = _Animated.call(this) || this;
    _this.source = void 0;

    _this.setValue(source);

    return _this;
  }

  var _proto = AnimatedObject.prototype;

  _proto.getValue = function getValue(animated) {
    if (!this.source) return null;
    var values = {};
    shared.each(this.source, function (source, key) {
      if (isAnimated(source)) {
        values[key] = source.getValue(animated);
      } else {
        var config = shared.getFluidConfig(source);

        if (config) {
          values[key] = config.get();
        } else if (!animated) {
          values[key] = source;
        }
      }
    });
    return values;
  }
  /** Replace the raw object data */
  ;

  _proto.setValue = function setValue(source) {
    this.source = source;
    this.payload = this._makePayload(source);
  };

  _proto.reset = function reset() {
    if (this.payload) {
      shared.each(this.payload, function (node) {
        return node.reset();
      });
    }
  }
  /** Create a payload set. */
  ;

  _proto._makePayload = function _makePayload(source) {
    if (source) {
      var payload = new Set();
      shared.each(source, this._addToPayload, payload);
      return Array.from(payload);
    }
  }
  /** Add to a payload set. */
  ;

  _proto._addToPayload = function _addToPayload(source) {
    var _this2 = this;

    var config = shared.getFluidConfig(source);

    if (config && TreeContext.current) {
      TreeContext.current.dependencies.add(source);
    }

    var payload = getPayload(source);

    if (payload) {
      shared.each(payload, function (node) {
        return _this2.add(node);
      });
    }
  };

  return AnimatedObject;
}(Animated);

/** An array of animated nodes */
var AnimatedArray = /*#__PURE__*/function (_AnimatedObject) {
  _inheritsLoose(AnimatedArray, _AnimatedObject);

  function AnimatedArray(from, to) {
    var _this;

    _this = _AnimatedObject.call(this, null) || this;
    _this.source = void 0;

    _AnimatedObject.prototype.setValue.call(_assertThisInitialized(_this), _this._makeAnimated(from, to));

    return _this;
  }

  AnimatedArray.create = function create(from, to) {
    return new AnimatedArray(from, to);
  };

  var _proto = AnimatedArray.prototype;

  _proto.getValue = function getValue() {
    return this.source.map(function (node) {
      return node.getValue();
    });
  };

  _proto.setValue = function setValue(newValue) {
    var payload = this.getPayload(); // Reuse the payload when lengths are equal.

    if (newValue && newValue.length == payload.length) {
      shared.each(payload, function (node, i) {
        return node.setValue(newValue[i]);
      });
    } else {
      // Remake the payload when length changes.
      this.source = this._makeAnimated(newValue);
      this.payload = this._makePayload(this.source);
    }
  }
  /** Convert the `from` and `to` values to an array of `Animated` nodes */
  ;

  _proto._makeAnimated = function _makeAnimated(from, to) {
    if (to === void 0) {
      to = from;
    }

    return from ? from.map(function (from, i) {
      return (shared.isAnimatedString(from) ? AnimatedString : AnimatedValue).create(from, to[i]);
    }) : [];
  };

  return AnimatedArray;
}(AnimatedObject);

var AnimatedProps = /*#__PURE__*/function (_AnimatedObject) {
  _inheritsLoose(AnimatedProps, _AnimatedObject);

  /** Equals true when an update is scheduled for "end of frame" */
  function AnimatedProps(update) {
    var _this;

    _this = _AnimatedObject.call(this, null) || this;
    _this.update = update;
    _this.dirty = false;
    return _this;
  }

  var _proto = AnimatedProps.prototype;

  _proto.setValue = function setValue(props, context) {
    if (!props) return; // The constructor passes null.

    if (context) {
      TreeContext.current = context;

      if (props.style) {
        var createAnimatedStyle = context.host.createAnimatedStyle;
        props = _extends(_extends({}, props), {}, {
          style: createAnimatedStyle(props.style)
        });
      }
    }

    _AnimatedObject.prototype.setValue.call(this, props);

    TreeContext.current = null;
  }
  /** @internal */
  ;

  _proto.onParentChange = function onParentChange(_ref) {
    var _this2 = this;

    var type = _ref.type;

    if (!this.dirty && type === 'change') {
      this.dirty = true;
      G.frameLoop.onFrame(function () {
        _this2.dirty = false;

        _this2.update();
      });
    }
  };

  return AnimatedProps;
}(AnimatedObject);

var withAnimated = function withAnimated(Component, host) {
  return React.forwardRef(function (rawProps, ref) {
    var instanceRef = React.useRef(null);
    var hasInstance = // Function components must use "forwardRef" to avoid being
    // re-rendered on every animation frame.
    !shared.is.fun(Component) || Component.prototype && Component.prototype.isReactComponent;
    var forceUpdate = shared.useForceUpdate();
    var props = new AnimatedProps(function () {
      var instance = instanceRef.current;

      if (hasInstance && !instance) {
        return; // The wrapped component forgot to forward its ref.
      }

      var didUpdate = instance ? host.applyAnimatedValues(instance, props.getValue(true)) : false; // Re-render the component when native updates fail.

      if (didUpdate === false) {
        forceUpdate();
      }
    });
    var dependencies = new Set();
    props.setValue(rawProps, {
      dependencies: dependencies,
      host: host
    });
    reactLayoutEffect.useLayoutEffect(function () {
      shared.each(dependencies, function (dep) {
        return dep.addChild(props);
      });
      return function () {
        return shared.each(dependencies, function (dep) {
          return dep.removeChild(props);
        });
      };
    });
    return /*#__PURE__*/React.createElement(Component, _extends({}, host.getComponentProps(props.getValue()), {
      ref: hasInstance && function (value) {
        instanceRef.current = updateRef(ref, value);
      }
    }));
  });
};

function updateRef(ref, value) {
  if (ref) {
    if (shared.is.fun(ref)) ref(value);else ref.current = value;
  }

  return value;
}

// For storing the animated version on the original component
var cacheKey = Symbol["for"]('AnimatedComponent');
var createHost = function createHost(components, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$applyAnimatedVal = _ref.applyAnimatedValues,
      applyAnimatedValues = _ref$applyAnimatedVal === void 0 ? function () {
    return false;
  } : _ref$applyAnimatedVal,
      _ref$createAnimatedSt = _ref.createAnimatedStyle,
      createAnimatedStyle = _ref$createAnimatedSt === void 0 ? function (style) {
    return new AnimatedObject(style);
  } : _ref$createAnimatedSt,
      _ref$getComponentProp = _ref.getComponentProps,
      getComponentProps = _ref$getComponentProp === void 0 ? function (props) {
    return props;
  } : _ref$getComponentProp;

  var hostConfig = {
    applyAnimatedValues: applyAnimatedValues,
    createAnimatedStyle: createAnimatedStyle,
    getComponentProps: getComponentProps
  };

  var animated = function animated(Component) {
    var displayName = getDisplayName(Component) || 'Anonymous';

    if (shared.is.str(Component)) {
      Component = withAnimated(Component, hostConfig);
    } else {
      Component = Component[cacheKey] || (Component[cacheKey] = withAnimated(Component, hostConfig));
    }

    Component.displayName = "Animated(" + displayName + ")";
    return Component;
  };

  shared.each(components, function (Component, key) {
    if (!shared.is.str(key)) {
      key = getDisplayName(Component);
    }

    animated[key] = animated(Component);
  });
  return {
    animated: animated
  };
};

var getDisplayName = function getDisplayName(arg) {
  return shared.is.str(arg) ? arg : arg && shared.is.str(arg.displayName) ? arg.displayName : shared.is.fun(arg) && arg.name || null;
};

exports.Animated = Animated;
exports.AnimatedArray = AnimatedArray;
exports.AnimatedObject = AnimatedObject;
exports.AnimatedProps = AnimatedProps;
exports.AnimatedString = AnimatedString;
exports.AnimatedValue = AnimatedValue;
exports.createHost = createHost;
exports.getAnimated = getAnimated;
exports.getPayload = getPayload;
exports.isAnimated = isAnimated;
exports.setAnimated = setAnimated;
//# sourceMappingURL=index.cjs.js.map
