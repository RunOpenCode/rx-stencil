import {
    Component,
    ComponentInterface,
    h,
    Method,
    State,
}                  from '@stencil/core';
import { Observe } from '../../../../rx';


@Component({
    tag:    'test-observe-decorator',
    shadow: false,
})
export class TestObserveDecorator implements ComponentInterface {

    @State()
    private _counter: number = 0;

    private _value: [number | null, number | null, string | null] = [null, null, null];

    @Method()
    public async getValue(): Promise<[number | null, number | null, string | null]> {
        return this._value;
    }

    @Observe('_counter', {immediate: false})
    // @ts-ignore
    private _onCounterChanged(current: number, previous: number, property: string): void {
        this._value = [current, previous, property];
    }

    public render(): any {
        return (
            <div>
                <button onClick={(): number => this._counter++}>
                    Increment Counter
                </button>
                <p>Counter: {this._counter}</p>
            </div>
        );
    }
}