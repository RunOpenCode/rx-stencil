import {
    Observable,
    Subscriber,
    TeardownLogic,
} from 'rxjs';

/**
 * Create mutation observer and return observable that emits mutation records when the target node is mutated.
 *
 * @param {Node} target The target node to observe for mutations.
 * @param {MutationObserverInit} options The options for the mutation observer.
 */
export function mutationObservable(target: Node, options?: MutationObserverInit): Observable<MutationRecord[]> {
    return new Observable((observer: Subscriber<MutationRecord[]>): TeardownLogic => {
        let mutation: MutationObserver = new MutationObserver((mutations: MutationRecord[]): void => {
            observer.next(mutations);
        });

        mutation.observe(target, options);

        return (): void => {
            mutation.disconnect();
        };
    });
}
