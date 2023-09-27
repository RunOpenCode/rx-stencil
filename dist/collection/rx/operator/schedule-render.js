import { forceUpdate, } from "@stencil/core";
import { tap, } from "rxjs";
/**
 * Schedule a render of the component. This is useful when you
 * want to force a render of the component as result of changing
 * the values of the component which are not tracked by Stencil,
 * observables, for example.
 *
 * By default, the render is scheduled on the next tick, but you
 * can disable this behavior by passing `false` as second argument.
 */
export function scheduleRender(cmp, nextTick = true) {
  return (source) => {
    return source.pipe(tap(() => {
      if (!nextTick) {
        forceUpdate(cmp);
        return;
      }
      Promise.resolve().then(() => forceUpdate(cmp));
    }));
  };
}
//# sourceMappingURL=schedule-render.js.map
