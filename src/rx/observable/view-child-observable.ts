import {
    ComponentInterface,
    getElement,
}                                      from '@stencil/core';
import {
    HostRef,
    HTMLStencilElement,
}                                      from '@stencil/core/internal';
import {
    map,
    Observable,
    startWith,
}                                      from 'rxjs';
import {
    getHostRef,
    isEmulatedViewChild,
    usesShadowDom,
}                                      from '../../utils/stencil';
import { distinctUntilElementChanged } from '../../utils/rxjs';
import { ElementComparatorFn }         from '../types';
import { renderObservable }            from './render-observable';

export type ViewChildObservableOptions = {
    /**
     * If true, the observable will only emit when the element changes. If false, the observable will emit every time
     * the component is rendered.
     *
     * You can also provide a custom comparator function to determine if the element has changed. The function should
     * return true if the elements are equal, and false if they are not. If you set value to true, the default
     * comparator function will be used, which compares the elements by reference.
     *
     * Default is true.
     */
    distinct?: ElementComparatorFn | boolean;
}

export function viewChildObservable<E extends Element = Element>(cmp: ComponentInterface, selector: string, options?: ViewChildObservableOptions): Observable<E | null> {
    let element: HTMLStencilElement = getElement(cmp);
    let hostRef: HostRef            = getHostRef(cmp);
    let rendered: Observable<void>  = renderObservable(cmp);

    options = {
        distinct: true,
        ...options,
    }

    if ((hostRef.$renderCount$ || 0) > 0) {
        rendered = rendered.pipe(
            startWith(void 0),
        );
    }

    // In shadow DOM, this is quite cheap, we can query only shadow DOM and skip the light DOM.
    if (usesShadowDom(cmp)) {
        return rendered.pipe(
            map((): E | null => (element.shadowRoot as ShadowRoot).querySelector(selector) as E | null),
            distinctUntilElementChanged<E>(options.distinct),
        )
    }

    // When shadow DOM is emulated, this is more expensive, we need to query light DOM and use first element
    // which matches the selector, and it is not a child of any emulated slot node.
    return rendered.pipe(
        map((): E | null => {
            let candidates: NodeListOf<Element> = element.querySelectorAll(selector);

            for (let i: number = 0; i < candidates.length; i++) {
                let candidate: E = candidates[i] as E;

                if (isEmulatedViewChild(candidate, element)) {
                    return candidate as E;
                }
            }

            return null;
        }),
        distinctUntilElementChanged<E>(options.distinct),
    );
}