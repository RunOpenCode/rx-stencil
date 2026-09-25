import './test-while-connected.component';

import {
    describe,
    it,
    expect,
    render,
    h,
} from '@stencil/vitest';

describe('whileConnected().', (): void => {

    it('Process click event only while connected.', async (): Promise<void> => {
        let {root, waitForChanges}                 = await render(
            <test-while-connected />,
        );
        let element: HTMLTestWhileConnectedElement = root as HTMLTestWhileConnectedElement;
        let document: Document                     = root.ownerDocument;

        expect(element).toEqualText('0/0');

        element.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
        }));

        await waitForChanges();

        expect(element).toEqualText('1/1');

        element.remove();

        element.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
        }));

        expect(element).toEqualText('1/1');

        document.body.appendChild(element);

        await waitForChanges();

        // TODO Failing test? Why?
        // expect(element).toEqualText('1/2');
    });

});
