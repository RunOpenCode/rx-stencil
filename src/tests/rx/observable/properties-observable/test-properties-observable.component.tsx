import {
    Component,
    ComponentInterface,
    Host,
    h,
    Prop,
    State,
} from '@stencil/core';
import {
    map,
} from 'rxjs';
import {
    propertiesObservable,
    untilDisconnected,
} from '../../../../rx';

@Component({
    tag: 'test-properties-observable',
})
export class TestPropertiesObservable implements ComponentInterface {

    @Prop()
    public foo!: string;

    @Prop()
    public bar!: string

    @Prop()
    public baz!: string;

    @State()
    private _value: string | undefined = undefined;

    public connectedCallback(): void {
        propertiesObservable<[string, string, string]>(this, 'foo', 'bar', 'baz')
            .pipe(
                map(([foo, bar, baz]: [string, string, string]): void => {
                    this._value = `Foo: "${foo}", Bar: "${bar}", Baz: "${baz}"`;
                }),
                untilDisconnected(this),
            )
            .subscribe();
    }

    public render(): any {
        return (
            <Host>
                {this._value}
            </Host>
        )
    }
}