import {
    describe,
    test,
} from 'vitest';
import {
    expect,
    render,
    h,
} from '@stencil/vitest';

describe('contentChildrenObservable().', (): void => {

    type Elem = HTMLTestContentChildObservableShadowDomElement | HTMLTestContentChildObservableEmulationElement;

    test.each([
        [
            'emulation',
            <test-content-children-observable-emulation />,
        ],
        [
            'shadow DOM',
            <test-content-children-observable-shadow-dom />,
        ],
    ])('Finds content child in %s.', async (_name: string, component: any): Promise<void> => {
        let {root, waitForChanges} = await render(
            component,
        );
        let element: Elem          = root as Elem;
        let document: Document     = element.ownerDocument as Document;
        let child1: HTMLElement     = document.createElement('div');
        let child2: HTMLElement     = document.createElement('div');

        child1.textContent = 'foo';
        child1.classList.add('foo');
        child2.textContent = 'bar';
        child2.classList.add('foo');

        await expect(element.getValue()).resolves.toBe('');

        element.appendChild(child1);
        element.appendChild(child2);

        await waitForChanges();

        await expect(element.getValue()).resolves.toBe('foo,bar');

        child1.remove();

        await waitForChanges();

        await expect(element.getValue()).resolves.toBe('bar');
        
        child2.remove();
        
        await waitForChanges();
        
        await expect(element.getValue()).resolves.toBe('');
    });
});

