import {
    describe,
    test,
} from 'vitest';
import {
    expect,
    render,
    h,
} from '@stencil/vitest';

describe('@ContentChild.', (): void => {

    type Elem = HTMLTestContentChildDecoratorEmulationElement | HTMLTestContentChildDecoratorShadowDomElement;

    test.each([
        [
            'shadow DOM',
            <test-content-child-decorator-shadow-dom>
                <test-content-child-decorator-shadow-dom />
            </test-content-child-decorator-shadow-dom>,
        ],
        [
            'emulation',
            <test-content-child-decorator-emulation>
                <test-content-child-decorator-emulation />
            </test-content-child-decorator-emulation>,
        ],
    ])('Finds content child in %s.', async (_name: string, component: any): Promise<void> => {
        let {root, waitForChanges} = await render(
            component,
        );
        let element: Elem          = root as Elem;
        let document: Document     = element.ownerDocument as Document;
        let child: HTMLElement     = document.createElement('div');

        child.textContent = 'foo';
        child.classList.add('foo');

        await expect(element.getValue()).resolves.toBe(null);

        element.appendChild(child);

        await waitForChanges();

        await expect(element.getValue()).resolves.toBe('foo');

        child.remove();

        await waitForChanges();

        await expect(element.getValue()).resolves.toBe(null);
    });
});
