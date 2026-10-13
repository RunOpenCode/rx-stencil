import {
    describe,
    it,
    expect,
    render,
    h,
} from '@stencil/vitest';

describe('propertyObservable().', (): void => {

    it('Monitors props/state/members of the component.', async (): Promise<void> => {
        let {root, waitForChanges}                     = await render(
            <test-property-observable />,
        );
        let element: HTMLTestPropertyObservableElement = root as HTMLTestPropertyObservableElement;

        expect(element).toEqualText('');

        await element.setValue({
            property: 'bar',
        });

        await waitForChanges();

        expect(element).toEqualText('Property: "bar"');

        await element.setValue({});

        await waitForChanges();

        expect(element).toEqualText('');

        await element.setValue({
            state: 'bar',
        });

        await waitForChanges();

        expect(element).toEqualText('State: "bar"');

        await element.setValue({});

        await waitForChanges();

        expect(element).toEqualText('');

        await element.setValue({
            member: 'bar',
        });

        await waitForChanges();

        expect(element).toEqualText('Member: "bar"');
    });

});