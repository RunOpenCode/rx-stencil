import {
    ComponentInterface,
    getElement,
} from '@stencil/core';
import {
    filter,
    MonoTypeOperatorFunction,
    Observable,
    Subject,
    tap,
    merge,
} from 'rxjs';

export type WhileConnectedOptions = {
    /**
     * If true, the operator will re-emit the last value received from the source observable while component
     * was disconnected, when the component is re-connected to DOM. This is useful for cases where the
     * component may be disconnected and re-connected multiple times, and you want to ensure that the last
     * emitted value is still available when the component is re-connected.
     *
     * Default is false.
     */
    reemit?: boolean
}

/**
 * Operator that emits values from the source observable only
 * while the component is connected to DOM.
 *
 * This can be useful for cases where you want to move components in and out of the DOM,
 * but still want to receive values from an observable while the component is connected
 * and react to them.
 */
export function whileConnected<T = unknown>(cmp: ComponentInterface, options?: WhileConnectedOptions): MonoTypeOperatorFunction<T> {
    return (source: Observable<T>): Observable<T> => {
        let element: HTMLElement = getElement(cmp);
        let reemit: boolean      = options?.reemit || false;

        if (!reemit) {
            return source.pipe(
                filter((): boolean => element.isConnected),
            );
        }

        let captured: boolean    = false;
        let last: T | undefined  = undefined;
        let reemiter: Subject<T> = new Subject<T>();

        let previousConnectedCallback: (() => void) | undefined = cmp.connectedCallback;

        cmp.connectedCallback = function (): void {
            previousConnectedCallback?.call(this);

            if (!captured) {
                return;
            }

            reemiter.next(last as T);

            captured = false;
            last     = undefined;
        }

        return merge(
            reemiter,
            source.pipe(
                tap((value: T): void => {
                    if (element.isConnected) {
                        return;
                    }

                    captured = true;
                    last     = value;
                }),
                filter((): boolean => element.isConnected),
            ),
        );
    };
}
