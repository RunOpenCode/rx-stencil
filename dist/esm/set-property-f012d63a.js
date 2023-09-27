import { f as forceUpdate } from './index-b563d87d.js';

function isFunction(value) {
    return typeof value === 'function';
}

function createErrorClass(createImpl) {
    const _super = (instance) => {
        Error.call(instance);
        instance.stack = new Error().stack;
    };
    const ctorFunc = createImpl(_super);
    ctorFunc.prototype = Object.create(Error.prototype);
    ctorFunc.prototype.constructor = ctorFunc;
    return ctorFunc;
}

const UnsubscriptionError = createErrorClass((_super) => function UnsubscriptionErrorImpl(errors) {
    _super(this);
    this.message = errors
        ? `${errors.length} errors occurred during unsubscription:
${errors.map((err, i) => `${i + 1}) ${err.toString()}`).join('\n  ')}`
        : '';
    this.name = 'UnsubscriptionError';
    this.errors = errors;
});

function arrRemove(arr, item) {
    if (arr) {
        const index = arr.indexOf(item);
        0 <= index && arr.splice(index, 1);
    }
}

class Subscription {
    constructor(initialTeardown) {
        this.initialTeardown = initialTeardown;
        this.closed = false;
        this._parentage = null;
        this._finalizers = null;
    }
    unsubscribe() {
        let errors;
        if (!this.closed) {
            this.closed = true;
            const { _parentage } = this;
            if (_parentage) {
                this._parentage = null;
                if (Array.isArray(_parentage)) {
                    for (const parent of _parentage) {
                        parent.remove(this);
                    }
                }
                else {
                    _parentage.remove(this);
                }
            }
            const { initialTeardown: initialFinalizer } = this;
            if (isFunction(initialFinalizer)) {
                try {
                    initialFinalizer();
                }
                catch (e) {
                    errors = e instanceof UnsubscriptionError ? e.errors : [e];
                }
            }
            const { _finalizers } = this;
            if (_finalizers) {
                this._finalizers = null;
                for (const finalizer of _finalizers) {
                    try {
                        execFinalizer(finalizer);
                    }
                    catch (err) {
                        errors = errors !== null && errors !== void 0 ? errors : [];
                        if (err instanceof UnsubscriptionError) {
                            errors = [...errors, ...err.errors];
                        }
                        else {
                            errors.push(err);
                        }
                    }
                }
            }
            if (errors) {
                throw new UnsubscriptionError(errors);
            }
        }
    }
    add(teardown) {
        var _a;
        if (teardown && teardown !== this) {
            if (this.closed) {
                execFinalizer(teardown);
            }
            else {
                if (teardown instanceof Subscription) {
                    if (teardown.closed || teardown._hasParent(this)) {
                        return;
                    }
                    teardown._addParent(this);
                }
                (this._finalizers = (_a = this._finalizers) !== null && _a !== void 0 ? _a : []).push(teardown);
            }
        }
    }
    _hasParent(parent) {
        const { _parentage } = this;
        return _parentage === parent || (Array.isArray(_parentage) && _parentage.includes(parent));
    }
    _addParent(parent) {
        const { _parentage } = this;
        this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
    }
    _removeParent(parent) {
        const { _parentage } = this;
        if (_parentage === parent) {
            this._parentage = null;
        }
        else if (Array.isArray(_parentage)) {
            arrRemove(_parentage, parent);
        }
    }
    remove(teardown) {
        const { _finalizers } = this;
        _finalizers && arrRemove(_finalizers, teardown);
        if (teardown instanceof Subscription) {
            teardown._removeParent(this);
        }
    }
}
Subscription.EMPTY = (() => {
    const empty = new Subscription();
    empty.closed = true;
    return empty;
})();
const EMPTY_SUBSCRIPTION = Subscription.EMPTY;
function isSubscription(value) {
    return (value instanceof Subscription ||
        (value && 'closed' in value && isFunction(value.remove) && isFunction(value.add) && isFunction(value.unsubscribe)));
}
function execFinalizer(finalizer) {
    if (isFunction(finalizer)) {
        finalizer();
    }
    else {
        finalizer.unsubscribe();
    }
}

