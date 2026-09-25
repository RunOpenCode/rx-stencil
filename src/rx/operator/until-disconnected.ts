import {
    ComponentInterface,
    getElement,
} from '@stencil/core';
import {
    MonoTypeOperatorFunction,
    Observable,
    Subject,
    takeUntil,
} from 'rxjs';

let observables: WeakMap<HTMLElement, Observable<void>> = new WeakMap();

/**
 * Operator that unsubscribes from the source observable when
 * the component is disconnected from DOM.
 */
export function untilDisconnected<T = unknown>(cmp: ComponentInterface): MonoTypeOperatorFunction<T> {
    return (source: Observable<T>): Observable<T> => {
        let element: HTMLElement = getElement(cmp);

        if (!observables.has(element)) {
            let observable: Subject<void>          = new Subject<void>()
            let previous: (() => void) | undefined = cmp.disconnectedCallback

            cmp.disconnectedCallback = function (): void {
                previous?.call(this);
                observable.next();
            }
            
            observables.set(element, observable.asObservable())
        }

        return source.pipe(
            takeUntil<T>(observables.get(element) as Observable<void>),
        );
    };
}
