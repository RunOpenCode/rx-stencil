import {
    describe,
    test,
} from 'vitest';
import {
    expect,
    render,
    h,
} from '@stencil/vitest';

describe('ViewChildren().', (): void => {

    type Elem = HTMLTestViewChildrenDecoratorShadowDomElement | HTMLTestViewChildrenDecoratorEmulationElement;

    test.each([
        [
            'emulation',
            <test-view-children-decorator-emulation>
                <test-view-children-decorator-emulation pref="foo" />
            </test-view-children-decorator-emulation>,
        ],
        [
            'shadow DOM',
            <test-view-children-decorator-shadow-dom>
                <test-view-children-decorator-shadow-dom pref="foo" />
            </test-view-children-decorator-shadow-dom>,
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

