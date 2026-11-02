import {
    ComponentInterface,
    getElement,
}                                    from '@stencil/core';
import { Observable }                from 'rxjs';
import { applyOperators }       from '../../utils';
import {
    ContentChildObservableOptions,
    contentChildrenObservable,
} from '../observable';
import { ViewChildrenOptions }  from './view-children';

let ledger: WeakMap<Element, Record<PropertyKey, boolean>> = new WeakMap<Element, Record<PropertyKey, boolean>>();

export type ContentChildrenOptions = ViewChildrenOptions & ContentChildObservableOptions;

export function ContentChildren<E extends Element = Element>(selector: string, options?: ContentChildrenOptions): PropertyDecorator {
    return function (cmp: ComponentInterface, property: PropertyKey): void {
        let previous: (() => void) | undefined = cmp.connectedCallback;

        cmp.connectedCallback = function (): void {
            let element: HTMLElement = getElement(this);

            if (!ledger.has(element) || !ledger.get(element)?.[property]) {
                let observable: Observable<E[]> = contentChildrenObservable<E>(this, selector, options);

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
