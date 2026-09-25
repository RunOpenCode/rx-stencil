import { ComponentInterface }  from '@stencil/core';
import {
    filter,
    Observable,
    take,
}                              from 'rxjs';
import {
    ElementFilterFn,
    ElementsFilterFn,
}                              from '../rx';
import { ViewChildOptions }    from '../rx/decorator/view-child';
import { ViewChildrenOptions } from '../rx/decorator/view-children';
import { whileConnected }      from '../rx/operator/while-connected';

type ApplyOperatorsArgs<E extends Element> =
    | [
    observable: Observable<E | null>,
    cmp: ComponentInterface,
    options?: ViewChildOptions,
]
    | [
    observable: Observable<E[]>,
    cmp: ComponentInterface,
    options?: ViewChildrenOptions,
];

/**
 * Applies operators to the observable based on the provided options.
 *
 * @internal
 */
export function applyOperators<E extends Element = Element>(
    observable: Observable<E | null>,
    cmp: ComponentInterface,
    options?: ViewChildOptions,
): Observable<E | null>;
export function applyOperators<E extends Element = Element>(
    observable: Observable<E[]>,
    cmp: ComponentInterface,
    options?: ViewChildrenOptions,
): Observable<E[]>;
export function applyOperators<E extends Element = Element>(
    ...args: ApplyOperatorsArgs<E>
): Observable<E[]> | Observable<E | null> {
    let [observable, cmp, options] = args;

    return applyOperatorsInternal<E[] | (E | null)>(
        observable,
        cmp,
        options,
    ) as Observable<E[]> | Observable<E | null>;
}

/**
 * A TypeScript types hack to make the applyOperators function work
 * with both ViewChild and ViewChildren options.
 *
 * @internal
 */
function applyOperatorsInternal<T>(
    observable: Observable<T>,
    cmp: ComponentInterface,
    options?: {
        cached?: boolean;
        filter?: boolean | ElementFilterFn | ElementsFilterFn;
        whileConnected?: boolean;
    },
): Observable<T> {
    if (options?.whileConnected) {
        observable = observable.pipe(whileConnected(cmp, {
            reemit: true,
        }));
    }

    if (options?.filter) {
        observable = observable.pipe(
            true === options.filter
                ? filter((value: T): boolean => {
                    if (Array.isArray(value) && value.length > 0) {
                        return true;
                    }

                    return !!value;
                })
                : filter(options.filter as (value: T) => boolean),
        );
    }

    if (options?.cached) {
        observable = observable.pipe(take(1));
    }

    return observable;
}