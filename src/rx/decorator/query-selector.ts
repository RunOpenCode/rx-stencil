import {
    ComponentInterface,
    getElement,
}                           from '@stencil/core';
import {
    distinctUntilChanged,
    map,
    Observable,
    shareReplay,
    startWith,
}                           from 'rxjs';
import { renderObservable } from '../observable';

/**
 * Property decorator inspired by Angular's @ViewChild/@ContentChild.
 *
 * After each render, the decorated property will be set to the first element
 * matching the given selector. If no element is found, the property will be
 * set to null.
 */
export function QuerySelector<T extends HTMLElement = HTMLElement>(selector: string, shadowRoot: boolean = false): any {
    return (target: Function, property: string): void => {
        let descriptor: PropertyDescriptor = {
            set: function (): void {
                throw new Error(`Property "${property}" is read-only.`);
            },
            get: function (this: ComponentInterface): Observable<T | null> {
                let observableProperty: string = `__rx__query_selector__observable__shadow_root__${shadowRoot ? 'yes' : 'no'}__selector__${selector}__`;

                if (!this[observableProperty]) {
                    let root: HTMLElement | ShadowRoot = getElement(this);

                    if (shadowRoot) {
                        root = root.shadowRoot;
                    }

                    this[observableProperty] = renderObservable(this).pipe(
                        startWith(),
                        map((): T => root.querySelector(selector)),
                        distinctUntilChanged(),
                        shareReplay(1),
                    );
                }

                return this[observableProperty];
            },
        }

        Object.defineProperty(target, property, descriptor);
    };
}
