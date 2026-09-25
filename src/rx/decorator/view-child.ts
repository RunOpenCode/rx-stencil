import {
    Build,
    ComponentInterface,
    getElement,
}                          from '@stencil/core';
import { Observable }      from 'rxjs';
import { applyOperators }  from '../../utils/decorator';
import {
    getRegistry,
    ValuesRegistry,
}                          from '../../utils/values-registry';
import {
    viewChildObservable,
    ViewChildObservableOptions,
}                          from '../observable/view-child-observable';
import { ElementFilterFn } from '../types';

export type ViewChildOptions = {
    /**
     * If true, the property value will be cached and will not be updated when DOM changes.
     *
     * Default is false.
     */
    cached?: boolean;

    /**
     * If true, the property will be updated only when the element is present in the DOM.
     *
     * Default is false.
     */
    filter?: boolean | ElementFilterFn;

    /**
     * If true, property will be updated only when component is connected to the DOM. If false,
     * property will be updated even if component is not connected to the DOM.
     *
     * This can be useful for cases where you want to move components in and out of the DOM, but
     * you want to react only while component is connected to the DOM.
     *
     * Default is false.
     */
    whileConnected?: boolean;
} & ViewChildObservableOptions;

export function ViewChild<E extends Element = Element>(selector: string, options?: ViewChildOptions): any {
    return function (cmp: ComponentInterface, property: string): void {
        let connectedCallback: (() => unknown) | undefined = cmp.connectedCallback;

        cmp.connectedCallback = function (): void {
            this[property]; // Access the property to initialize it and set up the observable.
            connectedCallback?.call(this);
        };

        let descriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(cmp.prototype, property) || {
            configurable: true,
            enumerable:   true,
        };

        delete descriptor['value'];
        delete descriptor['writable'];

        Object.defineProperty(cmp, property, {
            ...descriptor,
            set(this: ComponentInterface, _value: E | null): void {
                if (Build.isDev) {
                    console.warn(`@ViewChild property "${property}" is read-only and cannot be set.`);
                }
            },
            get(this: ComponentInterface): E | null {
                let element: HTMLElement               = getElement(this);
                let registry: ValuesRegistry<E | null> = getRegistry<E | null>('@ViewChild');

                if (!registry.has(element, property)) {
                    let observable: Observable<E | null> = viewChildObservable<E>(this, selector, options);
                    observable                           = applyOperators(observable, this, options);

                    registry.set(element, property, observable);
                }

                return registry.value(element, property)! as E | null;
            },
        });
    };
}