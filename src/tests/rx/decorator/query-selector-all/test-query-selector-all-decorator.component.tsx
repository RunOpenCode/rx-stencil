import {
    ComponentInterface,
    Host,
    h,
    Component,
    Method,
} from '@stencil/core';
import {
    QuerySelectorAll,
} from '../../../../rx';

@Component({
    tag:    'test-query-selector-all-decorator',
    shadow: true,
})
export class TestQuerySelectorAllDecorator implements ComponentInterface {

    @QuerySelectorAll('div.foo', {
        target: 'view',
    })
    private _view: HTMLDivElement[] | null = null;

    @QuerySelectorAll('div.bar', {
        target: 'content',
    })
    private _content: HTMLDivElement[] | null = null;

    @Method()
    public async getValue(): Promise<[string | null, string | null]> {
        return [
            this._view?.map(el => el.textContent).join(',') ?? null,
            this._content?.map(el => el.textContent).join(',') ?? null,
        ];
    }

    public render(): void {
        return (
            <Host>
                <div class="foo">foo1</div>
                <div class="foo">foo2</div>
                <slot></slot>
            </Host>
        )
    }
}
