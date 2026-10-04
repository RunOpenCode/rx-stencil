import {
    BehaviorSubject,
    Subject,
} from 'rxjs';
import {
    describe,
    it,
} from 'vitest';
import {
    expect,
    render,
    h,
} from '@stencil/vitest';

import './../../../components/async/async'

describe('rx-async', (): void => {

    it('Renders scalar.', async (): Promise<void> => {
        let {root, waitForChanges}      = await render(
            <rx-async />,
        );
        let element: HTMLRxAsyncElement = root as HTMLRxAsyncElement;

        expect(element).toEqualText('');

        element.value = 1;

        await waitForChanges();

        expect(element).toEqualText('1');

        element.value = 2.5;

        await waitForChanges();

        expect(element).toEqualText('2.5');

        element.value = true;

        await waitForChanges();

        expect(element).toEqualText('true');

        element.value = undefined;

        await waitForChanges();

        expect(element).toEqualText('');

        element.value = null;

        await waitForChanges();

        expect(element).toEqualText('');
    });

    it('Renders promise.', async (): Promise<void> => {
        let {root, waitForChanges}      = await render(
            <rx-async />,
        );
        let element: HTMLRxAsyncElement = root as HTMLRxAsyncElement;

        expect(element).toEqualText('');

        element.value = Promise.resolve('foo');

        await waitForChanges();

        expect(element).toEqualText('foo');

        element.value = Promise.resolve('bar');

        await waitForChanges();

        expect(element).toEqualText('bar');
    });

    it('Waits for promise to be resolved.', async (): Promise<void> => {
        let {root, waitForChanges}                    = await render(
            <rx-async />,
        );
        let element: HTMLRxAsyncElement               = root as HTMLRxAsyncElement;
        let resolve: ((arg: any) => void) | undefined = undefined;

        expect(element).toEqualText('');


        element.value = new Promise((res: (arg: any) => void): void => {
            resolve = res;
        });

        await waitForChanges();

        expect(element).toEqualText('');

        resolve!('baz');

        await waitForChanges();

        expect(element).toEqualText('baz');
    });

    it('Renders observable.', async (): Promise<void> => {
        let {root, waitForChanges}      = await render(
            <rx-async />,
        );
        let element: HTMLRxAsyncElement = root as HTMLRxAsyncElement;
        let observable: Subject<any>    = new Subject<any>();

        expect(element).toEqualText('');

        element.value = observable;

        await waitForChanges();

        expect(element).toEqualText('');

        observable.next('foo');

        await waitForChanges();

        expect(element).toEqualText('foo');

        observable.next('bar');

        await waitForChanges();

        expect(element).toEqualText('bar');

        element.value = new BehaviorSubject<any>(1);

        await waitForChanges();

        expect(element).toEqualText('1');
    });

    it('Applies transformation.', async (): Promise<void> => {
        let {root, waitForChanges}      = await render(
            <rx-async
                transform={(value: any): string => value ? `Value: ${String(value)}` : ''}
            />,
        );
        let element: HTMLRxAsyncElement = root as HTMLRxAsyncElement;

        expect(element).toEqualText('');

        element.value = 1;

        await waitForChanges();

        expect(element).toEqualText('Value: 1');

        element.value = Promise.resolve(2.5);

        await waitForChanges();

        expect(element).toEqualText('Value: 2.5');

        element.value = new BehaviorSubject<any>(2);

        await waitForChanges();

        expect(element).toEqualText('Value: 2');
    });

});
