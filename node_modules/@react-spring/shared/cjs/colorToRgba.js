"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var normalizeColor_1 = require("./normalizeColor");
function colorToRgba(input) {
    var int32Color = normalizeColor_1.normalizeColor(input);
    if (int32Color === null)
        return input;
    int32Color = int32Color || 0;
    var r = (int32Color & 0xff000000) >>> 24;
    var g = (int32Color & 0x00ff0000) >>> 16;
    var b = (int32Color & 0x0000ff00) >>> 8;
    var a = (int32Color & 0x000000ff) / 255;
    return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
}
exports.colorToRgba = colorToRgba;
//# sourceMappingURL=colorToRgba.js.map