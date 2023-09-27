import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { f as from, p as popScheduler, O as Observable, a as isFunction, o as operate, c as createOperatorSubscriber, i as innerFrom, j as propertyObservable, s as setProperty } from './set-property.js';

function of(...args) {
    const scheduler = popScheduler(args);
    return from(args, scheduler);
}

function isObservable(obj) {
    return !!obj && (obj instanceof Observable || (isFunction(obj.lift) && isFunction(obj.subscribe)));
}

function switchMap(project, resultSelector) {
    return operate((source, subscriber) => {
        let innerSubscriber = null;
        let index = 0;
        let isComplete = false;
        const checkComplete = () => isComplete && !innerSubscriber && subscriber.complete();
        source.subscribe(createOperatorSubscriber(subscriber, (value) => {
            innerSubscriber === null || innerSubscriber === void 0 ? void 0 : innerSubscriber.unsubscribe();
            let innerIndex = 0;
            const outerIndex = index++;
            innerFrom(project(value, outerIndex)).subscribe((innerSubscriber = createOperatorSubscriber(subscriber, (innerValue) => subscriber.next(resultSelector ? resultSelector(value, innerValue, outerIndex, innerIndex++) : innerValue), () => {
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

const Async = /*@__PURE__*/ proxyCustomElement(class Async extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this._value = null;
    this.value = null;
  }
  connectedCallback() {
    propertyObservable(this, 'value').pipe(switchMap((value) => {
      if (isObservable(value)) {
        return value;
      }
      if (value instanceof Promise) {
        return from(value);
      }
      return of(value);
    })).subscribe(setProperty(this, '_value', {
      scheduleRender: true,
      nextTick: false,
    }));
  }
  disconnectedCallback() {
    // noop
  }
  render() {
    return (h(Host, null, this._value));
  }
  static get style() { return asyncScss; }
}, [0, "rx-async", {
    "value": [16]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["rx-async"];
  components.forEach(tagName => { switch (tagName) {
    case "rx-async":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, Async);
      }
      break;
  } });
}

const RxAsync = Async;
const defineCustomElement = defineCustomElement$1;

export { RxAsync, defineCustomElement };

//# sourceMappingURL=rx-async.js.map