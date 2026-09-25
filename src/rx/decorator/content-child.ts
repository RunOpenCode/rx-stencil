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
import { contentChildObservable } from '../observable/content-child-observable';
import { ViewChildOptions }       from './view-child';

export type ContentChildOptions = ViewChildOptions;

export function ContentChild<E extends Element = Element>(selector: string, options?: ContentChildOptions): any {
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
                    console.warn(`@ContentChild property "${property}" is read-only and cannot be set.`);
                }
            },
            get(this: ComponentInterface): E | null {
                let element: HTMLElement               = getElement(this);
                let registry: ValuesRegistry<E | null> = getRegistry<E | null>('@ContentChild');

                if (!registry.has(element, property)) {
                    let observable: Observable<E | null> = contentChildObservable<E>(this, selector, options);
                    observable                           = applyOperators(observable, this, options);

                    registry.set(element, property, observable);
                }

                return registry.value(element, property)! as E | null;
            },
        });
    };
}