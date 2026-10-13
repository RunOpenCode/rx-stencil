import {
    ComponentInterface,
    getElement,
}                                     from '@stencil/core';
import { HTMLStencilElement }         from '@stencil/core/internal';
import {
    from,
    map,
    Observable,
    startWith,
    switchMap,
}                                     from 'rxjs';
import {
    EmulatedSlotNode,
    isEmulatedViewChild,
    usesShadowDom,
    distinctUntilElementsChanged,
    isRendered,
}                                     from '../../utils';
import { renderObservable }           from './render-observable';
import { ViewChildObservableOptions } from './view-child-observable';

export type ViewChildrenObservableOptions = ViewChildObservableOptions;

export function viewChildrenObservable<E extends Element = Element>(cmp: ComponentInterface, selector: string, options?: ViewChildrenObservableOptions): Observable<E[]> {
    let element: HTMLStencilElement = getElement(cmp);
    let rendered: Observable<void>  = renderObservable(cmp);

    options = {
        distinct: true,
        ...options,
    }

    if (isRendered(cmp)) {
        rendered = rendered.pipe(
            startWith(void 0),
        );
    }

    // In shadow DOM, this is quite cheap, we can query only shadow DOM and skip the light DOM.
    if (usesShadowDom(cmp)) {
        return rendered.pipe(
            map((): E[] => Array.from((element.shadowRoot as ShadowRoot).querySelectorAll(selector))),
            distinctUntilElementsChanged<E>(options.distinct),
        )
    }

    // When shadow DOM is emulated, this is more expensive, we need to query light DOM and use elements
    // which matches the selector, and it is not a child of any emulated slot node.
    return rendered.pipe(
        switchMap((): Observable<void> => from(Promise.resolve())),
        map((): E[] => Array.from(element.querySelectorAll(selector) as NodeListOf<EmulatedSlotNode<E>>)),
        map((candidates: E[]): E[] => candidates.filter((candidate: E): boolean => isEmulatedViewChild(candidate, element))),
        distinctUntilElementsChanged<E>(options.distinct),
    );
}
