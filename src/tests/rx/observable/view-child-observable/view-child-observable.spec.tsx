import './test-view-child-observable-shadow-dom.component';

import {
    describe,
    expect,
    it,
    render,
    h,
} from '@stencil/vitest';

describe('viewChildObservable()', (): void => {

    describe('With shadow DOM', (): void => {

        it('Renders', async (): Promise<void> => {
            let {root, waitForChanges, setProps} = await render(
                <test-view-child-observable-shadow-dom>
                    <div id="foo">Foo</div>
                </test-view-child-observable-shadow-dom>,
            ) as {
                root: HTMLTestViewChildObservableShadowDomElement,
                waitForChanges: () => Promise<void>,
                setProps: (props: Partial<HTMLTestViewChildObservableShadowDomElement>) => Promise<void>,
            }

            expect(root).toHaveTextContent('123');
            expect(root).toEqualText('123Foo');
            expect(await root.getLog()).toStrictEqual([
                'viewChildObservable@connectedCallback: test-1',
            ]);

            await setProps({
                which: 'even',
            });

            await waitForChanges();

            expect(root).toHaveTextContent('2');
            expect(root).toEqualText('2Foo');

            expect(await root.getLog()).toStrictEqual([
                'viewChildObservable@connectedCallback: test-1',
                'viewChildObservable@connectedCallback: test-2',
            ]);
        });
    });

});
