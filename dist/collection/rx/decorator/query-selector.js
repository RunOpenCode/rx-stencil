import { getElement, } from "@stencil/core";
import { distinctUntilChanged, filter, map, shareReplay, startWith, } from "rxjs";
import { mutationObservable, renderObservable, } from "../observable";
/**
 * Observe all sub nodes of the given node and notify
 * when any of them is removed and/or added.
 *
 * {@internal}
 */
export function observeSubNodes(target) {
  return mutationObservable(target, {
    subtree: true,
    childList: true,
  }).pipe(filter((records) => {
    for (let i = 0; i < records.length; i++) {
      if ('childList' !== records[i].type) {
        continue;
      }
      if (records[i].addedNodes.length || records[i].removedNodes.length) {
        return true;
      }
    }
    return false;
  }), map(() => {
    /* noop */
  }));
}
/**
 * Property decorator inspired by Angular's @ViewChild/@ContentChild.
 *
 * After each render, the decorated property will be set to the first element
 * matching the given selector. If no element is found, the property will be
 * set to null.
 */
export function QuerySelector(selector, options) {
  return (target, property) => {
    let descriptor = {
      set: function () {
        throw new Error(`Property "${property}" is read-only.`);
      },
      get: function () {
        let observableProperty = `__rx__query_selector__observable__shadow_root__${(options === null || options === void 0 ? void 0 : options.shadowRoot) ? 'yes' : 'no'}__mutation_observer__${(options === null || options === void 0 ? void 0 : options.mutationObserver) ? 'yes' : 'no'}__selector__${selector}__`;
        if (!this[observableProperty]) {
          let root = (options === null || options === void 0 ? void 0 : options.shadowRoot) ? getElement(this).shadowRoot : getElement(this);
          let observable = (options === null || options === void 0 ? void 0 : options.mutationObserver) ? observeSubNodes(root) : renderObservable(this);
          this[observableProperty] = observable.pipe(startWith(), map(() => root.querySelector(selector)), distinctUntilChanged(), shareReplay(1));
        }
        return this[observableProperty];
      },
    };
    Object.defineProperty(target, property, descriptor);
  };
}
//# sourceMappingURL=query-selector.js.map
