import { ComponentInterface } from '@stencil/core';
import {
    describe,
    it,
    expect,
}                             from '@stencil/vitest';
import { Unsubscribable }     from 'rxjs';
import { vi }                 from 'vitest';
import { renderObservable }   from '../../../rx';

vi.mock('../../../utils/stencil', () => ({
    getComponentTagName: vi.fn((): string => 'foo'),
    isRendered:          vi.fn((): boolean => false),
}));


describe('renderObservable()', (): void => {

    it('Emits on each render.', async (): Promise<void> => {
        let cmp: ComponentMockWithRender = new ComponentMockWithRender();
        let count: number                = 0;

        let subscription: Unsubscribable = renderObservable(cmp).subscribe((): void => {
            count++;
        });

        cmp.render();
        cmp.render();
        cmp.render();

        await Promise.resolve();

        expect(count).toStrictEqual(3);

        subscription.unsubscribe();

        cmp.render();

        await Promise.resolve();

        expect(count).toStrictEqual(3);
    });

    it('Throws if component does not have a render function.', (): void => {
        let cmp: ComponentMockWithoutRender = new ComponentMockWithoutRender();

        expect((): void => {
            renderObservable(cmp);
        }).toThrow('Component "foo" does not have a render function.');
    });
});

class ComponentMockWithoutRender implements ComponentInterface {
    // noop.
}

class ComponentMockWithRender implements ComponentInterface {
    public render(): void {
        // noop.
    }
}