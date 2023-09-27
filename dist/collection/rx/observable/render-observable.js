import { Observable, } from "rxjs";
/**
 * Returns an observable that emits when the component render()
 * function is called. Value will be emitted after the next
 * microtask (next tick).
 */
export function renderObservable(cmp) {
  if ('function' !== typeof cmp.render) {
    throw new Error('Component does not have a render function.');
  }
  return new Observable((subscriber) => {
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
//# sourceMappingURL=render-observable.js.map
