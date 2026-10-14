import {
    ComponentInterface,
    getElement,
}                                     from '@stencil/core';
import { HTMLStencilElement }         from '@stencil/core/internal';
import {
    map,
    Observable,
    startWith,
}                                     from 'rxjs';
import {
    isEmulatedViewChild,
    usesShadowDom,
    distinctUntilElementChanged,
    observeSubtree,
}                                     from '../../utils';
import { ViewChildObservableOptions } from './view-child-observable';

export type ContentChildObservableOptions = ViewChildObservableOptions & {
    /**
     * If `true`, the observable will monitor the attributes of the content children.
     *
     * This is not very efficient, so use it only if you really need it.
     *
     * Default is `false`.
     */
    attributes?: boolean;
    /**
     * If provided, the observable will monitor only the specified attributes of the content children.
     *
     * Use this to limit the number of attributes that are monitored, which can improve performance.
     *
     * Default is undefined, which means all attributes are monitored (assuming `attributes` is `true`).
     */
    attributeFilter?: string[];
}

/**
 * Observes element in the DOM subtree of the component that match the given selector.
 *
 * Uses mutation observer to observe changes in the DOM subtree of the component and emits value when content child
 * element is added or removed (or attributes are changed, depending on configuration).
 *
 * When initialized, the observable will emit the current content child element (or `null` if it does not exist).
 *
 * Implementation is more performant when component uses shadow DOM, while for emulated shadow DOM, the observable will
 * filter out elements that are part of the emulated view child.
 *
 * @param {ComponentInterface} cmp The component instance to observe.
 * @param {string} selector The CSS selector to match the content child element.
 * @param {ContentChildObservableOptions} options The options to configure the observable.
 *
 * @return {Observable<Element | null>} An observable that emits the content child element (or `null` if it does not exist).
 */
export function contentChildObservable<E extends Element = Element>(cmp: ComponentInterface, selector: string, options?: ContentChildObservableOptions): Observable<E | null> {
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
            map((): E | null => element.querySelector<E>(selector)),
            distinctUntilElementChanged<E>(options.distinct),
        );
    }

    // When shadow DOM is emulated, we need to filter out elements that are part of the emulated view child.
    return mutations.pipe(
        map((): E | null => {
            let candidates: E[] = Array.from(element.querySelectorAll<E>(selector));

            for (let i: number = 0; i < candidates.length; i++) {
                if (isEmulatedViewChild(candidates[i])) {
                    continue;
                }

                return candidates[i];
            }

            return null;
        }),
        distinctUntilElementChanged<E>(options.distinct),
    )
}
