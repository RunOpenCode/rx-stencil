import {
    ComponentInterface,
    getElement,
} from '@stencil/core';
import {
    MonoTypeOperatorFunction,
    Observable,
    Subject,
    Subscriber,
    takeUntil,
    TeardownLogic,
} from 'rxjs';

/**
 * A map of component observables that are being watched for
 * disconnect callback invocation. A weak map is being used
 * so that the component instance can be garbage collected.
 *
 * {@internal}
 */
let disconnectObservables: WeakMap<ComponentInterface, Observable<void>> = new WeakMap();

/**
 * A function that creates an observable which emits an event
 * when the component is disconnected from DOM.
 *
 * {@internal}
 */
type CreateDisconnectObservableFn = (cmp: ComponentInterface) => Observable<void>;

/**
 * Creates an observable that emits a value when the component
 * is disconnected from DOM and method `disconnectedCallback()`
 * is invoked. StencilJS will supress the invocation of this
 * method if it is not defined on the component.
 *
 * {@internal}
 */
let createUsingDisconnectedCallback: CreateDisconnectObservableFn = function (cmp: ComponentInterface): Observable<void> {
    let previousDisconnected: Function | undefined = cmp.disconnectedCallback;

    if (!previousDisconnected) {
        throw new Error(`Component "${cmp.constructor.name}" does not have a "disconnectedCallback()" method defined.`);
    }

    let disconnectedSubject$: Subject<void> = new Subject<void>();

    cmp.disconnectedCallback = function (): void {
        if (previousDisconnected) {
            previousDisconnected.call(cmp);
        }

        disconnectedSubject$.next();
    };

    return disconnectedSubject$.asObservable();
}

/**
 * Mutation observer is our next heuristic. We will monitor parent
 * node of the component and emit a value when the component is
 * disconnected from DOM. This will only work, of course, if the
 * component is not the root node of the application and component
 * is already within DOM.
 *
 * {@internal}
 */
let createUsingMutationObserver: CreateDisconnectObservableFn = function (cmp: ComponentInterface): Observable<void> {
    let element: HTMLElement = getElement(cmp);

    if (null === element.parentNode) {
        throw new Error(`Component "${cmp.constructor.name}" is not within DOM.`);
    }

    return new Observable<void>((observer: Subscriber<void>): TeardownLogic => {

        let mutationObserver: MutationObserver = new MutationObserver((mutations: MutationRecord[]): void => {
            mutations.forEach((record: MutationRecord): void => {
                for (let node of Array.from(record.removedNodes)) {
                    if (node !== element) {
                        continue;
                    }

                    observer.next();
                    observer.complete();
                }
            });
        });

        mutationObserver.observe(element.parentNode, {
            childList: true,
            subtree:   true,
        });

        return (): void => {
            mutationObserver.disconnect();
            // we can not re-use this observable, so we have to delete it
            disconnectObservables.delete(cmp);
        };
    });


}

/**
 * Creates an observable that emits a value when the component
 * is disconnected from DOM.
 *
 * {@internal}
 */
function createDisconnectObservable(cmp: ComponentInterface): void {
    let functions: CreateDisconnectObservableFn[] = [
        createUsingDisconnectedCallback,
        createUsingMutationObserver,
    ];

    for (let fn of functions) {
        try {
            disconnectObservables.set(cmp, fn(cmp));
            return;
        } catch (e) {
            // noop
        }
    }

    throw new Error(`Could not create disconnect observable for component "${cmp.constructor.name}".`);
}

/**
 * Operator that unsubscribes from the source observable when
 * the component is disconnected from DOM.
 */
export function untilDisconnected<T = unknown>(cmp: ComponentInterface): MonoTypeOperatorFunction<T> {
    return (source: Observable<T>): Observable<T> => {
        if (!disconnectObservables.has(cmp)) {
            createDisconnectObservable(cmp);
        }

        let disconnectObservable$: Observable<void> = disconnectObservables.get(cmp);

        return source.pipe(
            takeUntil<T>(disconnectObservable$),
        );
    };
}
