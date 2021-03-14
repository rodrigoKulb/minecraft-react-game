// const INTEGER = '[-+]?\\d+';
var NUMBER = '[-+]?\\d*\\.?\\d+';
var PERCENTAGE = NUMBER + '%';
function call() {
    var parts = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        parts[_i] = arguments[_i];
    }
    return '\\(\\s*(' + parts.join(')\\s*,\\s*(') + ')\\s*\\)';
}
export var rgb = new RegExp('rgb' + call(NUMBER, NUMBER, NUMBER));
export var rgba = new RegExp('rgba' + call(NUMBER, NUMBER, NUMBER, NUMBER));
export var hsl = new RegExp('hsl' + call(NUMBER, PERCENTAGE, PERCENTAGE));
export var hsla = new RegExp('hsla' + call(NUMBER, PERCENTAGE, PERCENTAGE, NUMBER));
export var hex3 = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/;
export var hex4 = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/;
export var hex6 = /^#([0-9a-fA-F]{6})$/;
export var hex8 = /^#([0-9a-fA-F]{8})$/;
//# sourceMappingURL=colorMatchers.js.map