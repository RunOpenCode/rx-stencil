import {
    Component,
    ComponentInterface,
    h,
    Host,
    State,
}                              from '@stencil/core';
import {
    tap,
}                              from 'rxjs';
import { connectedObservable } from '../../../../rx';

@Component({
    tag:    'test-connected-observable',
    shadow: true,
})
export class TestConnectedObservable implements ComponentInterface {

    @State()
    private _value!: string;

    public constructor() {
        connectedObservable(this).pipe(
            tap((value: boolean): void => {
                this._value = value ? 'connected' : 'disconnected';
            }),
        ).subscribe();
    }

    public render(): any {
        return (
            <Host>
                {this._value}
            </Host>
        );
    }
}
