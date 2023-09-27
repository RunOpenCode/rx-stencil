import { forceUpdate, } from "@stencil/core";
export function setProperty(cmp, property, options = {}) {
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
//# sourceMappingURL=set-property.js.map
