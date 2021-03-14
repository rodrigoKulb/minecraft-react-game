"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var G = require("./globals");
// The global `requestAnimationFrame` must be dereferenced to avoid "Illegal invocation" errors
var requestAnimationFrame = function (fn) {
    return (void 0, G.requestAnimationFrame)(fn);
};
/**
 * FrameLoop executes its animations in order of lowest priority first.
 * Animations are retained until idle.
 */
var FrameLoop = /** @class */ (function () {
    function FrameLoop(raf) {
        if (raf === void 0) { raf = requestAnimationFrame; }
        var idle = true;
        var writing = false;
        // The most recent framestamp
        var lastTime = 0;
        // The active animations for the current frame, sorted by lowest priority first
        var animations = [];
        // The priority of the currently advancing animation.
        // To protect against a race condition whenever a frame is being processed,
        // where the filtering of `animations` is corrupted with a shifting index,
        // causing animations to potentially advance 2x faster than intended.
        var priority = 0;
        // Animations starting on the next frame
        var startQueue = new Set();
        // Flushed after all animations are updated.
        // Used to dispatch events to an "onFrame" prop, for example.
        var frameQueue = new Set();
        // Flushed at the very end of each frame.
        // Used to avoid layout thrashing in @react-spring/web, for example.
        var writeQueue = new Set();
        // Add an animation to the frameloop
        var start = function (animation) {
            var index = animations.indexOf(animation);
            if (index < 0) {
                index = animations.findIndex(function (other) { return other.priority > animation.priority; });
                animations.splice(~index ? index : animations.length, 0, animation);
            }
        };
        var loop = function () {
            if (idle)
                return;
            try {
                advance();
                raf(loop);
            }
            catch (e) {
                console.error(e);
            }
        };
        // Start the frameloop
        var kickoff = function () {
            if (idle) {
                idle = false;
                // To minimize frame skips, the frameloop never stops.
                if (lastTime == 0) {
                    lastTime = G.now();
                    raf(loop);
                }
            }
        };
        var timeoutQueue = [];
        this.setTimeout = function (handler, ms) {
            var time = G.now() + ms;
            var cancel = function () {
                var index = timeoutQueue.findIndex(function (t) { return t.cancel == cancel; });
                if (index >= 0) {
                    timeoutQueue.splice(index, 1);
                }
            };
            var index = findIndex(timeoutQueue, function (t) { return t.time > time; });
            var timeout = { time: time, handler: handler, cancel: cancel };
            timeoutQueue.splice(index, 0, timeout);
            kickoff();
            return timeout;
        };
        // Process the current frame.
        var advance = (this.advance = function () {
            var time = G.now();
            // Start animations that were added during last frame.
            if (startQueue.size) {
                startQueue.forEach(start);
                startQueue.clear();
            }
            // Flush the timeout queue.
            if (timeoutQueue.length) {
                G.batchedUpdates(function () {
                    var count = findIndex(timeoutQueue, function (t) { return t.time > time; });
                    timeoutQueue.splice(0, count).forEach(function (t) { return t.handler(); });
                });
            }
            if (time > lastTime) {
                // http://gafferongames.com/game-physics/fix-your-timestep/
                var dt_1 = Math.min(64, time - lastTime);
                lastTime = time;
                G.batchedUpdates(function () {
                    // Animations can be added while the frameloop is updating,
                    // but they need a higher priority to be started on this frame.
                    if (animations.length) {
                        G.willAdvance(animations);
                        animations = animations.filter(function (animation) {
                            priority = animation.priority;
                            // Animations may go idle before the next frame.
                            if (!animation.idle) {
                                animation.advance(dt_1);
                            }
                            // Remove idle animations.
                            return !animation.idle;
                        });
                        priority = 0;
                    }
                    if (frameQueue.size) {
                        frameQueue.forEach(function (onFrame) { return onFrame(time); });
                        frameQueue.clear();
                    }
                    if (writeQueue.size) {
                        writing = true;
                        writeQueue.forEach(function (write) { return write(time); });
                        writeQueue.clear();
                        writing = false;
                    }
                });
            }
        });
        this.start = function (animation) {
            if (priority > animation.priority) {
                startQueue.add(animation);
            }
            else {
                start(animation);
                kickoff();
            }
        };
        this.onFrame = function (cb) {
            frameQueue.add(cb);
            kickoff();
        };
        this.onWrite = function (cb) {
            if (writing)
                cb(lastTime);
            else
                writeQueue.add(cb);
        };
        // Expose internals for testing.
        if (typeof process !== 'undefined' &&
            process.env.NODE_ENV !== 'production') {
            var dispose_1 = function () {
                idle = true;
                startQueue.clear();
                timeoutQueue.length = 0;
            };
            Object.defineProperties(this, {
                _animations: { get: function () { return animations; } },
                _dispose: { get: function () { return dispose_1; } },
            });
        }
    }
    return FrameLoop;
}());
exports.FrameLoop = FrameLoop;
/** Like `Array.prototype.findIndex` but returns `arr.length` instead of `-1` */
function findIndex(arr, test) {
    var index = arr.findIndex(test);
    return index < 0 ? arr.length : index;
}
//# sourceMappingURL=FrameLoop.js.map