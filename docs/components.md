# Components

## rx-async

`rx-async` is a simple component which accepts an observable as a property and renders the result of the observable. It
is similar to the `async` pipe in Angular. It is useful when you want to render the result of promise or observable in a
template.

**Of course, it will work only if the observable/promise yields a scalar value.**

Component has only one property, `value`, which accepts:

- `null` or `undefined` - in this case, component will render nothing.
- `scalar` - in this case, component will render the scalar value (basically, everything that can be converted to
  string).
- `Observable` - in this case, component will render every value emitted by the observable.
- `Promise` - in this case, component will render the value resolved by the promise.

### Properties

- `value: PromiseLike<T> | Observable<T> | T | null | undefined` - value to be rendered. It can
  be an observable, a promise, a scalar value, or null/undefined.
- `transform: (value: T) => string` - optional function to transform the value before rendering. If not provided, the
  value will be converted to string using `String(value)`.

### Usage example

Setting value in server-side rendered application:

```html

<rx-async></rx-async>

<script type="text/javascript">
    let counter$ = new Subject();

    setInterval(() => {
        counter$.next(Math.random());
    }, 1000);

    document.querySelector('rx-async').value = counter$;

</script>
```

Or, per example, in a StencilJS component:

```typescript jsx
import {
    Component,
    ComponentInterface,
    Host,
    h,
} from '@stencil/core';
import {Subject} from 'rxjs';

@Component({
    tag: 'app-counter',
    shadow: true,
})
class AppCounter implements ComponentInterface {

    private readonly counter$: Subject<number> = new Subject();

    public connectedCallback(): void {
        setInterval((): void => {
            this.counter$.next(Math.random());
        }, 1000);
    }

    public render(): any {
        return (
                <Host>
                    <rx-async
                        value={this.counter$}
                        transform={(value: number): string => `Counter value: ${value.toFixed(2)}`}
                    />
                </Host>
        );
    }
}
```
