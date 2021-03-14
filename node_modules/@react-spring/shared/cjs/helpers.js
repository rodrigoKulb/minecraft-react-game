"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var G = require("./globals");
exports.noop = function () { };
exports.defineHidden = function (obj, key, value) {
    return Object.defineProperty(obj, key, { value: value, writable: true, configurable: true });
};
exports.is = {
    arr: Array.isArray,
    obj: function (a) {
        return !!a && a.constructor.name === 'Object';
    },
    fun: function (a) { return typeof a === 'function'; },
    str: function (a) { return typeof a === 'string'; },
    num: function (a) { return typeof a === 'number'; },
    und: function (a) { return a === undefined; },
};
/** Compare animatable values */
function isEqual(a, b) {
    if (exports.is.arr(a)) {
        if (!exports.is.arr(b) || a.length !== b.length)
            return false;
        for (var i = 0; i < a.length; i++) {
            if (a[i] !== b[i])
                return false;
        }
        return true;
    }
    return a === b;
}
exports.isEqual = isEqual;
// Not all strings can be animated (eg: {display: "none"})
exports.isAnimatedString = function (value) {
    return exports.is.str(value) &&
        (value[0] == '#' ||
            /\d/.test(value) ||
            !!(G.colorNames && G.colorNames[value]));
};
/** An unsafe object/array/set iterator that allows for better minification */
exports.each = function (obj, cb, ctx) {
    if (exports.is.fun(obj.forEach)) {
        obj.forEach(cb, ctx);
    }
    else {
        Object.keys(obj).forEach(function (key) {
            return cb.call(ctx, obj[key], key);
        });
    }
};
exports.toArray = function (a) {
    return exports.is.und(a) ? [] : exports.is.arr(a) ? a : [a];
};
function flush(queue, iterator) {
    if (queue.size) {
        var items = Array.from(queue);
        queue.clear();
        exports.each(items, iterator);
    }
}
exports.flush = flush;
//# sourceMappingURL=helpers.js.map