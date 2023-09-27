import { ComponentInterface }             from '@stencil/core';
import {
    BehaviorSubject,
    distinctUntilChanged,
    Observable,
}                                from 'rxjs';
import { getPropertyDescriptor } from '../../utils';

/**
 * Returns an observable that emits property value when the component property value changes.
 */
export function propertyObservable<T = any>(cmp: ComponentInterface, property: string): Observable<T> {
    let subjectProperty: string = `__rx__subject_for_property__${property}__`;

    if (!cmp[subjectProperty]) {
        let descriptor: PropertyDescriptor       = getPropertyDescriptor(cmp, property);
        let previousSetter: Function | undefined = descriptor.set;
        let previousGetter: Function | undefined = descriptor.get;

        // we have to invoke previous getter on component instance to get the current value
        let currentValue: T             = undefined !== previousGetter ? previousGetter.call(cmp) : descriptor.value;
        let subject: BehaviorSubject<T> = new BehaviorSubject<T>(currentValue);

        descriptor.set = function (value: T): void {
            if (previousSetter) {
                previousSetter.call(this, value);
            }

            subject.next(value);
        };

        Object.defineProperty(cmp, property, descriptor);

        cmp[subjectProperty] = subject;
    }

    return cmp[subjectProperty]
        .asObservable()
        .pipe(distinctUntilChanged());
}
