import { getElement, } from "@stencil/core";
import { distinctUntilChanged, map, shareReplay, startWith, } from "rxjs";
import { renderObservable } from "../observable";
import { observeSubNodes } from "./query-selector";
/**
 * Property decorator inspired by Angular's @ViewChild/@ContentChild.
 *
 * After each render, the decorated property will be set to the first element
 * matching the given selector. If no element is found, the property will be
 * set to null.
 */
export function QuerySelectorAll(selector, options) {
  return (target, property) => {
    let descriptor = {
      set: function () {
        throw new Error(`Property "${property}" is read-only.`);
      },
      get: function () {
        let observableProperty = `__rx__query_selector_all__observable__shadow_root__${(options === null || options === void 0 ? void 0 : options.shadowRoot) ? 'yes' : 'no'}__mutation_observer__${(options === null || options === void 0 ? void 0 : options.mutationObserver) ? 'yes' : 'no'}__selector__${selector}__`;
        if (!this[observableProperty]) {
          let root = (options === null || options === void 0 ? void 0 : options.shadowRoot) ? getElement(this).shadowRoot : getElement(this);
          let observable = (options === null || options === void 0 ? void 0 : options.mutationObserver) ? observeSubNodes(root) : renderObservable(this);
          this[observableProperty] = observable.pipe(startWith(), map(() => Array.from(root.querySelectorAll(selector))), distinctUntilChanged((previous, current) => {
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
//# sourceMappingURL=query-selector-all.js.map
