import {
    Observable,
    Subject,
    takeUntil,
    Unsubscribable,
} from 'rxjs';
import {
    describe,
    it,
    expect,
    afterEach,
    beforeEach,
} from '@stencil/vitest';

import { mutationObservable } from '../../../rx';

describe('mutationObservable()', (): void => {

    let subscription: Unsubscribable;
    let document: Document;

    beforeEach((): void => {
        document = globalThis.document;
    });

    afterEach((): void => {
        subscription.unsubscribe();
    });

    it('Creates mutation observable and emits mutation records when the target node is mutated.', async (): Promise<void> => {
        let body: HTMLBodyElement                  = document.body as HTMLBodyElement;
        let observer: Observable<MutationRecord[]> = mutationObservable(body, {
            childList: true,
            subtree:   false,
        });
        let abort: Subject<void>                   = new Subject<void>();
        let collected: MutationRecord[]            = [];

        subscription = observer
            .pipe(takeUntil(abort))
            .subscribe((mutations: MutationRecord[]): void => {
                collected.push(...mutations);
            });

        body.append(document.createElement('div'));

        await Promise.resolve();

        expect(collected.length).toBe(1);
        expect(collected[0].type).toBe('childList');
        expect(collected[0].addedNodes.length).toBe(1);

        abort.next();

        body.append(document.createElement('div'));

        await Promise.resolve();

        expect(collected.length).toBe(1);
    });
});