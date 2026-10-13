import {
    describe,
    it,
} from 'vitest';
import {
    expect,
    render,
    h,
} from '@stencil/vitest';

describe('connectedObservable().', (): void => {

    it('Monitors events.', async (): Promise<void> => {
        let {root, waitForChanges}            = await render(
            <div>
                <test-connected-observable/>
            </div>
        );
        let wrapper: HTMLDivElement = root as HTMLDivElement;
        let element: HTMLTestConnectedObservableElement = wrapper.querySelector('test-connected-observable') as HTMLTestConnectedObservableElement;

        await waitForChanges();
        
        expect(element).toEqualText('connected');

        element.remove();
        
        await waitForChanges();
        
        expect(element).toEqualText('disconnected');
        
        wrapper.appendChild(element);
        
        await waitForChanges();
        
        expect(element).toEqualText('connected');
    });
});

