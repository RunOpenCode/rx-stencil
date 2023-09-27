# @QuerySelectorAll()

`@QuerySelectorAll()` is a property decorator which can be used to query for a collection of elements in the component's
template. It is inspired by the `@ViewChildren()` and `@ContentChildren()` decorators in Angular. It accepts a CSS
selector as an argument which will be used to query for the elements. In Stencil, you can reference to a DOM
element in the component (see: https://stenciljs.com/docs/templating-jsx#getting-a-reference-to-a-dom-element for more
details), however, getting collection of elements is a bit tricky. Using this decorator, you can achieve that with ease,
and you are able to apply declarative style of programming when working with DOM elements.

`@QuerySelectorAll()` decorator accepts two arguments:

- `selector`, string, required - CSS selector which will be used to query for the elements. It can be any valid CSS
  selector. Search will start from the component element, or shadow root if component is using shadow DOM and parameter
  `options.shadowRoot` is set to `true`.
- `options`, `QuerySelectorAllOptions`, optional, default `undefined` which means that default options will be used.
  This is an object with following properties:
    - `shadowRoot`, boolean, optional, default `false` - if set to `true`, search will start from shadow root of the
      component, instead of the component element itself. If component does not use shadow DOM, exception will be
      thrown.
    - `mutationObserver`, boolean, optional, default `false` - if set to `true`, decorator will use MutationObserver to
      observe changes in the DOM subtree of the component. This is more reliable approach, but it is also more
      expensive. It should be used when you are querying for elements which are projected into the component through
      `<slot>` element, or if subtree of the component is changed by some other means, not via Stencil's reactivity. By
      default, decorator will monitor execution of the `render()` function of the component and will query for the
      elements after each execution.

`@QuerySelectorAll()` decorator must be used on any property of the component, and type of the property is `Observable`
from `rxjs` library. Observable will be used to emit reference to collection of queried elements, or empty collection,
if elements could not be found. Note that you should not set initial value for the property, decorator will do that for
you. Example:

```typescript
class MyCmp {
    @QuerySelectorAll('div')
    private elements$: Observable<HTMLElement[]>;
}
```

After each execution of the `render()` function of the component (or mutation of DOM subtree), decorator will query for
the elements and emit their reference. This value will be emitted only if collection differs from the previous one.
Emission is executed on next micro-task (i.e. after `Promise.resolve()`).

A fair warning: in theory, you are able to create infinite loop without noticing because value is emitted on next
micro-task, main browser thread will not be blocked.

## Example

Similar to example given for `@QuerySelectorAll()` decorator, we are trying to build a search list, however, filters
will be projected through `<slot>` element. Only thing that we know is that filters will be either `<input>` or
`<select>`elements and their `name` attribute should be used as the name of query parameter in search URL. Such flexible
search component is fairly simple to write using RxJS and `@QuerySelectorAll()` decorator.

```typescript jsx
import { Component, ComponentInterface, State } from '@stencil/core';
import {
    combineLatest,
    debounceTime,
    distinctUntilChanged,
    fromEvent,
    map,
    merge,
    Observable, queue,
    startWith,
    switchMap,
} from 'rxjs';
import { fromFetch } from 'rxjs/internal/observable/dom/fetch';
import { untilDisconnected } from '@runopencode/rx-stencil';

@Component({
    tag: 'app-search',
    shadow: true,
})
class AppSearch implements ComponentInterface {

    @QuerySelector('input, select')
    private readonly fields$: Observable<HTMLInputElement[] | HTMLSelectElement[]>;

    @State()
    private result: string[] = [];

    public connectedCallback(): void {
        this.fields$.pipe(
            // When inputs/selects are ready, we can start listening for `input` and `change` events.
            switchMap((fields: HTMLInputElement[] | HTMLSelectElement[]): Observable<string> => {
                // This is tricky part, we need to convert every field into observable which will emit
                // tuple of field name and its value. Since we are going to use `combineLatest()` operator,
                // we need to start with initial value for all, we will use `startWith()` operator for that.
                let observables: Observable<[string, string]>[] = fields.map((input: HTMLInputElement | HTMLSelectElement): Observable<string> => {
                    return merge(
                        fromEvent(input, 'input'),
                        fromEvent(input, 'change'),
                    ).pipe(
                        startWith(),
                        map((): string => [input.name, input.value.trim()]),
                    );
                });

                // Now we can combine all observables into one. Note that because of `startWith()` operator,
                // `combineLatest()` will emit initial value immediately. If you want to avoid that, you can
                // use `skip(1)` operator.
                return combineLatest(observables);
            }),
            // debounce input events to avoid sending too many requests
            // and filter out same search terms sent in a row      
            debounceTime(300),
            // convert array of tuples into query string
            map((values: [string, string][]): string => {
                let queryParams: string[] = [];
                
                for (let [name, value] of values) {
                    queryParams.push(`${name}=${value}`);
                }
                
                return queryParams.join('&');
            }),
            // skip successive same query params
            distinctUntilChanged(),
            // send search request
            switchMap((query: string): Observable<string[]> => {
                return fromFetch(`https://api.example.com/search?${query}`).pipe(
                        switchMap((response: Response): Observable<string[]> => response.json()),
                );
            }),
            // unsubscribe when component is disconnected
            untilDisconnected(this),
        ).subscribe((result: string[]): void => {
            this.result = result;
        });
    }

    public render(): any {
        return (
            <Host>
                <slot />
                {this.result.map((item): any => <div>{item}</div>)}
            </Host>
        );
    }
}
```

With this component, you can use any number of `<input>` and `<select>` elements as filters, and they will be queried by
the component.

```html
<app-search>
    <input type="search" name="term" />
    <select name="category">
        <option value="1">Category 1</option>
        <option value="2">Category 2</option>
        <option value="3">Category 3</option>
    </select>
</app-search>
```
