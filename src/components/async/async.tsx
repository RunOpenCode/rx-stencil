import {
    Component,
    ComponentInterface,
    h,
    Host,
    Prop,
    State,
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
    untilDisconnected,
} from '../../rx';

export type AsyncValue<T = unknown> = Promise<T> | Observable<T> | null | undefined;

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
    public transform: ValueTransformFn = (value: unknown | null | undefined): any => value;

    @State()
    private _value: unknown | null | undefined = null;

    /**
     * {@inheritdoc}
     */
    public connectedCallback(): void {
        propertyObservable(this, 'value')
            .pipe(switchMap((value: AsyncValue): Observable<unknown> => {
                    if (isObservable(value)) {
                        return value;
                    }

                    if (value instanceof Promise) {
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