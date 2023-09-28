# Subscribers

These are functions which can be used as subscribers to observables for common tasks in order to decrease boilerplate
code and improve developer experience.

## setProperty()

Function which can be used as subscriber to observable in order to set value of component property as soon as observable
emits new value. Common use case would be to use it in conjunction with `propertyObservable()` operator and set a value
of "computed" property of the component.

Function signature is: `setProperty<T = any>(cmp: ComponentInterface, property: string): Subscriber<T>`

Improved example from [propertyObservable()](creation-operators.md#propertyobservable) operator documentation:

```typescript jsx
import { Component, ComponentInterface, Prop, State } from '@stencil/core';
import { combineLatest, map } from 'rxjs';
import { propertyObservable, untilDisconnected, setProperty } from '@runopencode/rx-stencil';

@Component({
    tag: 'my-component',
})
class MyComponent implements ComponentInterface {

    @Prop()
    public first: number = 0;

    @Prop()
    public second: number = 0;

    @State()
    private sum: number = 0;

    public connectedCallback(): void {
        combineLatest([
            propertyObservable(this, 'first'),
            propertyObservable(this, 'second'),
        ]).pipe(
            untilDisconnected(this),
            map(([first, second]) => first + second),
        ).subscribe(setProperty(this, 'sum'));
    }

    public render(): any {
        return <div>{this.sum}</div>;
    }
}
```
