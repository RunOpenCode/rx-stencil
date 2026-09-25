import {
    ComponentInterface,
    getElement,
} from '@stencil/core';
import {
    BehaviorSubject,
    Observable,
} from 'rxjs';

let observables: WeakMap<HTMLElement, Observable<boolean>> = new WeakMap();

/**
 * Returns an observable that emits `true` when the component is connected to DOM,
 * and `false` when it is disconnected from DOM.
 *
 * Uses hot observable pattern.
 */
export function connectedObservable(cmp: ComponentInterface): Observable<boolean> {
    let element: HTMLElement = getElement(cmp);

    if (!observables.has(element)) {
        let previousConnected: (() => void) | undefined    = cmp.connectedCallback;
        let previousDisconnected: (() => void) | undefined = cmp.disconnectedCallback;
        let observable: BehaviorSubject<boolean>           = new BehaviorSubject(element.isConnected);

        cmp.connectedCallback = function (): void {
            previousConnected?.call(this);
            observable.next(true);
        }

        cmp.disconnectedCallback = function (): void {
            previousDisconnected?.call(this);
            observable.next(false);
        }

        observables.set(element, observable.asObservable());
    }

    return observables.get(element) as Observable<boolean>;
}
