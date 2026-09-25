import {
    ComponentInterface,
    getElement,
} from '@stencil/core';
import {
    Observable,
    Subscriber,
    TeardownLogic,
} from 'rxjs'

export type EventHandlerOptions = {
    capture?: boolean;
    passive?: boolean;
    once?: boolean;
};

/**
 * Create an observable that emits events from a Stencil component.
 *
 * @param {ComponentInterface} cmp The Stencil component to listen for events on.
 * @param {string} eventName The name of the event to listen for.
 * @param {string} [delegate] An optional CSS selector to delegate the event to.
 * @param {EventHandlerOptions} [options] An optional object that specifies event listener options.
 * @returns {Observable<Event>} An observable that emits events of type T.
 */
export function fromEvent<T extends Event = Event>(
    cmp: ComponentInterface,
    eventName: string,
    delegate?: string,
    options?: EventHandlerOptions,
): Observable<T>
/**
 * Create an observable that emits events from a Stencil component.
 *
 * @param {ComponentInterface} cmp The Stencil component to listen for events on.
 * @param {string} eventName The name of the event to listen for.
 * @param {EventHandlerOptions} [options] An optional object that specifies event listener options.
 * @returns {Observable<Event>} An observable that emits events of type T.
 */
export function fromEvent<T extends Event = Event>(
    cmp: ComponentInterface,
    eventName: string,
    options?: EventHandlerOptions,
): Observable<T>
export function fromEvent<T extends Event = Event>(
    cmp: ComponentInterface,
    eventName: string,
    delegateOrOptions?: string | EventHandlerOptions,
    options?: EventHandlerOptions,
): Observable<T> {
    let element: HTMLElement                           = getElement(cmp);
    let delegate: string | undefined                   = 'string' === typeof delegateOrOptions ? delegateOrOptions : undefined;
    let configuration: EventHandlerOptions | undefined = 'object' === typeof delegateOrOptions ? delegateOrOptions : options;

    return new Observable<T>((subscriber: Subscriber<T>): TeardownLogic => {
        let handler: (event: Event) => void = (event: Event): void => {
            if (!delegate) {
                subscriber.next(event as T);
                return;
            }

            if (!(event.target instanceof Element)) {
                return;
            }

            if (!event.target.closest(delegate)) {
                return;
            }

            subscriber.next(event as T);
        };

        element.addEventListener(eventName, handler, configuration);

        return (): void => {
            element.removeEventListener(eventName, handler, configuration);
        };
    });
}
