import './test-properties-observable.component';

import {
    describe,
    it,
    expect,
    render,
    h,
} from '@stencil/vitest';

describe('propertiesObservable().', (): void => {

    it('Monitors multiple states/props on component.', async (): Promise<void> => {
        let {root, waitForChanges}                       = await render(
            <test-properties-observable
                foo="foo"
                bar="bar"
                baz="baz"
            />,
        );
        let element: HTMLTestPropertiesObservableElement = root as HTMLTestPropertiesObservableElement;

        expect(element).toEqualText('Foo: "foo", Bar: "bar", Baz: "baz"');

        element.foo = 'foo2';

        await waitForChanges();

        expect(element).toEqualText('Foo: "foo2", Bar: "bar", Baz: "baz"');

        element.bar = 'bar2';
        element.baz = 'baz2';

        await waitForChanges();

        expect(element).toEqualText('Foo: "foo2", Bar: "bar2", Baz: "baz2"');
    });

});