const config = {
    onUnhandledError: null,
    onStoppedNotification: null,
    Promise: undefined,
    useDeprecatedSynchronousErrorHandling: false,
    useDeprecatedNextContext: false,
};

const timeoutProvider = {
    setTimeout(handler, timeout, ...args) {
        const { delegate } = timeoutProvider;
        if (delegate === null || delegate === void 0 ? void 0 : delegate.setTimeout) {
            return delegate.setTimeout(handler, timeout, ...args);
        }
        return setTimeout(handler, timeout, ...args);
    },
    clearTimeout(handle) {
        const { delegate } = timeoutProvider;
        return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout)(handle);
    },
    delegate: undefined,
};

function reportUnhandledError(err) {
    timeoutProvider.setTimeout(() => {
        const { onUnhandledError } = config;
        if (onUnhandledError) {
            onUnhandledError(err);
        }
        else {
            throw err;
        }
    });
}

function noop() { }

const COMPLETE_NOTIFICATION = (() => createNotification('C', undefined, undefined))();
function errorNotification(error) {
    return createNotification('E', undefined, error);
}
function nextNotification(value) {
    return createNotification('N', value, undefined);
}
function createNotification(kind, value, error) {
    return {
        kind,
        value,
        error,
    };
}

function errorContext(cb) {
    {
        cb();
    }
}

class Subscriber extends Subscription {
    constructor(destination) {
        super();
        this.isStopped = false;
        if (destination) {
            this.destination = destination;
            if (isSubscription(destination)) {
                destination.add(this);
            }
        }
        else {
            this.destination = EMPTY_OBSERVER;
        }
    }
    static create(next, error, complete) {
        return new SafeSubscriber(next, error, complete);
    }
    next(value) {
        if (this.isStopped) {
            handleStoppedNotification(nextNotification(value), this);
        }
        else {
            this._next(value);
        }
    }
    error(err) {
        if (this.isStopped) {
            handleStoppedNotification(errorNotification(err), this);
        }
        else {
            this.isStopped = true;
            this._error(err);
        }
    }
    complete() {
        if (this.isStopped) {
            handleStoppedNotification(COMPLETE_NOTIFICATION, this);
        }
        else {
            this.isStopped = true;
            this._complete();
        }
    }
    unsubscribe() {
        if (!this.closed) {
            this.isStopped = true;
            super.unsubscribe();
            this.destination = null;
        }
    }
    _next(value) {
        this.destination.next(value);
    }
    _error(err) {
        try {
            this.destination.error(err);
        }
        finally {
            this.unsubscribe();
        }
    }
    _complete() {
        try {
            this.destination.complete();
        }
        finally {
            this.unsubscribe();
        }
    }
}
const _bind = Function.prototype.bind;
function bind(fn, thisArg) {
    return _bind.call(fn, thisArg);
}
class ConsumerObserver {
    constructor(partialObserver) {
        this.partialObserver = partialObserver;
    }
    next(value) {
        const { partialObserver } = this;
        if (partialObserver.next) {
            try {
                partialObserver.next(value);
            }
            catch (error) {
                handleUnhandledError(error);
            }
        }
    }
    error(err) {
        const { partialObserver } = this;
        if (partialObserver.error) {
            try {
                partialObserver.error(err);
            }
            catch (error) {
                handleUnhandledError(error);
            }
        }
        else {
            handleUnhandledError(err);
        }
    }
    complete() {
        const { partialObserver } = this;
        if (partialObserver.complete) {
            try {
                partialObserver.complete();
            }
            catch (error) {
                handleUnhandledError(error);
            }
        }
    }
}
class SafeSubscriber extends Subscriber {
    constructor(observerOrNext, error, complete) {
        super();
        let partialObserver;
        if (isFunction(observerOrNext) || !observerOrNext) {
            partialObserver = {
                next: (observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : undefined),
                error: error !== null && error !== void 0 ? error : undefined,
                complete: complete !== null && complete !== void 0 ? complete : undefined,
            };
        }
        else {
            let context;
            if (this && config.useDeprecatedNextContext) {
                context = Object.create(observerOrNext);
                context.unsubscribe = () => this.unsubscribe();
                partialObserver = {
                    next: observerOrNext.next && bind(observerOrNext.next, context),
                    error: observerOrNext.error && bind(observerOrNext.error, context),
                    complete: observerOrNext.complete && bind(observerOrNext.complete, context),
                };
            }
            else {
                partialObserver = observerOrNext;
            }
        }
        this.destination = new ConsumerObserver(partialObserver);
    }
}
function handleUnhandledError(error) {
    {
        reportUnhandledError(error);
    }
}
function defaultErrorHandler(err) {
    throw err;
}
function handleStoppedNotification(notification, subscriber) {
    const { onStoppedNotification } = config;
    onStoppedNotification && timeoutProvider.setTimeout(() => onStoppedNotification(notification, subscriber));
}
const EMPTY_OBSERVER = {
    closed: true,
    next: noop,
    error: defaultErrorHandler,
    complete: noop,
};

