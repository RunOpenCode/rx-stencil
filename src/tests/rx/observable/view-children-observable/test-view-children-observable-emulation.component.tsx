import {
    Component,
    ComponentInterface,
    h,
    Host,
    Method,
    Prop,
} from '@stencil/core';
import { viewChildrenObservable } from '../../../../rx';

@Component({
    tag:    'test-view-children-observable-emulation',
    shadow: false,
})
export class TestViewChildrenObservableEmulation implements ComponentInterface {

    @Prop()
    public pref: string = '';

    @Prop()
    public show: boolean = false;
    
    private _value: string | null = null;

    public connectedCallback(): void {
        viewChildrenObservable<HTMLElement>(this, '.foo').subscribe((value: HTMLElement[]): void => {
            this._value = value.map((el: HTMLElement): string | null => el.textContent).join(' ').trim();
        });
    }

    @Method()
    public async getValue(): Promise<string | null> {
        return this._value;
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