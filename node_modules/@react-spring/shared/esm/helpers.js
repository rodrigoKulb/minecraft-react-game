import * as G from './globals';
export var noop = function () { };
export var defineHidden = function (obj, key, value) {
    return Object.defineProperty(obj, key, { value: value, writable: true, configurable: true });
};
export var is = {
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
export function isEqual(a, b) {
    if (is.arr(a)) {
        if (!is.arr(b) || a.length !== b.length)
            return false;
        for (var i = 0; i < a.length; i++) {
            if (a[i] !== b[i])
                return false;
        }
        return true;
    }
    return a === b;
}
// Not all strings can be animated (eg: {display: "none"})
export var isAnimatedString = function (value) {
    return is.str(value) &&
        (value[0] == '#' ||
            /\d/.test(value) ||
            !!(G.colorNames && G.colorNames[value]));
};
/** An unsafe object/array/set iterator that allows for better minification */
export var each = function (obj, cb, ctx) {
    if (is.fun(obj.forEach)) {
        obj.forEach(cb, ctx);
    }
    else {
        Object.keys(obj).forEach(function (key) {
            return cb.call(ctx, obj[key], key);
        });
    }
};
export var toArray = function (a) {
    return is.und(a) ? [] : is.arr(a) ? a : [a];
};
export function flush(queue, iterator) {
    if (queue.size) {
        var items = Array.from(queue);
        queue.clear();
        each(items, iterator);
    }
}
//# sourceMappingURL=helpers.js.map