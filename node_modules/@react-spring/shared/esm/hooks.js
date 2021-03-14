import { useEffect, useRef, useState } from 'react';
export var useOnce = function (effect) { return useEffect(effect, []); };
/** Return a function that re-renders this component, if still mounted */
export var useForceUpdate = function () {
    var update = useState(0)[1];
    var unmounted = useRef(false);
    useOnce(function () { return function () {
        unmounted.current = true;
    }; });
    return function () {
        if (!unmounted.current) {
            update({});
        }
    };
};
/** Use a value from the previous render */
export function usePrev(value) {
    var prevRef = useRef(undefined);
    useEffect(function () {
        prevRef.current = value;
    });
    return prevRef.current;
}
//# sourceMappingURL=hooks.js.map