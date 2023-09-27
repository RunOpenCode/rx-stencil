import {
    ComponentInterface,
    getElement,
} from '@stencil/core';
import {
    distinctUntilChanged,
    filter,
    map,
    Observable,
    shareReplay,
    startWith,
} from 'rxjs';
import {
    mutationObservable,
    renderObservable,
} from '../observable';

/**
 * Options for QuerySelector decorator.
 */
export type QuerySelectorOptions = {
    /**
     * If `true`, the element will be searched in the shadow root. Default is `false`.
     */
    shadowRoot?: boolean;
    /**
     * If `true`, mutation observer instead of `renderObservable` from this package will
     * be used to detect changes. Default is `false`.
     */
    mutationObserver?: boolean;
};

/**
 * Observe all sub nodes of the given node and notify
 * when any of them is removed and/or added.
 *
 * {@internal}
 */
export function observeSubNodes(target: Node): Observable<void> {
    return mutationObservable(target, {
        subtree:   true,
        childList: true,
    }).pipe(
        filter((records: MutationRecord[]): boolean => {
            for (let i: number = 0; i < records.length; i++) {
                if ('childList' !== records[i].type) {
                    continue;
                }

                if (records[i].addedNodes.length || records[i].removedNodes.length) {
                    return true;
                }
            }

            return false;
        }),
        map((): void => {
            /* noop */
        }),
    );
}

/**
 * Property decorator inspired by Angular's @ViewChild/@ContentChild.
 *
 * After each render, the decorated property will be set to the first element
 * matching the given selector. If no element is found, the property will be
 * set to null.
 */
export function QuerySelector<T extends HTMLElement = HTMLElement>(selector: string, options?: QuerySelectorOptions): any {
    return (target: Function, property: string): void => {
        let descriptor: PropertyDescriptor = {
            set: function (): void {
                throw new Error(`Property "${property}" is read-only.`);
            },
            get: function (this: ComponentInterface): Observable<T | null> {
                let observableProperty: string = `__rx__query_selector__observable__shadow_root__${options?.shadowRoot ? 'yes' : 'no'}__mutation_observer__${options?.mutationObserver ? 'yes' : 'no'}__selector__${selector}__`;

                if (!this[observableProperty]) {
                    let root: HTMLElement | ShadowRoot = options?.shadowRoot ? getElement(this).shadowRoot : getElement(this);
                    let observable: Observable<void>   = options?.mutationObserver ? observeSubNodes(root) : renderObservable(this);

                    this[observableProperty] = observable.pipe(
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
