import {
    describe,
    it,
} from 'vitest';
import {
    expect,
    render,
    h,
} from '@stencil/vitest';

describe('QuerySelector().', (): void => {

    it('selects content and view element.', async (): Promise<void> => {
        let {root} = await render(
            <test-query-selector-decorator>
                <div class="bar">bar</div>
            </test-query-selector-decorator>,
        );

        await expect((root as HTMLTestQuerySelectorDecoratorElement).getValue()).resolves.toStrictEqual(['foo', 'bar']);
    });
});
