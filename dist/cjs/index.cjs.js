'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-5f6f12ab.js');
const setProperty = require('./set-property-88176225.js');

const dateTimestampProvider = {
    now() {
        return (dateTimestampProvider.delegate || Date).now();
    },
    delegate: undefined,
};

class ReplaySubject extends setProperty.Subject {
    constructor(_bufferSize = Infinity, _windowTime = Infinity, _timestampProvider = dateTimestampProvider) {
        super();
        this._bufferSize = _bufferSize;
        this._windowTime = _windowTime;
        this._timestampProvider = _timestampProvider;
        this._buffer = [];
        this._infiniteTimeWindow = true;
        this._infiniteTimeWindow = _windowTime === Infinity;
        this._bufferSize = Math.max(1, _bufferSize);
        this._windowTime = Math.max(1, _windowTime);
    }
    next(value) {
        const { isStopped, _buffer, _infiniteTimeWindow, _timestampProvider, _windowTime } = this;
        if (!isStopped) {
            _buffer.push(value);
            !_infiniteTimeWindow && _buffer.push(_timestampProvider.now() + _windowTime);
        }
        this._trimBuffer();
        super.next(value);
    }
    _subscribe(subscriber) {
        this._throwIfClosed();
        this._trimBuffer();
        const subscription = this._innerSubscribe(subscriber);
        const { _infiniteTimeWindow, _buffer } = this;
        const copy = _buffer.slice();
        for (let i = 0; i < copy.length && !subscriber.closed; i += _infiniteTimeWindow ? 1 : 2) {
            subscriber.next(copy[i]);
        }
        this._checkFinalizedStatuses(subscriber);
        return subscription;
    }
    _trimBuffer() {
        const { _bufferSize, _timestampProvider, _buffer, _infiniteTimeWindow } = this;
        const adjustedBufferSize = (_infiniteTimeWindow ? 1 : 2) * _bufferSize;
        _bufferSize < Infinity && adjustedBufferSize < _buffer.length && _buffer.splice(0, _buffer.length - adjustedBufferSize);
        if (!_infiniteTimeWindow) {
            const now = _timestampProvider.now();
            let last = 0;
            for (let i = 1; i < _buffer.length && _buffer[i] <= now; i += 2) {
                last = i;
            }
            last && _buffer.splice(0, last + 1);
        }
    }
}

function map(project, thisArg) {
    return setProperty.operate((source, subscriber) => {
        let index = 0;
        source.subscribe(setProperty.createOperatorSubscriber(subscriber, (value) => {
            subscriber.next(project.call(thisArg, value, index++));
        }));
    });
}

function mergeInternals(source, subscriber, project, concurrent, onBeforeNext, expand, innerSubScheduler, additionalFinalizer) {
    const buffer = [];
    let active = 0;
    let index = 0;
    let isComplete = false;
    const checkComplete = () => {
        if (isComplete && !buffer.length && !active) {
            subscriber.complete();
        }
    };
    const outerNext = (value) => (active < concurrent ? doInnerSub(value) : buffer.push(value));
    const doInnerSub = (value) => {
        expand && subscriber.next(value);
        active++;
        let innerComplete = false;
        setProperty.innerFrom(project(value, index++)).subscribe(setProperty.createOperatorSubscriber(subscriber, (innerValue) => {
            onBeforeNext === null || onBeforeNext === void 0 ? void 0 : onBeforeNext(innerValue);
            if (expand) {
                outerNext(innerValue);
            }
            else {
                subscriber.next(innerValue);
            }
        }, () => {
            innerComplete = true;
        }, undefined, () => {
            if (innerComplete) {
                try {
                    active--;
                    while (buffer.length && active < concurrent) {
                        const bufferedValue = buffer.shift();
                        if (innerSubScheduler) {
                            setProperty.executeSchedule(subscriber, innerSubScheduler, () => doInnerSub(bufferedValue));
                        }
                        else {
                            doInnerSub(bufferedValue);
                        }
                    }
                    checkComplete();
                }
                catch (err) {
                    subscriber.error(err);
                }
            }
        }));
    };
    source.subscribe(setProperty.createOperatorSubscriber(subscriber, outerNext, () => {
        isComplete = true;
        checkComplete();
    }));
    return () => {
        additionalFinalizer === null || additionalFinalizer === void 0 ? void 0 : additionalFinalizer();
    };
}

