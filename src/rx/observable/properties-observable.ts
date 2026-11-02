import { ComponentInterface } from '@stencil/core';
import {
    combineLatest,
    map,
    Observable,
}                             from 'rxjs';
import { propertyObservable } from './property-observable';

/**
 * Returns an observable that emits an object containing the latest values of
 * the specified properties of a Stencil component.
 *
 * Do note that `combineLatest()` operator is used to combine the observables.
 */
// Infer the type of the properties from the component interface.
export function propertiesObservable<
    T extends ComponentInterface,
    K extends keyof T
>(
    cmp: T,
    ...properties: K[]
): Observable<Pick<T, K>>;

// Explicitly specify the type of the properties as an object.
export function propertiesObservable<P extends object>(
    cmp: ComponentInterface,
    ...properties: (keyof P)[]
): Observable<P>;

export function propertiesObservable(cmp: ComponentInterface, ...properties: PropertyKey[]): Observable<Record<PropertyKey, unknown>> {
    if (0 === properties.length) {
        throw new Error('At least one property must be specified.');
    }

    return combineLatest(
        properties.map((property: PropertyKey): Observable<any> => propertyObservable(cmp, property)),
    ).pipe(
        map((values: any[]): Record<PropertyKey, unknown> => Object.fromEntries(
            properties.map((property: PropertyKey, index: number): any[] => [property, values[index]]),
        ) as Record<PropertyKey, unknown>),
    );
}
