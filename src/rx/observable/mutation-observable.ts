import {
    Observable,
    Subscriber,
    TeardownLogic,
} from 'rxjs';

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
