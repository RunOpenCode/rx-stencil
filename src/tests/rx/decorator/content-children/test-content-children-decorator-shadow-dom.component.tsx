import {
    Component,
    ComponentInterface,
    h,
    Host,
    Method,
    State,
    Watch,
}                          from '@stencil/core';
import { ContentChildren } from '../../../../rx';

@Component({
    tag:    'test-content-children-decorator-shadow-dom',
    shadow: true,
})
export class TestContentChildrenDecoratorShadowDom implements ComponentInterface {

    @State()
    @ContentChildren('.foo')
    // @ts-ignore
    private children: HTMLElement[] = [];

    private _value: string | null = null;

    @Method()
    public async getValue(): Promise<string | null> {
        return this._value;
    }

    @Watch('children')
    // @ts-ignore
    private _onChildrenChange(value: HTMLElement[]): void {
        this._value = value.map((el: HTMLElement): string | null => el.textContent).join(',');
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