function mergeMap(project, resultSelector, concurrent = Infinity) {
    if (setProperty.isFunction(resultSelector)) {
        return mergeMap((a, i) => map((b, ii) => resultSelector(a, b, i, ii))(setProperty.innerFrom(project(a, i))), concurrent);
    }
    else if (typeof resultSelector === 'number') {
        concurrent = resultSelector;
    }
    return setProperty.operate((source, subscriber) => mergeInternals(source, subscriber, project, concurrent));
}

function mergeAll(concurrent = Infinity) {
    return mergeMap(setProperty.identity, concurrent);
}

function concatAll() {
    return mergeAll(1);
}

function concat(...args) {
    return concatAll()(setProperty.from(args, setProperty.popScheduler(args)));
}

function share(options = {}) {
    const { connector = () => new setProperty.Subject(), resetOnError = true, resetOnComplete = true, resetOnRefCountZero = true } = options;
    return (wrapperSource) => {
        let connection;
        let resetConnection;
        let subject;
        let refCount = 0;
        let hasCompleted = false;
        let hasErrored = false;
        const cancelReset = () => {
            resetConnection === null || resetConnection === void 0 ? void 0 : resetConnection.unsubscribe();
            resetConnection = undefined;
        };
        const reset = () => {
            cancelReset();
            connection = subject = undefined;
            hasCompleted = hasErrored = false;
        };
        const resetAndUnsubscribe = () => {
            const conn = connection;
            reset();
            conn === null || conn === void 0 ? void 0 : conn.unsubscribe();
        };
        return setProperty.operate((source, subscriber) => {
            refCount++;
            if (!hasErrored && !hasCompleted) {
                cancelReset();
            }
            const dest = (subject = subject !== null && subject !== void 0 ? subject : connector());
            subscriber.add(() => {
                refCount--;
                if (refCount === 0 && !hasErrored && !hasCompleted) {
                    resetConnection = handleReset(resetAndUnsubscribe, resetOnRefCountZero);
                }
            });
            dest.subscribe(subscriber);
            if (!connection &&
                refCount > 0) {
                connection = new setProperty.SafeSubscriber({
                    next: (value) => dest.next(value),
                    error: (err) => {
                        hasErrored = true;
                        cancelReset();
                        resetConnection = handleReset(reset, resetOnError, err);
                        dest.error(err);
                    },
                    complete: () => {
                        hasCompleted = true;
                        cancelReset();
                        resetConnection = handleReset(reset, resetOnComplete);
                        dest.complete();
                    },
                });
                setProperty.innerFrom(source).subscribe(connection);
            }
        })(wrapperSource);
    };
}
function handleReset(reset, on, ...args) {
    if (on === true) {
        reset();
        return;
    }
    if (on === false) {
        return;
    }
    const onSubscriber = new setProperty.SafeSubscriber({
        next: () => {
            onSubscriber.unsubscribe();
            reset();
        },
    });
    return setProperty.innerFrom(on(...args)).subscribe(onSubscriber);
}

function shareReplay(configOrBufferSize, windowTime, scheduler) {
    let bufferSize;
    let refCount = false;
    if (configOrBufferSize && typeof configOrBufferSize === 'object') {
        ({ bufferSize = Infinity, windowTime = Infinity, refCount = false, scheduler } = configOrBufferSize);
    }
    else {
        bufferSize = (configOrBufferSize !== null && configOrBufferSize !== void 0 ? configOrBufferSize : Infinity);
    }
    return share({
        connector: () => new ReplaySubject(bufferSize, windowTime, scheduler),
        resetOnError: true,
        resetOnComplete: false,
        resetOnRefCountZero: refCount,
    });
}

function startWith(...values) {
    const scheduler = setProperty.popScheduler(values);
    return setProperty.operate((source, subscriber) => {
        (scheduler ? concat(values, source, scheduler) : concat(values, source)).subscribe(subscriber);
    });
}

function takeUntil(notifier) {
    return setProperty.operate((source, subscriber) => {
        setProperty.innerFrom(notifier).subscribe(setProperty.createOperatorSubscriber(subscriber, () => subscriber.complete(), setProperty.noop));
        !subscriber.closed && source.subscribe(subscriber);
    });
}

