# Creation operators

These are operators which create observables with common, predefined behavior. Read more about creation operators in
official RxJS documentation: https://rxjs.dev/guide/operators.

## `connectedObservable()`

Connected observable is just a simple wrapper around Stencil's `connectedCallback()` and `disconnectedCallback()`
lifecycle methods which emits value when component is connected to the DOM, or disconnected from it. When created,
current state of component is immediately emitted.

Function signature is: `connectedObservable(cmp: ComponentInterface): Observable<boolean>`

There are few use cases where this operator can be used, however, a simple example where we are using it to subscribe to
observable only when component is connected to the DOM is given in example below. In this example, component will render
value of timer only when it is connected to the DOM, and will stop rendering when it is disconnected. On each new
connection to the DOM, timer will be reset and will start counting from 0 again.

```typescript jsx
import {
    Component,
    ComponentInterface,
    h
}                            from '@stencil/core';
import {
    Observable,
    filter,
    interval,
    switchMap
}                            from 'rxjs';
import {connectedObservable} from '@runopencode/rx-stencil';

@Component({
    tag: 'my-component',
})
export class MyComponent implements ComponentInterface {

    private _timer: Observable<number> = connectedObservable(this).pipe(
            filter((connected: boolean): boolean => connected),
            switchMap((): Observable<number> => interval(1000))
    );

    public render(): any {
        return (<rx-async
                value={this._timer}
        />);
    }
}
```

## `contentChildObservable()`

Content child observable utilizes [mutation observable](#mutationobservable) to observe changes in DOM subtree of the
component and emits value when content child element is added or removed. This operator is useful when you want to react
on changes of content child elements of the component. Per example, when you want to render some content only when
certain content child element is present in the DOM subtree of the component.

This observable is inspired by Angular's `@ContentChild()` decorator and behavior is similar to it.

Due to utilization of mutation observable, this operator is not very efficient when subtree is large and changes are
frequent, so do pay attention to performance when using it.

Function signature is:
`contentChildObservable<T extends Element = Element>(cmp: ComponentInterface, selector: string, options?: ContentChildObservableOptions): Observable<T | null>`

`ContentChildObservableOptions` is an interface which defines options for this operator. It has the following
properties:

- `distinct: ElementComparatorFn|boolean`: This property defines how to compare elements for equality. If set to `true`,
  it will use default comparison function which compares elements by reference. If set to `false`, it will not perform
  any comparison and will emit value on each change of subtree, even if targeted element is unchanged. If set to a
  custom function, it will use that function to compare elements for equality. Default value is `true`.

Common use case for this operator is to monitor the presence of certain content child element and perform some action
when it is added or removed. Example below shows how to use this operator to monitor the presence and setup event
listener when that element is added, or remove event listener when that element is removed.



## `mutationObservable()`

Mutation observable is just a simple wrapper
around [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) which emits collection of
MutationRecord as changes in DOM subtree occur. This function is part of library as utility as some of the library
operators use it internally.

Function signature is: `mutationObservable(target: Node, options?: MutationObserverInit): Observable<MutationRecord[]>`

Details of this operator are not documented as behaviour is fully described in official documentation of
MutationObserver and its `MutationObserver.observe()`
method: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/observe.

## `propertyObservable()`

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

## `propertiesObservable()`

Similar to `propertyObservable()`, with exception that you are able to observe changes of multiple properties at once.

Function signature is:
`propertiesObservable<T extends any[]>(cmp: ComponentInterface, ...properties: string[]): Observable<T>`

Obvious use case is to observe changes of multiple properties at once and set the value of computed one.

```typescript jsx
import {
    Component,
    ComponentInterface,
    Prop,
}            from '@stencil/core';
import {map} from 'rxjs';
import {
    propertiesObservable,
    scheduleRender,
    untilDisconnected
}            from '@runopencode/rx-stencil';

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

## `renderObservable()`

This operator is used to create an observable which will emit new value after `render()` function of the component is
called. Note that this operator will emmit value on next micro-task (that is, after `Promise.resolve()`) to ensure that
resulting DOM is updated and in stable state.

This function is part of library as utility as some of the library operators use it internally.

Function signature is: `renderObservable(cmp: ComponentInterface): Observable<void>`

