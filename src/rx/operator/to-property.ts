import { ComponentInterface }             from '@stencil/core';
import {
    MonoTypeOperatorFunction,
    tap,
}                                from 'rxjs';
import { getPropertyDescriptor } from '../../utils';

/**
 * Use this function to tap into a value stream and flush value to
 * component property. You may also use this function as subscription
 * function (function will detect that value is passed instead of
 * observable).
 */
export function toProperty<T = any>(cmp: ComponentInterface, property: string): MonoTypeOperatorFunction<T> {
    // ensure that the property is defined on the component.
    getPropertyDescriptor(cmp, property);

    // @ts-ignore
    return (source: Observable<T>): Observable<T> | void => {
        return source.pipe(
            tap((value: T): void => {
                cmp[property] = value;
            }),
        );
    };
}
