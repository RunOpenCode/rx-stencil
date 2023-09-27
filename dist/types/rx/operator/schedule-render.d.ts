import { ComponentInterface } from '../../stencil-public-runtime';
import { MonoTypeOperatorFunction } from 'rxjs';
/**
 * Schedule a render of the component. This is useful when you
 * want to force a render of the component as result of changing
 * the values of the component which are not tracked by Stencil,
 * observables, for example.
 *
 * By default, the render is scheduled on the next tick, but you
 * can disable this behavior by passing `false` as second argument.
 */
export declare function scheduleRender<T = unknown>(cmp: ComponentInterface, nextTick?: boolean): MonoTypeOperatorFunction<T>;
