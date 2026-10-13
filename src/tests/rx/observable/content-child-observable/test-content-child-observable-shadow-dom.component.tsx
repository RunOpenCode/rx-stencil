import {
    Component,
    ComponentInterface,
    h,
    Host,
    Method,
}                                 from '@stencil/core';
import { contentChildObservable } from '../../../../rx';

@Component({
    tag:    'test-content-child-observable-shadow-dom',
    shadow: true,
})
export class TestContentChildObservableShadowDom implements ComponentInterface {

    private _value: string | null = null;

    public connectedCallback(): void {
        contentChildObservable<HTMLElement>(this, '.foo').subscribe((value: HTMLElement | null): void => {
            this._value = value?.textContent ?? null;
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