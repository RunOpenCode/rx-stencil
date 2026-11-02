import {
    ComponentInterface,
    getElement,
}                                 from '@stencil/core';
import { Observable }             from 'rxjs';
import { applyOperators }         from '../../utils';
import { viewChildrenObservable } from '../observable';
import { ElementsFilterFn }       from '../types';
import { ViewChildOptions }       from './view-child';

let ledger: WeakMap<Element, Record<PropertyKey, boolean>> = new WeakMap<Element, Record<PropertyKey, boolean>>();

export type ViewChildrenOptions = Omit<ViewChildOptions, 'filter'> & {
    /**
     * If true, the property will be updated only when the elements are present in the DOM.
     *
     * Default is false.
     */
    filter?: boolean | ElementsFilterFn;
}

export function ViewChildren<E extends Element = Element>(selector: string, options?: ViewChildrenOptions): PropertyDecorator {
    return function (cmp: ComponentInterface, property: PropertyKey): void {
        let previous: (() => void) | null = cmp.connectedCallback || null;

        cmp.connectedCallback = function (): void {
            let element: HTMLElement = getElement(this);

            if (!ledger.has(element) || !ledger.get(element)?.[property]) {
                let observable: Observable<E[]> = viewChildrenObservable<E>(this, selector, options);

                applyOperators(observable, this, options);

                observable
                    .subscribe((value: E[]): void => {
                        (this as Record<PropertyKey, E[]>)[property] = value;
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
