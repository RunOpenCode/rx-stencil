import type { Components, JSX } from "../types/components";

interface RxAsync extends Components.RxAsync, HTMLElement {}
export const RxAsync: {
  prototype: RxAsync;
  new (): RxAsync;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
