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
}                                     from '../../utils/stencil';
import {
    distinctUntilElementChanged,
    observeSubtree,
}                                     from '../../utils/rxjs';
import { ViewChildObservableOptions } from './view-child-observable';

export type ContentChildObservableOptions = ViewChildObservableOptions;

export function contentChildObservable<E extends Element = Element>(cmp: ComponentInterface, selector: string, options?: ContentChildObservableOptions): Observable<E | null> {
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
            map((): E | null => element.querySelector<E>(selector)),
            distinctUntilElementChanged<E>(options.distinct),
        );
    }

    // When shadow DOM is emulated, we need to filter out elements that are part of the emulated view child.
    return mutations.pipe(
        map((): E | null => {
            let candidates: E[] = Array.from(element.querySelectorAll<E>(selector));

            for (let i: number = 0; i < candidates.length; i++) {
                let candidate: E = candidates[i];

                if (!isEmulatedViewChild(candidate, element)) {
                    return candidate;
                }
            }

            return null;
        }),
        distinctUntilElementChanged<E>(options.distinct),
    )
}
