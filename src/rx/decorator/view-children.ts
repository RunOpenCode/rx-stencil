import {
    Build,
    ComponentInterface,
    getElement,
}                                 from '@stencil/core';
import { Observable }             from 'rxjs';
import { applyOperators }         from '../../utils/decorator';
import {
    getRegistry,
    ValuesRegistry,
}                                 from '../../utils/values-registry';
import { viewChildrenObservable } from '../observable/view-children-observable';
import { ElementsFilterFn }       from '../types';
import { ViewChildOptions }       from './view-child';

export type ViewChildrenOptions = Omit<ViewChildOptions, 'filter'> & {
    /**
     * If true, the property will be updated only when the elements are present in the DOM.
     *
     * Default is false.
     */
    filter?: boolean | ElementsFilterFn;
}

export function ViewChildren<E extends Element = Element>(selector: string, options?: ViewChildrenOptions): any {
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
            set(this: ComponentInterface, _value: E[]): void {
                if (Build.isDev) {
                    console.warn(`@ViewChildren property "${property}" is read-only and cannot be set.`);
                }
            },
            get(this: ComponentInterface): E[] {
                let element: HTMLElement          = getElement(cmp);
                let registry: ValuesRegistry<E[]> = getRegistry<E[]>('@ViewChildren');

                if (!registry.has(element, property)) {
                    let observable: Observable<E[]> = viewChildrenObservable<E>(this, selector, options);
                    observable                      = applyOperators(observable, this, options);

                    registry.set(element, property, observable);
                }

                return registry.value(element, property)! as E[];
            },
        });
    };
}
