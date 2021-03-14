"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
exports.useLayoutEffect = typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
    ? React.useLayoutEffect
    : React.useEffect;
