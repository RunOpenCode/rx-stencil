import { ComponentInterface } from '@stencil/core';
import { expect }             from '@stencil/vitest';
import { Subject }            from 'rxjs';
import {
    describe,
    vi,
    it,
    beforeEach,
}                             from 'vitest';
import { setProperty }        from '../../../rx';

vi.mock('@stencil/core', () => ({
    forceUpdate: vi.fn((): void => void 0),
}));

import { forceUpdate } from '@stencil/core';

describe('setProperty().', (): void => {

    let observable: Subject<string>;
    let cmp: ComponentMock;

    beforeEach((): void => {
        observable = new Subject<string>();
        cmp        = new ComponentMock();

        vi.clearAllMocks();
    });

    it('Sets property without triggering render.', async (): Promise<void> => {
        observable.subscribe(setProperty(cmp, 'foo'));

        expect(cmp.foo).toBeUndefined();

        observable.next('bar');

        expect(cmp.foo).toBe('bar');
        expect(forceUpdate).not.toHaveBeenCalled();

        await Promise.resolve();

        expect(forceUpdate).not.toHaveBeenCalled();
    });

    it('Sets property with triggering render synchronously.', async (): Promise<void> => {
        observable.subscribe(setProperty(cmp, 'foo', {
            scheduleRender: true,
            nextTick:       false,
        }));

        expect(cmp.foo).toBeUndefined();

        observable.next('bar');

        expect(cmp.foo).toBe('bar');
        expect(forceUpdate).toHaveBeenCalled();

        vi.clearAllMocks();

        await Promise.resolve();

        expect(forceUpdate).not.toHaveBeenCalled();
    });

    it('Sets property with triggering render asynchronously.', async (): Promise<void> => {
        observable.subscribe(setProperty(cmp, 'foo', {
            scheduleRender: true,
            nextTick:       true,
        }));

        expect(cmp.foo).toBeUndefined();

        observable.next('bar');

        expect(cmp.foo).toBe('bar');
        expect(forceUpdate).not.toHaveBeenCalled();

        await Promise.resolve();

        expect(forceUpdate).toHaveBeenCalled();
    });
});

class ComponentMock implements ComponentInterface {
    public foo?: string;
}