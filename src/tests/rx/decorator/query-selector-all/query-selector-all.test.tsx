import {
    describe,
    it,
} from 'vitest';
import {
    expect,
    render,
    h,
} from '@stencil/vitest';

describe('QuerySelectorAll().', (): void => {

    it('selects content and view elements.', async (): Promise<void> => {
        let {root} = await render(
            <test-query-selector-all-decorator>
                <div class="bar">bar1</div>
                <div class="bar">bar2</div>
            </test-query-selector-all-decorator>,
        );

        await expect((root as HTMLTestQuerySelectorAllDecoratorElement).getValue()).resolves.toStrictEqual(['foo1,foo2', 'bar1,bar2']);
    });
});
