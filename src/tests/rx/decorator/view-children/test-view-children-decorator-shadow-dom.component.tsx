import {
    Component,
    ComponentInterface,
    h,
    Host,
    Method,
    Prop,
}                       from '@stencil/core';
import { ViewChildren } from '../../../../rx';

@Component({
    tag:    'test-view-children-decorator-shadow-dom',
    shadow: true,
})
export class TestViewChildrenDecoratorShadowDom implements ComponentInterface {

    @Prop()
    public pref: string = '';

    @Prop()
    public show: boolean = false;

    @ViewChildren('.foo')
    private _value: HTMLElement[] = [];

    @Method()
    public async getValue(): Promise<string | null> {
        return this._value.map((el: HTMLElement): string | null => el.textContent).join(' ').trim();
    }

    public render(): any {
        return (
            <Host>
                <div>
                    <slot />
                </div>
                <div class="foo">
                    {this.pref}Lazy Fox
                </div>
                {this.show && <div class="foo">
                    {this.pref}Jumps Over The Quick Brown Dog
                </div>}
            </Host>
        );
    }
}