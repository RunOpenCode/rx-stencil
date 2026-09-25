import { ComponentInterface } from '@stencil/core';
import {
    combineLatest,
    Observable,
}                             from 'rxjs';
import { propertyObservable } from './property-observable';

/**
 * Returns an observable that emits an array of values from the given properties.
 * 
 * It always emits an array of values, even if only one property is specified. The order
 * of the values in the emitted array corresponds to the order of the properties specified.
 * 
 * Do note that `combineLatest()` operator is used to combine the observables.
 */
export function propertiesObservable<T extends any[]>(cmp: ComponentInterface, ...properties: string[]): Observable<T> {
    if (0 === properties.length) {
        throw new Error('At least one property must be specified.');
    }

    return combineLatest(properties.map((property: string): Observable<any> => {
        return propertyObservable(cmp, property);
    })) as Observable<T>;
}
