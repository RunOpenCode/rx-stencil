import {
    ComponentInterface,
    Host,
    h,
    Component,
    Prop,
    Method,
}                    from '@stencil/core';
import { ViewChild } from '../../../../rx';

@Component({
    tag:    'test-view-child-decorator-emulation',
    shadow: false,
})
export class TestViewChildDecoratorEmulation implements ComponentInterface {

    @Prop()
    public show: boolean = false;

    @ViewChild('div')
    private _child: HTMLDivElement | null = null;

    @Method()
    public async getValue(): Promise<string | null> {
        return this._child?.textContent ?? null;
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
