# @QuerySelector()

`@QuerySelector()` is a property decorator which can be used to query for a specific element in the component's
template. It is inspired by the `@ViewChild()` and `@ContentChild()` decorator in Angular. It accepts a CSS selector as
an argument which will be used to query for the element. This is alternative approach to the getting reference to a DOM
element in the component (see: https://stenciljs.com/docs/templating-jsx#getting-a-reference-to-a-dom-element for more
details). Using this decorator, you are able to apply declarative style of programming when working with DOM elements.

`@QuerySelector()` decorator accepts two arguments:

- `selector`, string, required - CSS selector which will be used to query for the element. It can be any valid CSS
  selector. Search will start from the component element, or shadow root if component is using shadow DOM and parameter
  `shadowRoot` is set to `true`.
- `shadowRoot`, boolean, optional, default `false`: if set to `true`, search will start from the component's shadow
  root. If component does not use shadow DOM, exception will be thrown.

`@QuerySelector()` decorator must be used on any property of the component, and type of the property is `Observable`
from `rxjs` library. Observable will be used to emit reference to queried element, or `null` if element does not exist.
Note that you should not set initial value for the property, decorator will do that for you. Example:

```typescript
class MyCmp {
    @QuerySelector('div')
    private element$: Observable<HTMLElement | null>;
}
```

After each execution of the `render()` function of the component, decorator will query for the element and emit its
reference, if it can be found, or `null`. This value will be emitted only if it is different from the previous one and
on next micro-task (i.e. after `Promise.resolve()`). 

A fair warning: in theory, you are able to create infinite loop without noticing because value is emitted on next 
micro-task, main browser thread will not be blocked.

## Example

Let's say that your component has a template which consist of an input field for search and a list of results. You want
for user to be able to type term in the input field and to see results in the list. However, you would like to debounce
search as well as not to send same search term twice. Imperative approach would require a lot of code for this task,
however, with RxJS this can be done in a very elegant way.

```typescript jsx
import {
    Component,
    ComponentInterface,
    State,
    h,
} from '@stencil/core';
import {
    debounceTime,
    distinctUntilChanged,
    from,
    fromEvent,
    map,
    Observable,
    switchMap,
} from 'rxjs';
import { fromFetch } from 'rxjs/internal/observable/dom/fetch';
import { untilDisconnected } from '@runopencode/rx-stenciljs';

@Component({
    tag: 'app-search',
    shadow: true,
})
class AppSearch implements ComponentInterface {

    @QuerySelector('input[type="search"]', true)
    private readonly input$: Observable<HTMLInputElement>;

    @State()
    private result: string[] = [];

    public connectedCallback(): void {
        this.input$.pipe(
            // when input is ready, we can start listening for `input` events
            switchMap((input: HTMLInputElement): Observable<string> => {
                return fromEvent(input, 'input').pipe(
                        map((): string => input.value.trim()),
                );
            }),
            // debounce input events to avoid sending too many requests
            // and filter out same search terms sent in a row      
            debounceTime(300),
            distinctUntilChanged(),
            // send search request
            switchMap((term: string): Observable<string[]> => {
                return fromFetch(`https://api.example.com/search?term=${term}`).pipe(
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
                <input type='search' />
                {this.result.map((item): any => <div>{item}</div>)}
            </Host>
        );
    }
}
```
