import {
    describe,
    test,
} from 'vitest';
import {
    expect,
    render,
    h,
} from '@stencil/vitest';

describe('viewChildrenObservable().', (): void => {

    type Elem = HTMLTestViewChildrenObservableShadowDomElement | HTMLTestViewChildrenObservableEmulationElement;

    test.each([
        [
            'emulation',
            <test-view-children-observable-emulation>
                <test-view-children-observable-emulation pref="foo" />
            </test-view-children-observable-emulation>,
        ],
        [
            'shadow DOM',
            <test-view-children-observable-shadow-dom>
                <test-view-children-observable-shadow-dom pref="foo" />
            </test-view-children-observable-shadow-dom>,
        ],
    ])('Finds content child in %s.', async (_name: string, component: any): Promise<void> => {
        let {root, waitForChanges} = await render(
            component,
        );
        let element: Elem          = root as Elem;

        await expect(element.getValue()).resolves.toBe('Lazy Fox');
        
        element.show = true;

        await waitForChanges();

        await expect(element.getValue()).resolves.toBe('Lazy Fox Jumps Over The Quick Brown Dog');

        element.show = false;

        await waitForChanges();

        await expect(element.getValue()).resolves.toBe('Lazy Fox');
    });
});

