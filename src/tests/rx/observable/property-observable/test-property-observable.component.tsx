import {
    Component,
    ComponentInterface,
    Host,
    h,
    Method,
} from '@stencil/core';
import {
    propertyObservable,
    setProperty,
    untilDisconnected,
} from '../../../../rx';

@Component({
    tag: 'test-property-observable',
})
export class TestPropertyObservable implements ComponentInterface {

    // @ts-ignore
    private prop: string = 'foo';

    private value?: string;

    public connectedCallback(): void {
        propertyObservable(this, 'prop')
            .pipe(untilDisconnected(this))
            .subscribe(setProperty(this, 'value', {
                scheduleRender: true,
            }));
    }

    @Method()
    public async setValue(value: string): Promise<void> {
        this.prop = value;
    }

    public render(): any {
        return (
            <Host>
                {this.value}
            </Host>
        )
    }
}