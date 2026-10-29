import { ComponentInterface } from '@stencil/core';
import {
    identity,
    pairwise,
    skip,
    startWith,
}                             from 'rxjs';
import { propertyObservable } from '../observable';
import { whileConnected }     from '../operator';

type Method<T, A extends unknown[], R> = (this: T, ...args: A) => R;

export type ObserveOptions = {
    immediate?: boolean;
    whileConnected?: boolean;
}

export function Observe(property: string, options?: ObserveOptions) {
    return function <T, A extends unknown[], R>(
        target: object,
        method: string | symbol,
        descriptor: TypedPropertyDescriptor<Method<T, A, R>>,
    ): TypedPropertyDescriptor<Method<T, A, R>> {
        let previous: (() => void) | undefined = (target as any).connectedCallback;

        (target as any).connectedCallback = function (): void {
            this.connectedCallback = previous;

            propertyObservable(this as ComponentInterface, property)
                .pipe(
                    startWith((this as any)[property]),
                    pairwise(),
                    options?.immediate ? identity : skip(1),
                    options?.whileConnected ? whileConnected(this as ComponentInterface, {
                        reemit: true,
                    }) : identity,
                )
                .subscribe(([previous, current]: [any, any]): void => {
                    (this as any)[method](current, previous, property);
                });

            previous?.call(this);
        };

        return descriptor;
    };
}
