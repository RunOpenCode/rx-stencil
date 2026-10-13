import {
    Component,
    ComponentInterface,
    h,
    Host,
    Method,
}                                    from '@stencil/core';
import { contentChildrenObservable } from '../../../../rx';

@Component({
    tag:    'test-content-children-observable-emulation',
    shadow: false,
})
export class TestContentChildrenObservableEmulation implements ComponentInterface {

    private _value: string | null = null;

    public connectedCallback(): void {
        contentChildrenObservable<HTMLElement>(this, '.foo').subscribe((value: HTMLElement[]): void => {
            this._value = value.map((el: HTMLElement): string | null => el.textContent).join(',');
        });
    }

    @Method()
    public async getValue(): Promise<string | null> {
        return this._value;
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