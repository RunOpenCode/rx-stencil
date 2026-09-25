import {
    ComponentInterface,
    Build,
}                     from '@stencil/core';
import { HostRef }    from '@stencil/core/internal';
import {
    MonoTypeOperatorFunction,
    Observable,
    tap,
}                     from 'rxjs';
import { getHostRef } from '../../utils';

/**
 * Use this function to tap into a value stream and flush value to
 * component property.
 */
export function toProperty<T = any>(cmp: ComponentInterface, property: string): MonoTypeOperatorFunction<T> {
    if (Build.isDev && !cmp.hasOwnProperty(property)) {
        let ref: HostRef = getHostRef(cmp);
        console.warn(`It seams that ${property} does not exist on component ${ref.$cmpMeta$.$tagName$}. This warning will not be displayed in production environment.`);
    }

    return (source: Observable<T>): Observable<T> => {
        return source.pipe(
            tap((value: T): void => {
                cmp[property] = value;
            }),
        );
    };
}