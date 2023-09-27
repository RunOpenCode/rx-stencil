import {
    Component,
    ComponentInterface,
    h,
    Host,
    Prop,
} from '@stencil/core';
import {
    from,
    isObservable,
    Observable,
    of,
    switchMap,
} from 'rxjs';
import {
    propertyObservable,
    setProperty,
} from '../../rx';

export type AsyncValue = Promise<unknown> | Observable<unknown> | null | undefined;

@Component({
    tag:      'rx-async',
    shadow:   false,
    styleUrl: 'async.scss',
})
export class Async implements ComponentInterface {

    @Prop()
    public value: AsyncValue = null;

    private _value: unknown = null;

    public connectedCallback(): void {
        propertyObservable(this, 'value').pipe(
            switchMap((value: AsyncValue): Observable<unknown> => {
                if (isObservable(value)) {
                    return value;
                }

                if (value instanceof Promise) {
                    return from(value);
                }

                return of(value);
            }),
        ).subscribe(setProperty(this, '_value', {
            scheduleRender: true,
            nextTick:       false,
        }));
    }

    public disconnectedCallback(): void {
        // noop
    }

    public render(): any {
        return (
            <Host>
                {this._value}
            </Host>
        )
    }
}