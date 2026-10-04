import {
    Component,
    ComponentInterface,
    h,
    Host,
    Prop,
    State,
}                    from '@stencil/core';
import {
    from,
    isObservable,
    Observable,
    of,
    switchMap,
    tap,
} from 'rxjs';
import { isPromise } from 'rxjs/internal/util/isPromise';
import {
    propertyObservable,
    setProperty,
    untilDisconnected,
}                    from '../../rx';

export type AsyncValue<T = unknown> = PromiseLike<T> | Observable<T> | T | null | undefined;

export type ValueTransformFn<T = unknown, R = unknown> = (value: T | null | undefined) => R;

@Component({
    tag:      'rx-async',
    shadow:   false,
    styleUrl: 'async.scss',
})
export class Async implements ComponentInterface {

    @Prop()
    public value: AsyncValue = null;

    @Prop()
    public transform: ValueTransformFn = (value: unknown | null | undefined): string => String(value ?? '').toString();

    @State()
    private _value: string | null | undefined = null;

    /**
     * {@inheritdoc}
     */
    public connectedCallback(): void {
        propertyObservable(this, 'value')
            .pipe(
                tap((): void => {
                    this._value = null;
                }),
                switchMap((value: AsyncValue): Observable<unknown> => {
                    if (isPromise(value) || isObservable(value)) {
                        return from(value);
                    }

                    return of(value);
                }),
                untilDisconnected(this),
            )
            .subscribe(setProperty(this, '_value'));
    }

    /**
     * {@inheritdoc}
     */
    public render(): any {
        return (
            <Host>
                {this.transform(this._value)}
            </Host>
        )
    }
}