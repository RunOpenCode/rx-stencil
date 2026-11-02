import {
    ComponentInterface,
    getElement,
}                          from '@stencil/core';
import { Observable }      from 'rxjs';
import { applyOperators }  from '../../utils';
import {
    viewChildObservable,
    ViewChildObservableOptions,
}                          from '../observable';
import { ElementFilterFn } from '../types';

let ledger: WeakMap<Element, Record<PropertyKey, boolean>> = new WeakMap<Element, Record<PropertyKey, boolean>>();

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

export function ViewChild<E extends Element = Element>(selector: string, options?: ViewChildOptions): PropertyDecorator {
    return function (cmp: ComponentInterface, property: PropertyKey): void {
        let previous: (() => void) | null = cmp.connectedCallback || null;

        cmp.connectedCallback = function (): void {
            let element: HTMLElement = getElement(this);

            if (!ledger.has(element) || !ledger.get(element)?.[property]) {
                let observable: Observable<E | null> = viewChildObservable<E>(this, selector, options);

                applyOperators(observable, this, options);

                observable
                    .subscribe((value: E | null): void => {
                        (this as Record<PropertyKey, E | null>)[property] = value;
                    });

                let record: Record<PropertyKey, boolean> = ledger.get(element) || {};
                record[property]                         = true;

                ledger.set(element, record);
            }

            if (previous) {
                previous.call(this);
            }
        };

    };
}