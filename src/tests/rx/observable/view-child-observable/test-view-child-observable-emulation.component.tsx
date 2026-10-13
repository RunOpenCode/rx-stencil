import {
    ComponentInterface,
    Host,
    h,
    Component,
    Prop,
    Method,
}                              from '@stencil/core';
import { viewChildObservable } from '../../../../rx';

@Component({
    tag:    'test-view-child-observable-emulation',
    shadow: false,
})
export class TestViewChildObservableEmulation implements ComponentInterface {

    @Prop()
    public show: boolean = false;

    private _value: string | null = null;

    /**
     * {@inheritdoc}
     */
    public connectedCallback() {
        viewChildObservable<HTMLDivElement>(this, 'div')
            .subscribe((element: HTMLDivElement | null): void => {
                this._value = element?.textContent ?? null;
            });
    }

    @Method()
    public async getValue(): Promise<string | null> {
        return this._value;
    }

    public render(): void {
        return (
            <Host>
                {this.show ? (<div>foo</div>) : null}
                <slot></slot>
            </Host>
        )
    }
}
