import {
    Build,
    ComponentInterface,
    getElement,
}                                    from '@stencil/core';
import { Observable }                from 'rxjs';
import { applyOperators }            from '../../utils/decorator';
import {
    getRegistry,
    ValuesRegistry,
}                                    from '../../utils/values-registry';
import { contentChildrenObservable } from '../observable/content-children-observable';
import { ViewChildrenOptions }       from './view-children';

export type ContentChildrenOptions = ViewChildrenOptions;

export function ContentChildren<E extends Element = Element>(selector: string, options?: ContentChildrenOptions): any {
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
                    console.warn(`@ContentChildren property "${property}" is read-only and cannot be set.`);
                }
            },
            get(this: ComponentInterface): E[] {
                let element: HTMLElement          = getElement(cmp);
                let registry: ValuesRegistry<E[]> = getRegistry<E[]>('@ContentChildren');

                if (!registry.has(element, property)) {
                    let observable: Observable<E[]> = contentChildrenObservable<E>(this, selector, options);
                    observable                      = applyOperators(observable, this, options);

                    registry.set(element, property, observable);
                }

                return registry.value(element, property)! as E[];
            },
        });
    };
}
