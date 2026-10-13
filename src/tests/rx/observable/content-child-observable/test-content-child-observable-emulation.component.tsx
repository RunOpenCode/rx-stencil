import {
    Component,
    ComponentInterface,
    h,
    Host,
    Method,
} from '@stencil/core';
import { contentChildObservable } from '../../../../rx';

@Component({
    tag:    'test-content-child-observable-emulation',
    shadow: false,
})
export class TestContentChildObservableEmulation implements ComponentInterface {

    private _value: string | null = null;

    public connectedCallback(): void {
        contentChildObservable<HTMLElement>(this, '.foo').subscribe((value: HTMLElement | null): void => {
            this._value = value?.textContent.trim() || null;
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
