import {
    ComponentInterface,
    getElement,
} from '@stencil/core';
import {
    identity,
    Observable,
    startWith,
    Subject,
} from 'rxjs';
import {
    getComponentTagName,
    isRendered,
} from '../../utils/stencil';

let observables: WeakMap<HTMLElement, Observable<void>> = new WeakMap();

/**
 * Returns an observable that emits when the component `render()`
 * function is called. Value will be emitted after the next
 * microtask (next tick).
 *
 * If component is already rendered, the observable will emit
 * immediately.
 *
 * Uses hot observable pattern.
 */
export function renderObservable(cmp: ComponentInterface): Observable<void> {
    if ('function' !== typeof cmp.render) {
        throw new Error(`Component "${getComponentTagName(cmp)}" does not have a render function.`);
    }

    let element: HTMLElement = getElement(cmp);

    if (!observables.has(element)) {
        let previousRender: () => any = cmp.render as () => any;
        let subject: Subject<void>    = new Subject<void>();

        cmp.render = function (): any {
            Promise.resolve().then((): void => {
                subject.next();
            });

            return previousRender.call(this);
        }

        observables.set(element, subject.asObservable());
    }

    return observables.get(element)!.pipe(
        isRendered(cmp) ? startWith((): void => void 0) : identity,
    ) as Observable<void>;
}
