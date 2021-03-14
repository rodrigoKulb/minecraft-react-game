'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _objectWithoutPropertiesLoose = _interopDefault(require('@babel/runtime/helpers/objectWithoutPropertiesLoose'));
var core = require('@react-spring/core/index.cjs.js');
var reactDom = require('react-dom');
var stringInterpolation = require('@react-spring/shared/stringInterpolation');
var colorNames = _interopDefault(require('@react-spring/shared/colors'));
var animated$1 = require('@react-spring/animated/index.cjs.js');
var shared = require('@react-spring/shared');
var _inheritsLoose = _interopDefault(require('@babel/runtime/helpers/inheritsLoose'));

var isCustomPropRE = /^--/;

function dangerousStyleValue(name, value) {
  if (value == null || typeof value === 'boolean' || value === '') return '';
  if (typeof value === 'number' && value !== 0 && !isCustomPropRE.test(name) && !(isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name])) return value + 'px'; // Presumes implicit 'px' suffix for unitless numbers

  return ('' + value).trim();
}

var attributeCache = {};
function applyAnimatedValues(instance, props) {
  if (!instance.nodeType || !instance.setAttribute) {
    return false;
  }

  var isFilterElement = instance.nodeName === 'filter' || instance.parentNode && instance.parentNode.nodeName === 'filter';

  var _ref = props,
      style = _ref.style,
      children = _ref.children,
      scrollTop = _ref.scrollTop,
      scrollLeft = _ref.scrollLeft,
      attributes = _objectWithoutPropertiesLoose(_ref, ["style", "children", "scrollTop", "scrollLeft"]);

  var values = Object.values(attributes);
  var names = Object.keys(attributes).map(function (name) {
    return isFilterElement || instance.hasAttribute(name) ? name : attributeCache[name] || (attributeCache[name] = name.replace(/([A-Z])/g, // Attributes are written in dash case
    function (n) {
      return '-' + n.toLowerCase();
    }));
  });
  shared.Globals.frameLoop.onWrite(function () {
    if (children !== void 0) {
      instance.textContent = children;
    } // Apply CSS styles


    for (var name in style) {
      if (style.hasOwnProperty(name)) {
        var value = dangerousStyleValue(name, style[name]);
        if (name === 'float') name = 'cssFloat';else if (isCustomPropRE.test(name)) {
          instance.style.setProperty(name, value);
        } else {
          instance.style[name] = value;
        }
      }
    } // Apply DOM attributes


    names.forEach(function (name, i) {
      instance.setAttribute(name, values[i]);
    });

    if (scrollTop !== void 0) {
      instance.scrollTop = scrollTop;
    }

    if (scrollLeft !== void 0) {
      instance.scrollLeft = scrollLeft;
    }
  });
}
var isUnitlessNumber = {
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  // SVG-related properties
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
};

var prefixKey = function prefixKey(prefix, key) {
  return prefix + key.charAt(0).toUpperCase() + key.substring(1);
};

var prefixes = ['Webkit', 'Ms', 'Moz', 'O'];
isUnitlessNumber = Object.keys(isUnitlessNumber).reduce(function (acc, prop) {
  prefixes.forEach(function (prefix) {
    return acc[prefixKey(prefix, prop)] = acc[prop];
  });
  return acc;
}, isUnitlessNumber);

/** The transform-functions
 * (https://developer.mozilla.org/fr/docs/Web/CSS/transform-function)
 * that you can pass as keys to your animated component style and that will be
 * animated. Perspective has been left out as it would conflict with the
 * non-transform perspective style.
 */

var domTransforms = /^(matrix|translate|scale|rotate|skew)/; // These keys have "px" units by default

var pxTransforms = /^(translate)/; // These keys have "deg" units by default

var degTransforms = /^(rotate|skew)/;

/** Add a unit to the value when the value is unit-less (eg: a number) */
var addUnit = function addUnit(value, unit) {
  return shared.is.num(value) && value !== 0 ? value + unit : value;
};
/**
 * Checks if the input value matches the identity value.
 *
 *     isValueIdentity(0, 0)              // => true
 *     isValueIdentity('0px', 0)          // => true
 *     isValueIdentity([0, '0px', 0], 0)  // => true
 */


var isValueIdentity = function isValueIdentity(value, id) {
  return shared.is.arr(value) ? value.every(function (v) {
    return isValueIdentity(v, id);
  }) : shared.is.num(value) ? value === id : parseFloat(value) === id;
};

/**
 * This AnimatedStyle will simplify animated components transforms by
 * interpolating all transform function passed as keys in the style object
 * including shortcuts such as x, y and z for translateX/Y/Z
 */
