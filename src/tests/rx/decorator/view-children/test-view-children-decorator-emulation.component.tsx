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
    tag:    'test-view-children-decorator-emulation',
    shadow: false,
})
export class TestViewChildrenDecoratorEmulation implements ComponentInterface {

    @Prop()
    public pref: string = '';

    @Prop()
    public show: boolean = false;

    @ViewChildren('.foo')
    private _children: HTMLElement[] = [];

    @Method()
    public async getValue(): Promise<string | null> {
        return this._children.map((el: HTMLElement): string | null => el.textContent).join(' ').trim();
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
                {this.show && <div class="foo target">
                    {this.pref}Jumps Over The Quick Brown Dog
                </div>}
            </Host>
        );
    }
}