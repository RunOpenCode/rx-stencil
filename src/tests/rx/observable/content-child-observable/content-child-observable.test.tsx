import {
    describe,
    test,
} from 'vitest';
import {
    expect,
    render,
    h,
} from '@stencil/vitest';

describe('contentChildObservable().', (): void => {

    type Elem = HTMLTestContentChildObservableShadowDomElement | HTMLTestContentChildObservableEmulationElement;

    test.each([
        [
            'emulation',
            <test-content-child-observable-emulation>
                <test-content-child-observable-emulation />
            </test-content-child-observable-emulation>,
        ],
        [
            'shadow DOM',
            <test-content-child-observable-shadow-dom>
                <test-content-child-observable-shadow-dom />
            </test-content-child-observable-shadow-dom>,
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