var AnimatedStyle = /*#__PURE__*/function (_AnimatedObject) {
  _inheritsLoose(AnimatedStyle, _AnimatedObject);

  function AnimatedStyle(_ref) {
    var x = _ref.x,
        y = _ref.y,
        z = _ref.z,
        style = _objectWithoutPropertiesLoose(_ref, ["x", "y", "z"]);

    /**
     * An array of arrays that contains the values (static or fluid)
     * used by each transform function.
     */
    var inputs = [];
    /**
     * An array of functions that take a list of values (static or fluid)
     * and returns (1) a CSS transform string and (2) a boolean that's true
     * when the transform has no effect (eg: an identity transform).
     */

    var transforms = []; // Combine x/y/z into translate3d

    if (x || y || z) {
      inputs.push([x || 0, y || 0, z || 0]);
      transforms.push(function (xyz) {
        return ["translate3d(" + xyz.map(function (v) {
          return addUnit(v, 'px');
        }).join(',') + ")", // prettier-ignore
        isValueIdentity(xyz, 0)];
      });
    } // Pluck any other transform-related props


    shared.each(style, function (value, key) {
      if (key === 'transform') {
        inputs.push([value || '']);
        transforms.push(function (transform) {
          return [transform, transform === ''];
        });
      } else if (domTransforms.test(key)) {
        delete style[key];
        if (shared.is.und(value)) return;
        var unit = pxTransforms.test(key) ? 'px' : degTransforms.test(key) ? 'deg' : '';
        inputs.push(shared.toArray(value));
        transforms.push(key === 'rotate3d' ? function (_ref2) {
          var x = _ref2[0],
              y = _ref2[1],
              z = _ref2[2],
              deg = _ref2[3];
          return ["rotate3d(" + x + "," + y + "," + z + "," + addUnit(deg, unit) + ")", isValueIdentity(deg, 0)];
        } : function (input) {
          return [key + "(" + input.map(function (v) {
            return addUnit(v, unit);
          }).join(',') + ")", isValueIdentity(input, key.startsWith('scale') ? 1 : 0)];
        });
      }
    });

    if (inputs.length) {
      style.transform = new FluidTransform(inputs, transforms);
    }

    return _AnimatedObject.call(this, style) || this;
  }

  return AnimatedStyle;
}(animated$1.AnimatedObject);
/** @internal */

var FluidTransform = /*#__PURE__*/function (_FluidValue) {
  _inheritsLoose(FluidTransform, _FluidValue);

  function FluidTransform(inputs, transforms) {
    var _this;

    _this = _FluidValue.call(this) || this;
    _this.inputs = inputs;
    _this.transforms = transforms;
    _this._value = null;
    _this._children = new Set();
    return _this;
  }

  var _proto = FluidTransform.prototype;

  _proto.get = function get() {
    return this._value || (this._value = this._get());
  };

  _proto._get = function _get() {
    var _this2 = this;

    var transform = '';
    var identity = true;
    shared.each(this.inputs, function (input, i) {
      var arg1 = shared.getFluidValue(input[0]);

      var _this2$transforms$i = _this2.transforms[i](shared.is.arr(arg1) ? arg1 : input.map(shared.getFluidValue)),
          t = _this2$transforms$i[0],
          id = _this2$transforms$i[1];

      transform += ' ' + t;
      identity = identity && id;
    });
    return identity ? 'none' : transform;
  };

  _proto.addChild = function addChild(child) {
    var _this3 = this;

    if (!this._children.size) {
      // Start observing our inputs once we have an observer.
      shared.each(this.inputs, function (input) {
        return shared.each(input, function (value) {
          var config = shared.getFluidConfig(value);
          if (config) config.addChild(_this3);
        });
      });
    }

    this._children.add(child);
  };

  _proto.removeChild = function removeChild(child) {
    var _this4 = this;

    this._children["delete"](child);

    if (!this._children.size) {
      // Stop observing our inputs once we have no observers.
      shared.each(this.inputs, function (input) {
        return shared.each(input, function (value) {
          var config = shared.getFluidConfig(value);
          if (config) config.removeChild(_this4);
        });
      });
    }
  };

  _proto.onParentChange = function onParentChange(event) {
    if (event.type == 'change') {
      this._value = null;
    }

    shared.each(this._children, function (child) {
      child.onParentChange(event);
    });
  };

  return FluidTransform;
}(shared.FluidValue);

var primitives = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr', // SVG
'circle', 'clipPath', 'defs', 'ellipse', 'foreignObject', 'g', 'image', 'line', 'linearGradient', 'mask', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'stop', 'svg', 'text', 'tspan'];

core.Globals.assign({
  colorNames: colorNames,
  createStringInterpolator: stringInterpolation.createStringInterpolator,
  batchedUpdates: reactDom.unstable_batchedUpdates
});
var host = animated$1.createHost(primitives, {
  applyAnimatedValues: applyAnimatedValues,
  createAnimatedStyle: function createAnimatedStyle(style) {
    return new AnimatedStyle(style);
  },
  getComponentProps: function getComponentProps(_ref) {
    var scrollTop = _ref.scrollTop,
        scrollLeft = _ref.scrollLeft,
        props = _objectWithoutPropertiesLoose(_ref, ["scrollTop", "scrollLeft"]);

    return props;
  }
});
var animated = host.animated;

Object.keys(core).forEach(function (k) {
  if (k !== 'default') Object.defineProperty(exports, k, {
    enumerable: true,
    get: function () {
      return core[k];
    }
  });
});
exports.a = animated;
exports.animated = animated;
//# sourceMappingURL=index.cjs.js.map
