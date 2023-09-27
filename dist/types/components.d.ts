/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "./stencil-public-runtime";
import { AsyncValue } from "./components/async/async";
export { AsyncValue } from "./components/async/async";
export namespace Components {
    interface RxAsync {
        "value": AsyncValue;
    }
}
declare global {
    interface HTMLRxAsyncElement extends Components.RxAsync, HTMLStencilElement {
    }
    var HTMLRxAsyncElement: {
        prototype: HTMLRxAsyncElement;
        new (): HTMLRxAsyncElement;
    };
    interface HTMLElementTagNameMap {
        "rx-async": HTMLRxAsyncElement;
    }
}
declare namespace LocalJSX {
    interface RxAsync {
        "value"?: AsyncValue;
    }
    interface IntrinsicElements {
        "rx-async": RxAsync;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "rx-async": LocalJSX.RxAsync & JSXBase.HTMLAttributes<HTMLRxAsyncElement>;
        }
    }
}
