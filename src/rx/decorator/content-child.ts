import {
    ComponentInterface,
    getElement,
}                                 from '@stencil/core';
import { Observable }             from 'rxjs';
import { applyOperators }         from '../../utils';
import { contentChildObservable } from '../observable';
import { ViewChildOptions }       from './view-child';

let ledger: WeakMap<Element, Record<string, boolean>> = new WeakMap<Element, Record<string, boolean>>();

export type ContentChildOptions = ViewChildOptions;

export function ContentChild<E extends Element = Element>(selector: string, options?: ContentChildOptions): any {
    return function (cmp: ComponentInterface, property: string): void {
        let previous: (() => void) | null = cmp.connectedCallback || null;

        cmp.connectedCallback = function (): void {
            let element: HTMLElement = getElement(this);

            if (!ledger.has(element) || !ledger.get(element)?.[property]) {
                let observable: Observable<E | null> = contentChildObservable<E>(this, selector, options);

                applyOperators(observable, this, options);

                observable
                    .subscribe((value: E | null): void => {
                        this[property] = value;
                    });

                let record: Record<string, boolean> = ledger.get(element) || {};
                record[property]                    = true;

                ledger.set(element, record);
            }

            if (previous) {
                previous.call(this);
            }
        };
    };
}