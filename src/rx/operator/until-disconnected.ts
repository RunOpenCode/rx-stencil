import { ComponentInterface }  from '@stencil/core';
import {
    filter,
    MonoTypeOperatorFunction,
    Observable,
    skip,
    take,
    takeUntil,
}                              from 'rxjs';
import { connectedObservable } from '../observable';

/**
 * Operator that unsubscribes from the source observable when
 * the component is disconnected from DOM.
 */
export function untilDisconnected<T = unknown>(cmp: ComponentInterface): MonoTypeOperatorFunction<T> {
    return (source: Observable<T>): Observable<T> => {
        let signal: Observable<boolean> = connectedObservable(cmp)
            .pipe(
                skip(1),
                filter((isConnected: boolean): boolean => !isConnected),
                take(1),
            );

        return source.pipe(
            takeUntil<T>(signal),
        );
    };
}
