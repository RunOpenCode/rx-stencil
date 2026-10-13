import {
    Component,
    ComponentInterface,
    Host,
    h,
    Method,
    Prop,
    State,
} from '@stencil/core';
import {
    propertyObservable,
    scheduleRender,
    untilDisconnected,
} from '../../../../rx';

type Value = {
    member?: string | null,
    property?: string | null,
    state?: string | null,
}

@Component({
    tag: 'test-property-observable',
})
export class TestPropertyObservable implements ComponentInterface {

    @Prop({
        mutable: true,
    })
    public property: string | null = null;

    @State()
    public state: string | null = null;

    private member: string | null = null;

    public connectedCallback(): void {
        propertyObservable(this, 'member')
            .pipe(
                scheduleRender(this, false),
                untilDisconnected(this),
            )
            .subscribe();
    }

    @Method()
    public async setValue(value: Value): Promise<void> {
        this.property = value.property || null;
        this.state    = value.state || null;
        this.member   = value.member || null;
    }

    public render(): any {
        return (
            <Host>
                {this.property ? `Property: "${this.property}"` : ''}
                {this.state ? `State: "${this.state}"` : ''}
                {this.member ? `Member: "${this.member}"` : ''}
            </Host>
        )
    }
}