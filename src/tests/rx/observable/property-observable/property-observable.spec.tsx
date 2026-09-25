import './../../../../components/async/async';
import './test-property-observable.component';

import {
    describe,
    it,
    expect,
    render,
    h,
}                          from '@stencil/vitest';
import { BehaviorSubject } from 'rxjs';

describe('propertyObservable().', (): void => {

    // TODO Replace this test with mock component.
    it('Monitors state/prop on component.', async (): Promise<void> => {
        let {root, waitForChanges, setProps} = await render(
            <rx-async value={new BehaviorSubject<string>('foo')} />,
        );
        let element: HTMLRxAsyncElement      = root as HTMLRxAsyncElement;

        expect(element).toEqualText('foo');

        (element.value as BehaviorSubject<string>).next('bar');

        await waitForChanges();

        expect(element).toEqualText('bar');

        await setProps({
            value: Promise.resolve('baz'),
        });

        await waitForChanges();

        expect(element).toEqualText('baz');
    });

    it('Monitors other props on component.', async (): Promise<void> => {
        let {root, waitForChanges}                     = await render(
            <test-property-observable />,
        );
        let element: HTMLTestPropertyObservableElement = root as HTMLTestPropertyObservableElement;

        expect(element).toEqualText('foo');

        await element.setValue('bar');

        await waitForChanges();

        expect(element).toEqualText('bar');
    });

});