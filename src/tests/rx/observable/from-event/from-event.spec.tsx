import './test-from-event.component';

import {
    describe,
    it,
} from 'vitest';
import {
    expect,
    render,
    h,
} from '@stencil/vitest';

describe('fromEvent().', (): void => {

    it('Monitors events.', async (): Promise<void> => {
        let {root, waitForChanges}            = await render(
            <test-from-event />,
        );
        let element: HTMLTestFromEventElement = root as HTMLTestFromEventElement;

        expect(element).toEqualText('0/0');

        element.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
        }));

        await waitForChanges();

        expect(element).toEqualText('1/0');

        element.querySelector('#delegate')?.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
        }));

        await waitForChanges();

        expect(element).toEqualText('2/1');
    });

});
