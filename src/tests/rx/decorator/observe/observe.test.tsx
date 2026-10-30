import {
    describe,
    it,
} from 'vitest';
import {
    expect,
    render,
    h,
} from '@stencil/vitest';

describe('Observe().', (): void => {

    it('observes property change.', async (): Promise<void> => {
        let {root, waitForChanges}: {
            root: HTMLTestObserveDecoratorElement,
            waitForChanges: () => Promise<void>
        } = await render(
            <test-observe-decorator />,
        );

        await expect(root.getValue()).resolves.toStrictEqual([null, null, null]);

        root.querySelector('button')?.click();

        await waitForChanges();

        await expect(root.getValue()).resolves.toStrictEqual([1, 0, '_counter']);
    });
});
