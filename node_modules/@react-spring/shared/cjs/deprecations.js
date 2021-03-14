"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prefix = 'react-spring: ';
var flagInterpolate = false;
function deprecateInterpolate() {
    if (!flagInterpolate) {
        flagInterpolate = true;
        console.warn(prefix +
            'The "interpolate" function is deprecated in v10 (use "to" instead)');
    }
}
exports.deprecateInterpolate = deprecateInterpolate;
//# sourceMappingURL=deprecations.js.map