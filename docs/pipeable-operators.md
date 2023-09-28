# Pipeable operators

Pipeable operators are functions which allows you to compose observables in a declarative way. They are used in
conjunction with `pipe()` function from RxJS. Read more about pipeable operators in official RxJS
documentation: https://rxjs.dev/guide/operators.

## scheduleRender()

Operator which taps into observable and schedules rendering of component as soon as observable emits new value. By
default, rendering ill be requested on next micro-task (i.e. after `Promise.resolve()`), but you can disable this
behaviour by passing `false` as second parameter.

Function signature
is: `scheduleRender<T = unknown>(cmp: ComponentInterface, nextTick: boolean = true): MonoTypeOperatorFunction<T>`

## toProperty()

Operator which taps into observable and sets value of component property as soon as observable emits new value.

Function signature is: `toProperty<T = any>(cmp: ComponentInterface, property: string): MonoTypeOperatorFunction<T>`

## untilDisconnected()

Operator which taps into observable and unsubscribes from it as soon as component is disconnected from DOM. Operator
will try to monitor execution of the `disconnectedCallback()` method of the component in order to emmit event. However,
if method is not defined on the component, mutation observable will be used on parent node of the component in order to
detect when component is removed from DOM.

Monitoring of `disconnectCallback()` is much more reliable and performant, so it is recommended to define this method on
component if you are using this operator, because with mutation observer it is not possible to reliably detect when
component is re-attached to DOM.

Function signature is: `untilDisconnected<T = unknown>(cmp: ComponentInterface): MonoTypeOperatorFunction<T>`

Common use case for this operator is to use it as a cleanup operator for observables which are created
in `connectedCallback()` method of the component.
