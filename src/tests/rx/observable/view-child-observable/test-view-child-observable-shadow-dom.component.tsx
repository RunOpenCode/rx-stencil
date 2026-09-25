import {
    ComponentInterface,
    Host,
    h,
    Component,
    Prop,
    Method,
}                              from '@stencil/core';
import { viewChildObservable } from '../../../../rx';

@Component({
    tag:    'test-view-child-observable-shadow-dom',
    shadow: true,
})
export class TestViewChildObservableShadowDom implements ComponentInterface {

    @Prop()
    public which: 'even' | 'odd' | 'all' = 'all';

    private _log: string[] = [];

    @Method()
    public async getLog(): Promise<string[]> {
        return this._log;
    }

    @Method()
    public async clearLog(): Promise<void> {
        this._log = [];
    }

    /**
     * {@inheritdoc}
     */
    public connectedCallback() {
        viewChildObservable<HTMLDivElement>(this, 'div')
            .subscribe((el: HTMLDivElement | null): void => {
                this._log.push(`viewChildObservable@connectedCallback: ${el?.id}`)
            })
    }

    public render(): void {
        return (
            <Host>
                {
                    this.which !== 'even'
                        ? (<div id="test-1" class="odd all" key="test-1">1</div>)
                        : null
                }
                {
                    this.which !== 'odd'
                        ? (<div id="test-2" class="even all" key="test-2">2</div>)
                        : null
                }
                {
                    this.which !== 'even'
                        ? (<div id="test-3" class="odd all" key="test-3">3</div>)
                        : null
                }
                <slot></slot>
            </Host>
        )
    }
}
