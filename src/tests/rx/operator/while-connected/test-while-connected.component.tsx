import {
    Component,
    ComponentInterface,
    Host,
    h,
    State,
} from '@stencil/core';
import {
    fromEvent,
    whileConnected,
} from '../../../../rx';

@Component({
    tag:    'test-while-connected',
    shadow: false,
})
export class TestWhileConnectedComponent implements ComponentInterface {

    @State()
    private _raw: number = 0;

    @State()
    private _reemitted: number = 0;

    public connectedCallback(): void {
        fromEvent(this, 'click')
            .pipe(whileConnected(this))
            .subscribe((): void => {
                this._raw++;
            });

        fromEvent(this, 'click')
            .pipe(whileConnected(this, {
                reemit: true,
            }))
            .subscribe((): void => {
                this._reemitted++;
            });
    }

    public render(): any {
        return (
            <Host>
                {this._raw}/{this._reemitted}
            </Host>
        )
    }
}
