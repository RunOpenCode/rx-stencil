import {
    Component,
    ComponentInterface,
    h,
    State,
} from '@stencil/core';
import { Observe } from '../../../../rx';


@Component({
    tag:    'test-observe-decorator',
    shadow: false,
})
export class TestObserveDecorator implements ComponentInterface {

    @State()
    private _counter: number = 0;

    @Observe('_counter', { immediate: false })
    // @ts-ignore
    private _onCounterChanged(current: number, previous: number, property: string): void {
        console.log('value', current, previous, property, this._counter);
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