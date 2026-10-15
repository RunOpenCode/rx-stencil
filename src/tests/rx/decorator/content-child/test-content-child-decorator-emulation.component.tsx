import {
    Component,
    ComponentInterface,
    h,
    Host,
    Method,
    State,
    Watch,
}                       from '@stencil/core';
import { ContentChild } from '../../../../rx';

@Component({
    tag:    'test-content-child-decorator-emulation',
    shadow: false,
})
export class TestContentChildDecoratorEmulation implements ComponentInterface {

    @State()
    @ContentChild('.foo')
    // @ts-ignore
    private child: HTMLElement | null = null;

    private _value: string | null = null;

    @Method()
    public async getValue(): Promise<string | null> {
        return this._value;
    }

    @Watch('child')
    // @ts-ignore
    private _onChildChange(value: HTMLElement | null): void {
        this._value = value?.textContent.trim() || null;
        console.log('sad');
    }

    public render(): any {
        return (
            <Host>
                <div class="foo">
                    <slot />
                </div>
                <div class="foo">
                    Lazy Fox Jumps Over The Quick Brown Dog
                </div>
            </Host>
        );
    }
}

