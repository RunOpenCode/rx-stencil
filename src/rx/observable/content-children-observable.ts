import {
    ComponentInterface,
    getElement,
}                                        from '@stencil/core';
import { HTMLStencilElement }            from '@stencil/core/internal';
import {
    map,
    Observable,
    startWith,
}                                        from 'rxjs';
import {
    isEmulatedViewChild,
    usesShadowDom,
}                                        from '../../utils/stencil';
import {
    distinctUntilElementsChanged,
    observeSubtree,
}                                        from '../../utils/rxjs';
import { ViewChildrenObservableOptions } from './view-children-observable';

export type ContentChildrenObservableOptions = ViewChildrenObservableOptions;

export function contentChildrenObservable<E extends Element = Element>(cmp: ComponentInterface, selector: string, options?: ContentChildrenObservableOptions): Observable<E[]> {
    let element: HTMLStencilElement = getElement(cmp);
    let mutations: Observable<void> = observeSubtree(element).pipe(
        map((): void => void 0),
        startWith(void 0),
    )

    options = {
        distinct: true,
        ...options,
    }

    // In shadow DOM, we can just listen for the mutations and query the element directly.
    if (usesShadowDom(cmp)) {
        return mutations.pipe(
            map((): E[] => Array.from(element.querySelectorAll<E>(selector))),
            distinctUntilElementsChanged<E>(options.distinct),
        );
    }

    // When shadow DOM is emulated, we need to filter out elements that are part of the emulated view child.
    return mutations.pipe(
        map((): E[] => Array.from(element.querySelectorAll<E>(selector)).filter((candidate: E): boolean => !isEmulatedViewChild(candidate, element))),
        distinctUntilElementsChanged<E>(options.distinct),
    );
}
