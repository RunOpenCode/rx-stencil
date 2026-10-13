import {
    ComponentInterface,
    getElement,
}                             from '@stencil/core';
import { HTMLStencilElement } from '@stencil/core/internal';
import {
    BehaviorSubject,
    Observable,
}                             from 'rxjs';

/**
 * A weak map to store observables for each component instance. We reuse the same
 * observable for each component instance to avoid creating multiple observables for the same component.
 */
let observables: WeakMap<HTMLStencilElement, Observable<boolean>> = new WeakMap();

/**
 * Observes the connection state of a Stencil component to the DOM.
 *
 * Connected observable is just a simple wrapper around Stencil's `connectedCallback()` and `disconnectedCallback()`
 * lifecycle methods which emits value when component is connected to the DOM, or disconnected from it. When created,
 * current state of component is immediately emitted.
 *
 * Uses hot observable pattern, which means that the observable is shared between all subscribers and emits the same
 * value to all of them.
 *
 * @param {ComponentInterface} cmp The Stencil component instance to observe.
 *
 * @returns {Observable<boolean>} An observable that emits `true` when the component is connected to the DOM and `false`
 * when it is disconnected.
 */
export function connectedObservable(cmp: ComponentInterface): Observable<boolean> {
    let element: HTMLStencilElement = getElement(cmp);

    if (!observables.has(element)) {
        let observable: BehaviorSubject<boolean> = new BehaviorSubject(element.isConnected);

        let previousConnected: (() => void) | undefined    = cmp.connectedCallback;
        let previousDisconnected: (() => void) | undefined = cmp.disconnectedCallback;

        observable.next(element.isConnected);

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