const observable = (() => (typeof Symbol === 'function' && Symbol.observable) || '@@observable')();

function identity(x) {
    return x;
}

function pipeFromArray(fns) {
    if (fns.length === 0) {
        return identity;
    }
    if (fns.length === 1) {
        return fns[0];
    }
    return function piped(input) {
        return fns.reduce((prev, fn) => fn(prev), input);
    };
}

class Observable {
    constructor(subscribe) {
        if (subscribe) {
            this._subscribe = subscribe;
        }
    }
    lift(operator) {
        const observable = new Observable();
        observable.source = this;
        observable.operator = operator;
        return observable;
    }
    subscribe(observerOrNext, error, complete) {
        const subscriber = isSubscriber(observerOrNext) ? observerOrNext : new SafeSubscriber(observerOrNext, error, complete);
        errorContext(() => {
            const { operator, source } = this;
            subscriber.add(operator
                ?
                    operator.call(subscriber, source)
                : source
                    ?
                        this._subscribe(subscriber)
                    :
                        this._trySubscribe(subscriber));
        });
        return subscriber;
    }
    _trySubscribe(sink) {
        try {
            return this._subscribe(sink);
        }
        catch (err) {
            sink.error(err);
        }
    }
    forEach(next, promiseCtor) {
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor((resolve, reject) => {
            const subscriber = new SafeSubscriber({
                next: (value) => {
                    try {
                        next(value);
                    }
                    catch (err) {
                        reject(err);
                        subscriber.unsubscribe();
                    }
                },
                error: reject,
                complete: resolve,
            });
            this.subscribe(subscriber);
        });
    }
    _subscribe(subscriber) {
        var _a;
        return (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber);
    }
    [observable]() {
        return this;
    }
    pipe(...operations) {
        return pipeFromArray(operations)(this);
    }
    toPromise(promiseCtor) {
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor((resolve, reject) => {
            let value;
            this.subscribe((x) => (value = x), (err) => reject(err), () => resolve(value));
        });
    }
}
Observable.create = (subscribe) => {
    return new Observable(subscribe);
};
function getPromiseCtor(promiseCtor) {
    var _a;
    return (_a = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : config.Promise) !== null && _a !== void 0 ? _a : Promise;
}
function isObserver(value) {
    return value && isFunction(value.next) && isFunction(value.error) && isFunction(value.complete);
}
function isSubscriber(value) {
    return (value && value instanceof Subscriber) || (isObserver(value) && isSubscription(value));
}

function hasLift(source) {
    return isFunction(source === null || source === void 0 ? void 0 : source.lift);
}
function operate(init) {
    return (source) => {
        if (hasLift(source)) {
            return source.lift(function (liftedSource) {
                try {
                    return init(liftedSource, this);
                }
                catch (err) {
                    this.error(err);
                }
            });
        }
        throw new TypeError('Unable to lift unknown Observable type');
    };
}

function createOperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
    return new OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize);
}
class OperatorSubscriber extends Subscriber {
    constructor(destination, onNext, onComplete, onError, onFinalize, shouldUnsubscribe) {
        super(destination);
        this.onFinalize = onFinalize;
        this.shouldUnsubscribe = shouldUnsubscribe;
        this._next = onNext
            ? function (value) {
                try {
                    onNext(value);
                }
                catch (err) {
                    destination.error(err);
                }
            }
            : super._next;
        this._error = onError
            ? function (err) {
                try {
                    onError(err);
                }
                catch (err) {
                    destination.error(err);
                }
                finally {
                    this.unsubscribe();
                }
            }
            : super._error;
        this._complete = onComplete
            ? function () {
                try {
                    onComplete();
                }
                catch (err) {
                    destination.error(err);
                }
                finally {
                    this.unsubscribe();
                }
            }
            : super._complete;
    }
    unsubscribe() {
        var _a;
        if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            const { closed } = this;
            super.unsubscribe();
            !closed && ((_a = this.onFinalize) === null || _a === void 0 ? void 0 : _a.call(this));
        }
    }
}

const ObjectUnsubscribedError = createErrorClass((_super) => function ObjectUnsubscribedErrorImpl() {
    _super(this);
    this.name = 'ObjectUnsubscribedError';
    this.message = 'object unsubscribed';
});

