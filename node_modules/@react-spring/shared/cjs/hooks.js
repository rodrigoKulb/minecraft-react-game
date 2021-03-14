"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
exports.useOnce = function (effect) { return react_1.useEffect(effect, []); };
/** Return a function that re-renders this component, if still mounted */
exports.useForceUpdate = function () {
    var update = react_1.useState(0)[1];
    var unmounted = react_1.useRef(false);
    exports.useOnce(function () { return function () {
        unmounted.current = true;
    }; });
    return function () {
        if (!unmounted.current) {
            update({});
        }
    };
};
/** Use a value from the previous render */
function usePrev(value) {
    var prevRef = react_1.useRef(undefined);
    react_1.useEffect(function () {
        prevRef.current = value;
    });
    return prevRef.current;
}
exports.usePrev = usePrev;
//# sourceMappingURL=hooks.js.map