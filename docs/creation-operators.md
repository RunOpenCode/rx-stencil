# Creation operators

These are operators which create observables with common, predefined behaviour. Read more about creation operators in
official RxJS documentation: https://rxjs.dev/guide/operators.

## mutationObservable()

Mutation observable is just a simple wrapper
around [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) which emits collection of
MutationRecord as changes in DOM subtree occur. This function is part of library as utility as some of the library
operators use it internally.

Function signature is: `mutationObservable(target: Node, options?: MutationObserverInit): Observable<MutationRecord[]>`

Details of this operator are not documented as behaviour is fully described in official documentation of
MutationObserver and its `MutationObserver.observe()`
method: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/observe.

## propertyObservable()

Common use case for Stencil components is to observe changes of component properties decorated with either `@Prop()`
or `@State()` decorator. In order to react on those changes prior to rendering, it is required to create a method and
decorate it with `@Watch()` decorator, as described
here: https://stenciljs.com/docs/reactive-data#the-watch-decorator-watch.

Instead of that, you may use `propertyObservable()` operator which will create an observable which will emit new value
as soon as property changes. This operator can be used for watching changes of both `@Prop()` and `@State()` decorated
properties, as well as any other property of the component.

Function signature is: `propertyObservable<T = any>(cmp: ComponentInterface, property: string): Observable<T>`

There are many use cases where this operator can be used, however, a simple example where we are calculating, so called,
computed property is given in example below:

```typescript jsx
import {
    Component,
    ComponentInterface,
    Prop,
} from '@stencil/core';
import {
    combineLatest,
    map,
} from 'rxjs';
import {
    propertyObservable,
    untilDisconnected,
    scheduleRender,
} from '@runopencode/rx-stencil';

@Component({
    tag: 'my-component',
})
class MyComponent implements ComponentInterface {

    @Prop()
    public first: number = 0;

    @Prop()
    public second: number = 0;

    private sum: number = 0;

    public connectedCallback(): void {
        combineLatest([
            propertyObservable(this, 'first'),
            propertyObservable(this, 'second'),
        ]).pipe(
            untilDisconnected(this),
            map(([first, second]) => first + second),
            scheduleRender(this),
        ).subscribe(sum => this.sum = sum);
    }

    public render(): any {
        return <div>{this.sum}</div>;
    }
}
```

## propertiesObservable()

Similar to `propertyObservable()`, with exception that you are able to observe changes of multiple properties at once.

Function signature is: `propertiesObservable<T extends any[]>(cmp: ComponentInterface, ...properties: string[]): Observable<T>`

Obvious use case is to observe changes of multiple properties at once and set the value of computed one.

```typescript jsx
import {
    Component,
    ComponentInterface,
    Prop,
} from '@stencil/core';
import { map } from 'rxjs';
import {
    propertiesObservable,
    scheduleRender,
    untilDisconnected
} from '@runopencode/rx-stencil';

@Component({
    tag: 'my-component',
})
class MyComponent implements ComponentInterface {

    @Prop()
    public first: number = 0;

    @Prop()
    public second: number = 0;

    private sum: number = 0;

    public connectedCallback(): void {
        propertiesObservable(this, 'first', 'second').pipe(
            untilDisconnected(this),
            map(([first, second]) => first + second),
            scheduleRender(this),
        ).subscribe(sum => this.sum = sum);
    }

    public render(): any {
        return <div>{this.sum}</div>;
    }
}
```

## renderObservable()

This operator is used to create an observable which will emit new value after `render()` function of the component is
called. Note that this operator will emmit value on next micro-task (that is, after `Promise.resolve()`) to ensure that
resulting DOM is updated and in stable state.

This function is part of library as utility as some of the library operators use it internally.

Function signature is: `renderObservable(cmp: ComponentInterface): Observable<void>`

