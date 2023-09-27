import {
    ComponentInterface,
    forceUpdate,
} from '@stencil/core';
import {
    MonoTypeOperatorFunction,
    Observable,
    tap,
} from 'rxjs';

/**
 * Schedule a render of the component. This is useful when you
 * want to force a render of the component as result of changing
 * the values of the component which are not tracked by Stencil,
 * observables, for example.
 *
 * By default, the render is scheduled on the next tick, but you
 * can disable this behavior by passing `false` as second argument.
 */
export function scheduleRender<T = unknown>(cmp: ComponentInterface, nextTick: boolean = true): MonoTypeOperatorFunction<T> {
    return (source: Observable<T>): Observable<T> => {
        return source.pipe(tap((): void => {
            if (!nextTick) {
                forceUpdate(cmp);
                return;
            }

            Promise.resolve().then((): void => forceUpdate(cmp));
        }));
    };
}
