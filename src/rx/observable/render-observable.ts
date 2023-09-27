import { ComponentInterface } from '@stencil/core';
import {
    Observable,
    Subscriber,
    TeardownLogic,
}                             from 'rxjs';

/**
 * Returns an observable that emits when the component render()
 * function is called. Value will be emitted after the next
 * microtask (next tick).
 */
export function renderObservable(cmp: ComponentInterface): Observable<void> {
    if ('function' !== typeof cmp.render) {
        throw new Error('Component does not have a render function.');
    }

    return new Observable<void>((subscriber: Subscriber<void>): TeardownLogic => {
        let previousRender: () => any = cmp.render;

        cmp.render = function (): any {
            Promise.resolve().then((): void => {
                subscriber.next();
            });

            return previousRender.call(this);
        }

        return (): void => {
            cmp.render = previousRender;
        }
    });
}
