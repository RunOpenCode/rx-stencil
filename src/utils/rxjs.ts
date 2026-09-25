import {
    distinctUntilChanged,
    filter,
    identity,
    MonoTypeOperatorFunction,
    Observable,
} from 'rxjs';
import {
    mutationObservable,
    ElementComparatorFn,
} from '../rx';

/**
 * Returns an RxJS operator that emits only when the element changes, based on the provided comparator function.
 *
 * If boolean `true` is provided, the default comparator function will be used, which compares the elements by reference.
 *
 * If falsy value is provided, the operator will emit every time the source observable emits.
 *
 * @internal
 */
export function distinctUntilElementChanged<E extends Element = Element>(comparator?: ElementComparatorFn<E> | boolean): MonoTypeOperatorFunction<E | null> {
    if (!comparator) {
        return identity;
    }

    if ('function' === typeof comparator) {
        return distinctUntilChanged<E | null>(comparator);
    }

    return distinctUntilChanged<E | null>();
}

/**
 * Returns an RxJS operator that emits only when the array of elements changes, based on the provided comparator function.
 *
 * If boolean `true` is provided, the default comparator function will be used, which compares the elements by reference.
 *
 * If falsy value is provided, the operator will emit every time the source observable emits.
 *
 * @internal
 */
export function distinctUntilElementsChanged<E extends Element = Element>(comparator?: ElementComparatorFn<E> | boolean): MonoTypeOperatorFunction<E[]> {
    if (!comparator) {
        return identity;
    }

    // If the comparator is a function, use it to compare elements. Otherwise, use the default comparator that compares elements by reference.
    let cmpFn: ElementComparatorFn<E> = 'function' === typeof comparator ? comparator : (previous: E | null, current: E | null): boolean => previous === current;

    return distinctUntilChanged<E[]>((previous: E[], current: E[]): boolean => {
        if (previous.length !== current.length) {
            return false;
        }

        return previous?.every((item: E, index: number): boolean => cmpFn(item, current![index])) ?? false;
    });
}

/**
 * Observe the subtree of an element for mutations.
 *
 * This function returns an observable that emits an array of MutationRecords whenever a mutation occurs
 * in the subtree of the specified element.
 *
 * @internal
 */
export function observeSubtree(element: HTMLElement): Observable<MutationRecord[]> {
    return mutationObservable(element, {
        childList: true,
        subtree:   true,
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
    );
}
