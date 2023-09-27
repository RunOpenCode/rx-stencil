import { ComponentInterface } from '../../stencil-public-runtime';
import { MonoTypeOperatorFunction } from 'rxjs';
/**
 * Operator that unsubscribes from the source observable when
 * the component is disconnected from DOM.
 */
export declare function untilDisconnected<T = unknown>(cmp: ComponentInterface): MonoTypeOperatorFunction<T>;
