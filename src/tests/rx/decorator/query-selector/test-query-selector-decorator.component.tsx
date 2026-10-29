import {
    ComponentInterface,
    Host,
    h,
    Component,
    Method,
} from '@stencil/core';
import {
    QuerySelector,
} from '../../../../rx';

@Component({
    tag:    'test-query-selector-decorator',
    shadow: true,
})
export class TestQuerySelectorDecorator implements ComponentInterface {

    @QuerySelector('div.foo', {
        target: 'view',
    })
    private _view: HTMLDivElement | null = null;

    @QuerySelector('div.bar', {
        target: 'content',
    })
    private _content: HTMLDivElement | null = null;

    @Method()
    public async getValue(): Promise<[string | null, string | null]> {
        return [
            this._view?.textContent ?? null,
            this._content?.textContent ?? null,
        ];
    }

    public render(): void {
        return (
            <Host>
                <div class="foo">foo</div>
                <slot></slot>
            </Host>
        )
    }
}