class Subject extends Observable {
    constructor() {
        super();
        this.closed = false;
        this.currentObservers = null;
        this.observers = [];
        this.isStopped = false;
        this.hasError = false;
        this.thrownError = null;
    }
    lift(operator) {
        const subject = new AnonymousSubject(this, this);
        subject.operator = operator;
        return subject;
    }
    _throwIfClosed() {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
    }
    next(value) {
        errorContext(() => {
            this._throwIfClosed();
            if (!this.isStopped) {
                if (!this.currentObservers) {
                    this.currentObservers = Array.from(this.observers);
                }
                for (const observer of this.currentObservers) {
                    observer.next(value);
                }
            }
        });
    }
    error(err) {
        errorContext(() => {
            this._throwIfClosed();
            if (!this.isStopped) {
                this.hasError = this.isStopped = true;
                this.thrownError = err;
                const { observers } = this;
                while (observers.length) {
                    observers.shift().error(err);
                }
            }
        });
    }
    complete() {
        errorContext(() => {
            this._throwIfClosed();
            if (!this.isStopped) {
                this.isStopped = true;
                const { observers } = this;
                while (observers.length) {
                    observers.shift().complete();
                }
            }
        });
    }
    unsubscribe() {
        this.isStopped = this.closed = true;
        this.observers = this.currentObservers = null;
    }
    get observed() {
        var _a;
        return ((_a = this.observers) === null || _a === void 0 ? void 0 : _a.length) > 0;
    }
    _trySubscribe(subscriber) {
        this._throwIfClosed();
        return super._trySubscribe(subscriber);
    }
    _subscribe(subscriber) {
        this._throwIfClosed();
        this._checkFinalizedStatuses(subscriber);
        return this._innerSubscribe(subscriber);
    }
    _innerSubscribe(subscriber) {
        const { hasError, isStopped, observers } = this;
        if (hasError || isStopped) {
            return EMPTY_SUBSCRIPTION;
        }
        this.currentObservers = null;
        observers.push(subscriber);
        return new Subscription(() => {
            this.currentObservers = null;
            arrRemove(observers, subscriber);
        });
    }
    _checkFinalizedStatuses(subscriber) {
        const { hasError, thrownError, isStopped } = this;
        if (hasError) {
            subscriber.error(thrownError);
        }
        else if (isStopped) {
            subscriber.complete();
        }
    }
    asObservable() {
        const observable = new Observable();
        observable.source = this;
        return observable;
    }
}
Subject.create = (destination, source) => {
    return new AnonymousSubject(destination, source);
};
class AnonymousSubject extends Subject {
    constructor(destination, source) {
        super();
        this.destination = destination;
        this.source = source;
    }
    next(value) {
        var _a, _b;
        (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.next) === null || _b === void 0 ? void 0 : _b.call(_a, value);
    }
    error(err) {
        var _a, _b;
        (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.call(_a, err);
    }
    complete() {
        var _a, _b;
        (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.complete) === null || _b === void 0 ? void 0 : _b.call(_a);
    }
    _subscribe(subscriber) {
        var _a, _b;
        return (_b = (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber)) !== null && _b !== void 0 ? _b : EMPTY_SUBSCRIPTION;
    }
}

class BehaviorSubject extends Subject {
    constructor(_value) {
        super();
        this._value = _value;
    }
    get value() {
        return this.getValue();
    }
    _subscribe(subscriber) {
        const subscription = super._subscribe(subscriber);
        !subscription.closed && subscriber.next(this._value);
        return subscription;
    }
    getValue() {
        const { hasError, thrownError, _value } = this;
        if (hasError) {
            throw thrownError;
        }
        this._throwIfClosed();
        return _value;
    }
    next(value) {
        super.next((this._value = value));
    }
}

function isScheduler(value) {
    return value && isFunction(value.schedule);
}

function last(arr) {
    return arr[arr.length - 1];
}
function popScheduler(args) {
    return isScheduler(last(args)) ? args.pop() : undefined;
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const isArrayLike = ((x) => x && typeof x.length === 'number' && typeof x !== 'function');

function isPromise(value) {
    return isFunction(value === null || value === void 0 ? void 0 : value.then);
}

function isInteropObservable(input) {
    return isFunction(input[observable]);
}

function isAsyncIterable(obj) {
    return Symbol.asyncIterator && isFunction(obj === null || obj === void 0 ? void 0 : obj[Symbol.asyncIterator]);
}

function createInvalidObservableTypeError(input) {
    return new TypeError(`You provided ${input !== null && typeof input === 'object' ? 'an invalid object' : `'${input}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`);
}

function getSymbolIterator() {
    if (typeof Symbol !== 'function' || !Symbol.iterator) {
        return '@@iterator';
    }
    return Symbol.iterator;
}
const iterator = getSymbolIterator();

function isIterable(input) {
    return isFunction(input === null || input === void 0 ? void 0 : input[iterator]);
}

function readableStreamLikeToAsyncGenerator(readableStream) {
    return __asyncGenerator(this, arguments, function* readableStreamLikeToAsyncGenerator_1() {
        const reader = readableStream.getReader();
        try {
            while (true) {
                const { value, done } = yield __await(reader.read());
                if (done) {
                    return yield __await(void 0);
                }
                yield yield __await(value);
            }
        }
        finally {
            reader.releaseLock();
        }
    });
}
function isReadableStreamLike(obj) {
    return isFunction(obj === null || obj === void 0 ? void 0 : obj.getReader);
}

function innerFrom(input) {
    if (input instanceof Observable) {
        return input;
    }
    if (input != null) {
        if (isInteropObservable(input)) {
            return fromInteropObservable(input);
        }
        if (isArrayLike(input)) {
            return fromArrayLike(input);
        }
        if (isPromise(input)) {
            return fromPromise(input);
        }
        if (isAsyncIterable(input)) {
            return fromAsyncIterable(input);
        }
        if (isIterable(input)) {
            return fromIterable(input);
        }
        if (isReadableStreamLike(input)) {
            return fromReadableStreamLike(input);
        }
    }
    throw createInvalidObservableTypeError(input);
}
function fromInteropObservable(obj) {
    return new Observable((subscriber) => {
        const obs = obj[observable]();
        if (isFunction(obs.subscribe)) {
            return obs.subscribe(subscriber);
        }
        throw new TypeError('Provided object does not correctly implement Symbol.observable');
    });
}
function fromArrayLike(array) {
    return new Observable((subscriber) => {
        for (let i = 0; i < array.length && !subscriber.closed; i++) {
            subscriber.next(array[i]);
        }
        subscriber.complete();
    });
}
function fromPromise(promise) {
    return new Observable((subscriber) => {
        promise
            .then((value) => {
            if (!subscriber.closed) {
                subscriber.next(value);
                subscriber.complete();
            }
        }, (err) => subscriber.error(err))
            .then(null, reportUnhandledError);
    });
}
function fromIterable(iterable) {
    return new Observable((subscriber) => {
        for (const value of iterable) {
            subscriber.next(value);
            if (subscriber.closed) {
                return;
            }
        }
        subscriber.complete();
    });
}
function fromAsyncIterable(asyncIterable) {
    return new Observable((subscriber) => {
        process(asyncIterable, subscriber).catch((err) => subscriber.error(err));
    });
}
function fromReadableStreamLike(readableStream) {
    return fromAsyncIterable(readableStreamLikeToAsyncGenerator(readableStream));
}
function process(asyncIterable, subscriber) {
    var asyncIterable_1, asyncIterable_1_1;
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            for (asyncIterable_1 = __asyncValues(asyncIterable); asyncIterable_1_1 = yield asyncIterable_1.next(), !asyncIterable_1_1.done;) {
                const value = asyncIterable_1_1.value;
                subscriber.next(value);
                if (subscriber.closed) {
                    return;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (asyncIterable_1_1 && !asyncIterable_1_1.done && (_a = asyncIterable_1.return)) yield _a.call(asyncIterable_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        subscriber.complete();
    });
}

function executeSchedule(parentSubscription, scheduler, work, delay = 0, repeat = false) {
    const scheduleSubscription = scheduler.schedule(function () {
        work();
        if (repeat) {
            parentSubscription.add(this.schedule(null, delay));
        }
        else {
            this.unsubscribe();
        }
    }, delay);
    parentSubscription.add(scheduleSubscription);
    if (!repeat) {
        return scheduleSubscription;
    }
}

function observeOn(scheduler, delay = 0) {
    return operate((source, subscriber) => {
        source.subscribe(createOperatorSubscriber(subscriber, (value) => executeSchedule(subscriber, scheduler, () => subscriber.next(value), delay), () => executeSchedule(subscriber, scheduler, () => subscriber.complete(), delay), (err) => executeSchedule(subscriber, scheduler, () => subscriber.error(err), delay)));
    });
}

function subscribeOn(scheduler, delay = 0) {
    return operate((source, subscriber) => {
        subscriber.add(scheduler.schedule(() => source.subscribe(subscriber), delay));
    });
}

function scheduleObservable(input, scheduler) {
    return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
}

function schedulePromise(input, scheduler) {
    return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
}

function scheduleArray(input, scheduler) {
    return new Observable((subscriber) => {
        let i = 0;
        return scheduler.schedule(function () {
            if (i === input.length) {
                subscriber.complete();
            }
            else {
                subscriber.next(input[i++]);
                if (!subscriber.closed) {
                    this.schedule();
                }
            }
        });
    });
}

function scheduleIterable(input, scheduler) {
    return new Observable((subscriber) => {
        let iterator$1;
        executeSchedule(subscriber, scheduler, () => {
            iterator$1 = input[iterator]();
            executeSchedule(subscriber, scheduler, () => {
                let value;
                let done;
                try {
                    ({ value, done } = iterator$1.next());
                }
                catch (err) {
                    subscriber.error(err);
                    return;
                }
                if (done) {
                    subscriber.complete();
                }
                else {
                    subscriber.next(value);
                }
            }, 0, true);
        });
        return () => isFunction(iterator$1 === null || iterator$1 === void 0 ? void 0 : iterator$1.return) && iterator$1.return();
    });
}

function scheduleAsyncIterable(input, scheduler) {
    if (!input) {
        throw new Error('Iterable cannot be null');
    }
    return new Observable((subscriber) => {
        executeSchedule(subscriber, scheduler, () => {
            const iterator = input[Symbol.asyncIterator]();
            executeSchedule(subscriber, scheduler, () => {
                iterator.next().then((result) => {
                    if (result.done) {
                        subscriber.complete();
                    }
                    else {
                        subscriber.next(result.value);
                    }
                });
            }, 0, true);
        });
    });
}

function scheduleReadableStreamLike(input, scheduler) {
    return scheduleAsyncIterable(readableStreamLikeToAsyncGenerator(input), scheduler);
}

function scheduled(input, scheduler) {
    if (input != null) {
        if (isInteropObservable(input)) {
            return scheduleObservable(input, scheduler);
        }
        if (isArrayLike(input)) {
            return scheduleArray(input, scheduler);
        }
        if (isPromise(input)) {
            return schedulePromise(input, scheduler);
        }
        if (isAsyncIterable(input)) {
            return scheduleAsyncIterable(input, scheduler);
        }
        if (isIterable(input)) {
            return scheduleIterable(input, scheduler);
        }
        if (isReadableStreamLike(input)) {
            return scheduleReadableStreamLike(input, scheduler);
        }
    }
    throw createInvalidObservableTypeError(input);
}

function from(input, scheduler) {
    return scheduler ? scheduled(input, scheduler) : innerFrom(input);
}

function distinctUntilChanged(comparator, keySelector = identity) {
    comparator = comparator !== null && comparator !== void 0 ? comparator : defaultCompare;
    return operate((source, subscriber) => {
        let previousKey;
        let first = true;
        source.subscribe(createOperatorSubscriber(subscriber, (value) => {
            const currentKey = keySelector(value);
            if (first || !comparator(previousKey, currentKey)) {
                first = false;
                previousKey = currentKey;
                subscriber.next(value);
            }
        }));
    });
}
function defaultCompare(a, b) {
    return a === b;
}

/**
 * Returns property descriptor for the given property of the component.
 *
 * {@internal}
 */
function getPropertyDescriptor(cmp, property, configurableRequired = true) {
  // descriptors are defined on prototype, so we have to go one level up.
  let prototype = Object.getPrototypeOf(cmp);
  let descriptor = Object.getOwnPropertyDescriptor(prototype, property);
  if (!descriptor) {
    throw new Error(`Property "${property}" is not defined on component "${cmp.constructor.name}".`);
  }
  if (configurableRequired && !descriptor.configurable) {
    throw new Error(`Property "${property}" is not configurable on component "${cmp.constructor.name}".`);
  }
  return descriptor;
}

/**
 * Returns an observable that emits property value when the component property value changes.
 */
function propertyObservable(cmp, property) {
  let subjectProperty = `__rx__subject_for_property__${property}__`;
  if (!cmp[subjectProperty]) {
    let descriptor = getPropertyDescriptor(cmp, property);
    let previousSetter = descriptor.set;
    let previousGetter = descriptor.get;
    // we have to invoke previous getter on component instance to get the current value
    let currentValue = undefined !== previousGetter ? previousGetter.call(cmp) : descriptor.value;
    let subject = new BehaviorSubject(currentValue);
    descriptor.set = function (value) {
      if (previousSetter) {
        previousSetter.call(this, value);
      }
      subject.next(value);
    };
    Object.defineProperty(cmp, property, descriptor);
    cmp[subjectProperty] = subject;
  }
  return cmp[subjectProperty]
    .asObservable()
    .pipe(distinctUntilChanged());
}

function setProperty(cmp, property, options = {}) {
  let resolvedOptions = Object.assign({ scheduleRender: false, nextTick: true }, options);
  return (value) => {
    cmp[property] = value;
    if (!resolvedOptions.scheduleRender) {
      return;
    }
    if (!resolvedOptions.nextTick) {
      forceUpdate(cmp);
      return;
    }
    Promise.resolve().then(() => forceUpdate(cmp));
  };
}

export { Observable as O, Subject as S, isFunction as a, identity as b, createOperatorSubscriber as c, SafeSubscriber as d, executeSchedule as e, from as f, distinctUntilChanged as g, getPropertyDescriptor as h, innerFrom as i, propertyObservable as j, noop as n, operate as o, popScheduler as p, setProperty as s };

//# sourceMappingURL=set-property-f012d63a.js.map