function tap(observerOrNext, error, complete) {
    const tapObserver = setProperty.isFunction(observerOrNext) || error || complete
        ?
            { next: observerOrNext, error, complete }
        : observerOrNext;
    return tapObserver
        ? setProperty.operate((source, subscriber) => {
            var _a;
            (_a = tapObserver.subscribe) === null || _a === void 0 ? void 0 : _a.call(tapObserver);
            let isUnsub = true;
            source.subscribe(setProperty.createOperatorSubscriber(subscriber, (value) => {
                var _a;
                (_a = tapObserver.next) === null || _a === void 0 ? void 0 : _a.call(tapObserver, value);
                subscriber.next(value);
            }, () => {
                var _a;
                isUnsub = false;
                (_a = tapObserver.complete) === null || _a === void 0 ? void 0 : _a.call(tapObserver);
                subscriber.complete();
            }, (err) => {
                var _a;
                isUnsub = false;
                (_a = tapObserver.error) === null || _a === void 0 ? void 0 : _a.call(tapObserver, err);
                subscriber.error(err);
            }, () => {
                var _a, _b;
                if (isUnsub) {
                    (_a = tapObserver.unsubscribe) === null || _a === void 0 ? void 0 : _a.call(tapObserver);
                }
                (_b = tapObserver.finalize) === null || _b === void 0 ? void 0 : _b.call(tapObserver);
            }));
        })
        :
            setProperty.identity;
}

/**
 * Returns an observable that emits when the component render()
 * function is called. Value will be emitted after the next
 * microtask (next tick).
 */
function renderObservable(cmp) {
  if ('function' !== typeof cmp.render) {
    throw new Error('Component does not have a render function.');
  }
  return new setProperty.Observable((subscriber) => {
    let previousRender = cmp.render;
    cmp.render = function () {
      Promise.resolve().then(() => {
        subscriber.next();
      });
      return previousRender.call(this);
    };
    return () => {
      cmp.render = previousRender;
    };
  });
}

/**
 * Property decorator inspired by Angular's @ViewChild/@ContentChild.
 *
 * After each render, the decorated property will be set to the first element
 * matching the given selector. If no element is found, the property will be
 * set to null.
 */
function QuerySelector(selector, shadowRoot = false) {
  return (target, property) => {
    let descriptor = {
      set: function () {
        throw new Error(`Property "${property}" is read-only.`);
      },
      get: function () {
        let observableProperty = `__rx__query_selector__observable__shadow_root__${shadowRoot ? 'yes' : 'no'}__selector__${selector}__`;
        if (!this[observableProperty]) {
          let root = index.getElement(this);
          if (shadowRoot) {
            root = root.shadowRoot;
          }
          this[observableProperty] = renderObservable(this).pipe(startWith(), map(() => root.querySelector(selector)), setProperty.distinctUntilChanged(), shareReplay(1));
        }
        return this[observableProperty];
      },
    };
    Object.defineProperty(target, property, descriptor);
  };
}

/**
 * Property decorator inspired by Angular's @ViewChild/@ContentChild.
 *
 * After each render, the decorated property will be set to the first element
 * matching the given selector. If no element is found, the property will be
 * set to null.
 */
function QuerySelectorAll(selector, shadowRoot = false) {
  return (target, property) => {
    let descriptor = {
      set: function () {
        throw new Error(`Property "${property}" is read-only.`);
      },
      get: function () {
        let observableProperty = `__rx__query_selector_all__observable__shadow_root__${shadowRoot ? 'yes' : 'no'}__selector__${selector}__`;
        if (!this[observableProperty]) {
          let root = index.getElement(this);
          if (shadowRoot) {
            root = root.shadowRoot;
          }
          this[observableProperty] = renderObservable(this).pipe(startWith(), map(() => Array.from(root.querySelectorAll(selector))), setProperty.distinctUntilChanged((previous, current) => {
            if (previous.length !== current.length) {
              return false;
            }
            for (let i = 0; i < previous.length; i++) {
              if (previous[i] !== current[i]) {
                return false;
              }
            }
            return true;
          }), shareReplay(1));
        }
        return this[observableProperty];
      },
    };
    Object.defineProperty(target, property, descriptor);
  };
}

