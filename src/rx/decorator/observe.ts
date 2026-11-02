import { ComponentInterface } from '@stencil/core';
import {
    identity,
    pairwise,
    skip,
    startWith,
}                             from 'rxjs';
import { propertyObservable } from '../observable';
import { whileConnected }     from '../operator';

export type ObserveOptions = {
    immediate?: boolean;
    whileConnected?: boolean;
}

export function Observe(property: PropertyKey, options?: ObserveOptions): MethodDecorator {
    return function <T>(
        target: object,
        method: string | symbol,
        descriptor: TypedPropertyDescriptor<T>,
    ): TypedPropertyDescriptor<T> {
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
