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
export function QuerySelectorAll<T extends HTMLElement = HTMLElement>(selector: string, shadowRoot: boolean = false): any {
    return (target: Function, property: string): void => {
        let descriptor: PropertyDescriptor = {
            set: function (): void {
                throw new Error(`Property "${property}" is read-only.`);
            },
            get: function (this: ComponentInterface): Observable<T | null> {
                let observableProperty: string = `__rx__query_selector_all__observable__shadow_root__${shadowRoot ? 'yes' : 'no'}__selector__${selector}__`;

                if (!this[observableProperty]) {
                    let root: HTMLElement | ShadowRoot = getElement(this);

                    if (shadowRoot) {
                        root = root.shadowRoot;
                    }

                    this[observableProperty] = renderObservable(this).pipe(
                        startWith(),
                        map((): T[] => Array.from(root.querySelectorAll(selector))),
                        distinctUntilChanged((previous: T[], current: T[]): boolean => {
                            if (previous.length !== current.length) {
                                return false;
                            }

                            for (let i: number = 0; i < previous.length; i++) {
                                if (previous[i] !== current[i]) {
                                    return false;
                                }
                            }

                            return true;
                        }),
                        shareReplay(1),
                    );
                }

                return this[observableProperty];
            },
        }

        Object.defineProperty(target, property, descriptor);
    };
}
