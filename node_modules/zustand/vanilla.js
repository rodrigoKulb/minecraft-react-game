'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function create(createState) {
  var state;
  var listeners = new Set();

  var setState = function setState(partial, replace) {
    var nextState = typeof partial === 'function' ? partial(state) : partial;

    if (nextState !== state) {
      var previousState = state;
      state = replace ? nextState : Object.assign({}, state, nextState);
      listeners.forEach(function (listener) {
        return listener(state, previousState);
      });
    }
  };

  var getState = function getState() {
    return state;
  };

  var subscribeWithSelector = function subscribeWithSelector(listener, selector, equalityFn) {
    if (selector === void 0) {
      selector = getState;
    }

    if (equalityFn === void 0) {
      equalityFn = Object.is;
    }

    var currentSlice = selector(state);

    function listenerToAdd() {
      var nextSlice = selector(state);

      if (!equalityFn(currentSlice, nextSlice)) {
        var previousSlice = currentSlice;
        listener(currentSlice = nextSlice, previousSlice);
      }
    }

    listeners.add(listenerToAdd); // Unsubscribe

    return function () {
      return listeners.delete(listenerToAdd);
    };
  };

  var subscribe = function subscribe(listener, selector, equalityFn) {
    if (selector || equalityFn) {
      return subscribeWithSelector(listener, selector, equalityFn);
    }

    listeners.add(listener); // Unsubscribe

    return function () {
      return listeners.delete(listener);
    };
  };

  var destroy = function destroy() {
    return listeners.clear();
  };

  var api = {
    setState: setState,
    getState: getState,
    subscribe: subscribe,
    destroy: destroy
  };
  state = createState(setState, getState, api);
  return api;
}

exports.default = create;
