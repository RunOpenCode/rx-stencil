import {
    Component,
    ComponentInterface,
    Host,
    h,
    Method,
} from '@stencil/core';
import {
    fromEvent,
    scheduleRender,
    untilDisconnected,
} from '../../../../rx';

@Component({
    tag: 'test-schedule-render',
})
export class TestScheduleRender implements ComponentInterface {

    private _counter: number = 0;

    public connectedCallback(): void {
        fromEvent(this, 'click')
            .pipe(
                scheduleRender(this),
                untilDisconnected(this),
            )
            .subscribe((): void => {
                this._counter++;
            });
    }

    @Method()
    public async increase(): Promise<void> {
        this._counter++;
    }

    public render(): any {
        return (
            <Host>
                {this._counter}
            </Host>
        )
    }
}