'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-95829225.js');
const setProperty = require('./set-property-4f065a91.js');

function of(...args) {
    const scheduler = setProperty.popScheduler(args);
    return setProperty.from(args, scheduler);
}

function isObservable(obj) {
    return !!obj && (obj instanceof setProperty.Observable || (setProperty.isFunction(obj.lift) && setProperty.isFunction(obj.subscribe)));
}

function switchMap(project, resultSelector) {
    return setProperty.operate((source, subscriber) => {
        let innerSubscriber = null;
        let index = 0;
        let isComplete = false;
        const checkComplete = () => isComplete && !innerSubscriber && subscriber.complete();
        source.subscribe(setProperty.createOperatorSubscriber(subscriber, (value) => {
            innerSubscriber === null || innerSubscriber === void 0 ? void 0 : innerSubscriber.unsubscribe();
            let innerIndex = 0;
            const outerIndex = index++;
            setProperty.innerFrom(project(value, outerIndex)).subscribe((innerSubscriber = setProperty.createOperatorSubscriber(subscriber, (innerValue) => subscriber.next(resultSelector ? resultSelector(value, innerValue, outerIndex, innerIndex++) : innerValue), () => {
                innerSubscriber = null;
                checkComplete();
            })));
        }, () => {
            isComplete = true;
            checkComplete();
        }));
    });
}

const asyncScss = ":host{display:inline-block}";

const Async = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this._value = null;
    this.value = null;
  }
  connectedCallback() {
    setProperty.propertyObservable(this, 'value').pipe(switchMap((value) => {
      if (isObservable(value)) {
        return value;
      }
      if (value instanceof Promise) {
        return setProperty.from(value);
      }
      return of(value);
    })).subscribe(setProperty.setProperty(this, '_value', {
      scheduleRender: true,
      nextTick: false,
    }));
  }
  disconnectedCallback() {
    // noop
  }
  render() {
    return (index.h(index.Host, null, this._value));
  }
};
Async.style = asyncScss;

exports.rx_async = Async;

//# sourceMappingURL=rx-async.cjs.entry.js.map