import {
    Component,
    ComponentInterface,
    Host,
    h,
    State,
} from '@stencil/core';
import {
    fromEvent,
    untilDisconnected,
} from '../../../../rx';

@Component({
    tag: 'test-from-event',
    shadow: false,
})
export class TestFromEvent implements ComponentInterface {

    @State()
    private _elementCounter: number = 0;

    @State()
    private _delegateCounter: number = 0;

    public connectedCallback(): void {
        fromEvent(this, 'click')
            .pipe(untilDisconnected(this))
            .subscribe((): void => {
                this._elementCounter++;
            });

        fromEvent(this, 'click', 'span')
            .pipe(untilDisconnected(this))
            .subscribe((): void => {
                this._delegateCounter++;
            });
    }

    public render(): any {
        return (
            <Host>
                {this._elementCounter}/<span id="delegate">{this._delegateCounter}</span>
            </Host>
        )
    }
}