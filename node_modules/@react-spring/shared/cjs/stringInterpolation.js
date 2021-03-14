"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fluids_1 = require("fluids");
var createInterpolator_1 = require("./createInterpolator");
var colorToRgba_1 = require("./colorToRgba");
var G = require("./globals");
// Problem: https://github.com/animatedjs/animated/pull/102
// Solution: https://stackoverflow.com/questions/638565/parsing-scientific-notation-sensibly/658662
var numberRegex = /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
// Covers rgb, rgba, hsl, hsla
// Taken from https://gist.github.com/olmokramer/82ccce673f86db7cda5e
var colorRegex = /(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/gi;
// Covers color names (transparent, blue, etc.)
var colorNamesRegex;
// rgba requires that the r,g,b are integers.... so we want to round them,
// but we *dont* want to round the opacity (4th column).
var rgbaRegex = /rgba\(([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+)\)/gi;
var rgbaRound = function (_, p1, p2, p3, p4) {
    return "rgba(" + Math.round(p1) + ", " + Math.round(p2) + ", " + Math.round(p3) + ", " + p4 + ")";
};
/**
 * Supports string shapes by extracting numbers so new values can be computed,
 * and recombines those values into new strings of the same shape.  Supports
 * things like:
 *
 *     "rgba(123, 42, 99, 0.36)"           // colors
 *     "-45deg"                            // values with units
 *     "0 2px 2px 0px rgba(0, 0, 0, 0.12)" // CSS box-shadows
 *     "rotate(0deg) translate(2px, 3px)"  // CSS transforms
 */
exports.createStringInterpolator = function (config) {
    if (!colorNamesRegex)
        colorNamesRegex = G.colorNames
            ? new RegExp("(" + Object.keys(G.colorNames).join('|') + ")", 'g')
            : /^\b$/; // never match
    // Convert colors to rgba(...)
    var output = config.output.map(function (value) {
        return fluids_1.getFluidValue(value)
            .replace(colorRegex, colorToRgba_1.colorToRgba)
            .replace(colorNamesRegex, colorToRgba_1.colorToRgba);
    });
    // Convert ["1px 2px", "0px 0px"] into [[1, 2], [0, 0]]
    var keyframes = output.map(function (value) { return value.match(numberRegex).map(Number); });
    // Convert ["1px 2px", "0px 0px"] into [[1, 0], [2, 0]]
    var outputRanges = keyframes[0].map(function (_, i) {
        return keyframes.map(function (values) {
            if (!(i in values)) {
                throw Error('The arity of each "output" value must be equal');
            }
            return values[i];
        });
    });
    // Create an interpolator for each animated number
    var interpolators = outputRanges.map(function (output) {
        return createInterpolator_1.createInterpolator(tslib_1.__assign(tslib_1.__assign({}, config), { output: output }));
    });
    // Use the first `output` as a template for each call
    return function (input) {
        var i = 0;
        return output[0]
            .replace(numberRegex, function () { return String(interpolators[i++](input)); })
            .replace(rgbaRegex, rgbaRound);
    };
};
//# sourceMappingURL=stringInterpolation.js.map