import {
    ComponentInterface,
    getElement,
} from '@stencil/core';
import {
    filter,
    MonoTypeOperatorFunction,
    Observable,
    Subscriber,
    TeardownLogic,
    Subscription,
} from 'rxjs';

export type WhileConnectedOptions = {
    /**
     * Controls replay of values received while disconnected.
     *
     * If set to true, the last value received while disconnected will be re-emitted when
     * the component is reconnected. If set to false, values received while disconnected will be
     * discarded. If set to a number, that number of last values will be re-emitted when the
     * component is reconnected. In special case, if set to Infinity, all values received while
     * disconnected will be re-emitted when the component is reconnected.
     *
     * Default is false.
     */
    reemit?: boolean | number;
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
        let element: HTMLElement     = getElement(cmp);
        let reemit: boolean | number = options?.reemit || false;

        if (typeof reemit === 'number' && !(reemit === Infinity || (Number.isInteger(reemit) && reemit > 0))) {
            throw new Error('"reemit" must be boolean, positive integer or Infinity.');
        }

        if (false === reemit) {
            return source.pipe(
                filter((): boolean => element.isConnected),
            );
        }

        return new Observable<T>((subscriber: Subscriber<T>): TeardownLogic => {
            let buffer: T[]                                         = [];
            let limit: number                                       = reemit === true ? 1 : reemit;
            let completed: boolean                                  = false;
            let previousConnectedCallback: (() => void) | undefined = cmp.connectedCallback;
            let subscription: Subscription                          = source.subscribe({
                next(value: T): void {
                    if (element.isConnected) {
                        subscriber.next(value);
                        return;
                    }

                    buffer.push(value);

                    if (buffer.length > limit) {
                        buffer.shift();
                    }
                },
                error(error: unknown): void {
                    subscriber.error(error);
                },
                complete(): void {
                    completed = true;

                    if (buffer.length === 0) {
                        subscriber.complete();
                    }
                },
            });

            cmp.connectedCallback = function (this: ComponentInterface): void {
                previousConnectedCallback?.call(this);

                if (subscriber.closed) {
                    return;
                }

                while (element.isConnected && buffer.length > 0 && !subscriber.closed) {
                    subscriber.next(buffer.shift() as T);
                }

                if (completed && buffer.length === 0) {
                    subscriber.complete();
                }
            };

            return (): void => {
                subscription.unsubscribe();

                buffer                = [];
                cmp.connectedCallback = previousConnectedCallback;
            };
        });
    };
}