/**
 * Schedule a render of the component. This is useful when you
 * want to force a render of the component as result of changing
 * the values of the component which are not tracked by Stencil,
 * observables, for example.
 *
 * By default, the render is scheduled on the next tick, but you
 * can disable this behavior by passing `false` as second argument.
 */
function scheduleRender(cmp, nextTick = true) {
  return (source) => {
    return source.pipe(tap(() => {
      if (!nextTick) {
        index.forceUpdate(cmp);
        return;
      }
      Promise.resolve().then(() => index.forceUpdate(cmp));
    }));
  };
}

/**
 * Use this function to tap into a value stream and flush value to
 * component property. You may also use this function as subscription
 * function (function will detect that value is passed instead of
 * observable).
 */
function toProperty(cmp, property) {
  // ensure that the property is defined on the component.
  setProperty.getPropertyDescriptor(cmp, property);
  // @ts-ignore
  return (source) => {
    return source.pipe(tap((value) => {
      cmp[property] = value;
    }));
  };
}

/**
 * A map of component observables that are being watched for
 * disconnect callback invocation. A weak map is being used
 * so that the component instance can be garbage collected.
 *
 * {@internal}
 */
let disconnectObservables = new WeakMap();
/**
 * Creates an observable that emits a value when the component
 * is disconnected from DOM and method `disconnectedCallback()`
 * is invoked. StencilJS will supress the invocation of this
 * method if it is not defined on the component.
 *
 * {@internal}
 */
let createUsingDisconnectedCallback = function (cmp) {
  let previousDisconnected = cmp.disconnectedCallback;
  if (!previousDisconnected) {
    throw new Error(`Component "${cmp.constructor.name}" does not have a "disconnectedCallback()" method defined.`);
  }
  let disconnectedSubject$ = new setProperty.Subject();
  cmp.disconnectedCallback = function () {
    if (previousDisconnected) {
      previousDisconnected.call(cmp);
    }
    disconnectedSubject$.next();
  };
  return disconnectedSubject$.asObservable();
};
/**
 * Mutation observer is our next heuristic. We will monitor parent
 * node of the component and emit a value when the component is
 * disconnected from DOM. This will only work, of course, if the
 * component is not the root node of the application and component
 * is already within DOM.
 *
 * {@internal}
 */
let createUsingMutationObserver = function (cmp) {
  let element = index.getElement(cmp);
  if (null === element.parentNode) {
    throw new Error(`Component "${cmp.constructor.name}" is not within DOM.`);
  }
  return new setProperty.Observable((observer) => {
    let mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((record) => {
        for (let node of Array.from(record.removedNodes)) {
          if (node !== element) {
            continue;
          }
          observer.next();
          observer.complete();
        }
      });
    });
    mutationObserver.observe(element.parentNode, {
      childList: true,
      subtree: true,
    });
    return () => {
      mutationObserver.disconnect();
      // we can not re-use this observable, so we have to delete it
      disconnectObservables.delete(cmp);
    };
  });
};
/**
 * Creates an observable that emits a value when the component
 * is disconnected from DOM.
 *
 * {@internal}
 */
function createDisconnectObservable(cmp) {
  let functions = [
    createUsingDisconnectedCallback,
    createUsingMutationObserver,
  ];
  for (let fn of functions) {
    try {
      disconnectObservables.set(cmp, fn(cmp));
      return;
    }
    catch (e) {
      // noop
    }
  }
  throw new Error(`Could not create disconnect observable for component "${cmp.constructor.name}".`);
}
/**
 * Operator that unsubscribes from the source observable when
 * the component is disconnected from DOM.
 */
function untilDisconnected(cmp) {
  return (source) => {
    if (!disconnectObservables.has(cmp)) {
      createDisconnectObservable(cmp);
    }
    let disconnectObservable$ = disconnectObservables.get(cmp);
    return source.pipe(takeUntil(disconnectObservable$));
  };
}

exports.propertyObservable = setProperty.propertyObservable;
exports.setProperty = setProperty.setProperty;
exports.QuerySelector = QuerySelector;
exports.QuerySelectorAll = QuerySelectorAll;
exports.renderObservable = renderObservable;
exports.scheduleRender = scheduleRender;
exports.toProperty = toProperty;
exports.untilDisconnected = untilDisconnected;

//# sourceMappingURL=index.cjs.js.map