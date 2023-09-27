import { getElement, } from "@stencil/core";
import { Observable, Subject, takeUntil, } from "rxjs";
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
  let disconnectedSubject$ = new Subject();
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
  let element = getElement(cmp);
  if (null === element.parentNode) {
    throw new Error(`Component "${cmp.constructor.name}" is not within DOM.`);
  }
  return new Observable((observer) => {
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
export function untilDisconnected(cmp) {
  return (source) => {
    if (!disconnectObservables.has(cmp)) {
      createDisconnectObservable(cmp);
    }
    let disconnectObservable$ = disconnectObservables.get(cmp);
    return source.pipe(takeUntil(disconnectObservable$));
  };
}
//# sourceMappingURL=until-disconnected.js.map
