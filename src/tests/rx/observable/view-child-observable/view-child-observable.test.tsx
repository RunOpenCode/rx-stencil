import {
    describe,
    test,
} from 'vitest';
import {
    expect,
    render,
    h,
} from '@stencil/vitest';

describe('viewChildObservable().', (): void => {

    type Elem = HTMLTestViewChildObservableShadowDomElement | HTMLTestViewChildObservableEmulationElement;

    test.each([
        [
            'emulation',
            <test-view-child-observable-emulation>
                <div>bar</div>
            </test-view-child-observable-emulation>,
        ],
        [
            'shadow DOM',
            <test-view-child-observable-shadow-dom>
                <div>bar</div>
            </test-view-child-observable-shadow-dom>,
        ],
    ])('Finds view child in %s.', async (_name: string, component: any): Promise<void> => {
        let {root, waitForChanges} = await render(
            component,
        );
        let element: Elem          = root as Elem;

        await expect(element.getValue()).resolves.toBe(null);

        element.show = true;

        await waitForChanges();

        await expect(element.getValue()).resolves.toBe('foo');

        element.show = false;

        await waitForChanges();

        await expect(element.getValue()).resolves.toBe(null);
    });
});

