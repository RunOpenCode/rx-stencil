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
    distinctUntilElementsChanged,
    observeSubtree,
}                                        from '../../utils';
import { ContentChildObservableOptions } from './content-child-observable';

export type ContentChildrenObservableOptions = ContentChildObservableOptions;

/**
 * Observes elements in the DOM subtree of the component that match the given selector.
 *
 * Uses mutation observer to observe changes in the DOM subtree of the component and emits value when content children
 * elements are added or removed (or attributes are changed, depending on configuration).
 *
 * When initialized, the observable will emit the current content children elements (or an empty array if they do not exist).
 *
 * Implementation is more performant when component uses shadow DOM, while for emulated shadow DOM, the observable will
 * filter out elements that are part of the emulated view child.
 *
 * @param {ComponentInterface} cmp The component instance to observe.
 * @param {string} selector The CSS selector to match the content children elements.
 * @param {ContentChildObservableOptions} options The options to configure the observable.
 *
 * @return {Observable<Element[]>} An observable that emits the content children elements (or an empty array if they do not exist).
 */
export function contentChildrenObservable<E extends Element = Element>(cmp: ComponentInterface, selector: string, options?: ContentChildrenObservableOptions): Observable<E[]> {
    let element: HTMLStencilElement = getElement(cmp);
    let mutations: Observable<void> = observeSubtree(element, {
        attributes:      options?.attributes,
        attributeFilter: options?.attributeFilter,
    }).pipe(
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
        map((): E[] => Array.from(element.querySelectorAll<E>(selector)).filter((candidate: E): boolean => !isEmulatedViewChild(candidate))),
        distinctUntilElementsChanged<E>(options.distinct),
    );
}
