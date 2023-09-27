import { getElement, } from "@stencil/core";
import { distinctUntilChanged, map, shareReplay, startWith, } from "rxjs";
import { renderObservable } from "../observable";
/**
 * Property decorator inspired by Angular's @ViewChild/@ContentChild.
 *
 * After each render, the decorated property will be set to the first element
 * matching the given selector. If no element is found, the property will be
 * set to null.
 */
export function QuerySelectorAll(selector, shadowRoot = false) {
  return (target, property) => {
    let descriptor = {
      set: function () {
        throw new Error(`Property "${property}" is read-only.`);
      },
      get: function () {
        let observableProperty = `__rx__query_selector_all__observable__shadow_root__${shadowRoot ? 'yes' : 'no'}__selector__${selector}__`;
        if (!this[observableProperty]) {
          let root = getElement(this);
          if (shadowRoot) {
            root = root.shadowRoot;
          }
          this[observableProperty] = renderObservable(this).pipe(map(() => Array.from(root.querySelectorAll(selector))), startWith([]), distinctUntilChanged((previous, current) => {
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
