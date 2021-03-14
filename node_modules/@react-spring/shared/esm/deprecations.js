var prefix = 'react-spring: ';
var flagInterpolate = false;
export function deprecateInterpolate() {
    if (!flagInterpolate) {
        flagInterpolate = true;
        console.warn(prefix +
            'The "interpolate" function is deprecated in v10 (use "to" instead)');
    }
}
//# sourceMappingURL=deprecations.js.map