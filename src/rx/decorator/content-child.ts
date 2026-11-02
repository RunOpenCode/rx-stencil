import {
    ComponentInterface,
    getElement,
}                                 from '@stencil/core';
import { Observable }             from 'rxjs';
import { applyOperators }   from '../../utils';
import {
    contentChildObservable,
    ContentChildObservableOptions,
} from '../observable';
import { ViewChildOptions } from './view-child';

let ledger: WeakMap<Element, Record<PropertyKey, boolean>> = new WeakMap<Element, Record<PropertyKey, boolean>>();

export type ContentChildOptions = ViewChildOptions & ContentChildObservableOptions;

export function ContentChild<E extends Element = Element>(selector: string, options?: ContentChildOptions): PropertyDecorator {
    return function (cmp: ComponentInterface, property: PropertyKey): void {
        let previous: (() => void) | null = cmp.connectedCallback || null;

        cmp.connectedCallback = function (): void {
            let element: HTMLElement = getElement(this);

            if (!ledger.has(element) || !ledger.get(element)?.[property]) {
                let observable: Observable<E | null> = contentChildObservable<E>(this, selector, options);

                applyOperators(observable, this, options);

                observable
                    .subscribe((value: E | null): void => {
                        (this as Record<PropertyKey, any>)[property] = value;
                    });

                let record: Record<PropertyKey, boolean> = ledger.get(element) || {};
                record[property]                    = true;

                ledger.set(element, record);
            }

            if (previous) {
                previous.call(this);
            }
        };
    };
}
