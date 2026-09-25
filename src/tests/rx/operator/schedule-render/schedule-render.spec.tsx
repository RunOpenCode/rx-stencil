import './test-schedule-render.component';

import {
    expect,
    render,
    describe,
    it,
    h,
} from '@stencil/vitest';

describe('scheduleRender().', (): void => {

    it('Monitors events.', async (): Promise<void> => {
        let {root, waitForChanges}                 = await render(
            <test-schedule-render />,
        );
        let element: HTMLTestScheduleRenderElement = root as HTMLTestScheduleRenderElement;

        expect(element).toEqualText('0');

        element.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
        }));

        await waitForChanges();

        expect(element).toEqualText('1');

        await element.increase();

        await waitForChanges();

        expect(element).toEqualText('1');
    });

});
