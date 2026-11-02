import {
    ComponentInterface,
    getElement,
}                  from '@stencil/core';
import { HostRef } from '@stencil/core/internal';
import { BUILD }   from '@stencil/core/internal/app-data';
import {
    BehaviorSubject,
    distinctUntilChanged,
    Observable,
}                  from 'rxjs';
import {
    getHostRef,
    isPropOrState,
}                  from '../../utils';

type SubjectsMap = Record<PropertyKey, BehaviorSubject<unknown>>;

/**
 * A WeakMap to store BehaviorSubjects for each component property.
 *
 * The key is the HTMLElement (component instance), and the value is a record of property names to BehaviorSubjects.
 *
 * @internal
 */
let subjects: WeakMap<HTMLElement, SubjectsMap> = new WeakMap<HTMLElement, SubjectsMap>();

/**
 * The name of the watcher callback function that will be registered on the component instance.
 */
const WATCHER_CALLBACK_NAME: string = '__runopencode_rx_stencil_watcher';

/**
 * Returns an observable that emits property value when the component property value changes.
 */
// Infer public property type.
export function propertyObservable<
    C extends ComponentInterface,
    K extends keyof C
>(
    cmp: C,
    property: K,
): Observable<C[K]>;

// Explicitly specify property type.
export function propertyObservable<T = unknown>(
    cmp: ComponentInterface,
    property: PropertyKey,
): Observable<T>;

export function propertyObservable(cmp: ComponentInterface, property: PropertyKey): Observable<unknown> {
    let element: HTMLElement = getElement(cmp);
    let initialize: boolean  = false;

    if (!subjects.has(element)) {
        subjects.set(element, {});
    }

    if (!subjects.get(element)![property]) {
        subjects.get(element)![property] = new BehaviorSubject<unknown>((cmp as any)[property]);
        initialize                       = true;
    }

    if (!initialize) {
        return (subjects.get(element) as SubjectsMap)[property]
            .asObservable()
            .pipe(distinctUntilChanged());
    }

    let subject: BehaviorSubject<unknown> = subjects.get(element)![property] as BehaviorSubject<unknown>;
    let isMember: boolean                 = isPropOrState(cmp, property);

    // If the property is not a member of the component (not decorated with @Prop or @State), 
    // we can watch it by modifying the property descriptor directly.
    if (!isMember) {
        let descriptor: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(cmp, property);

        Object.defineProperty(cmp, property, {
            get(this: ComponentInterface): unknown {
                return subject.value;
            },
            set(this: ComponentInterface, value: unknown): void {
                subject.next(value);

                if (descriptor && descriptor.set) {
                    descriptor.set.call(this, value);
                }
            },
            configurable: true,
            enumerable:   true,
        })

        return subject
            .asObservable()
            .pipe(distinctUntilChanged());
    }

    let hostRef: HostRef = getHostRef(cmp);

    // If callback function is not registered on the component, we need to register it and ensure that some of the
    // stencil internal flags are set to ensure that the callback will be called when the property changes.
    if (!cmp[WATCHER_CALLBACK_NAME]) {
        // This flag ensures that Stencil will call the prop change callback when the property changes.
        BUILD.propChangeCallback     = true;
        // $flags$ needs to include 128 (0x80) to indicate that the component has watchers.
        hostRef.$flags$ |= 128;
        // $watchers$ object needs to exist so we can add them for property.
        hostRef.$cmpMeta$.$watchers$ = hostRef.$cmpMeta$.$watchers$ || {};
        // Finally, we need to register the watcher callback function on the component instance.
        cmp[WATCHER_CALLBACK_NAME]   = function (current: unknown, _previous: unknown, property: string): void {
            let element: HTMLElement              = getElement(this);
            let subject: BehaviorSubject<unknown> = subjects.get(element)![property] as BehaviorSubject<unknown>;
            subject.next(current);
        }
    }

    hostRef.$cmpMeta$.$watchers$![property as string] = hostRef.$cmpMeta$.$watchers$![property as string] || [];
    hostRef.$cmpMeta$.$watchers$![property as string].push({
        [WATCHER_CALLBACK_NAME]: 0,
    });

    return subject
        .asObservable()
        .pipe(distinctUntilChanged());
}
