import { Observable, } from "rxjs";
export function mutationObservable(target, options) {
  return new Observable((observer) => {
    let mutation = new MutationObserver((mutations) => {
      observer.next(mutations);
    });
    mutation.observe(target, options);
    return () => {
      mutation.disconnect();
    };
  });
}
//# sourceMappingURL=mutation-observable.js.map
