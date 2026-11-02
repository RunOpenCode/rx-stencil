========================
contentChildObservable()
========================

:bdg-primary:`Observable creation operator`

Observes element in the DOM subtree (content of `<slot>`) of the component that
match the given selector. Inspired by Angular's `@ContentChild` decorator, this
operator allows you to observe changes in the content child element of a 
component.

Uses mutation observer to observe changes in the DOM subtree of the component 
and emits value when content child element is added or removed (or attributes 
are changed, depending on configuration).

When initialized, the observable will emit the current content child element 
(or ``null`` if it does not exist).

Implementation is more performant when component uses shadow DOM, while for
emulated shadow DOM, the observable will filter out elements that are part of 
the emulated view child.

.. warning:: As observer is using mutation observer, performance may be affected
             if there are many changes and many children in the DOM subtree of
             the component. Use this operator with caution and only when necessary.

.. warning:: When component uses emulated shadow DOM, the observable will filter 
             out elements that are not in emulated slot. Filtering process in 
             that case might be expensive if there are many elements in the DOM 
             subtree of the component.

.. js:function:: contentChildObservable(cmp, selector, options)

   Creates an observable emitting the content child element of a Stencil 
   component that matches the given selector.

   .. code-block:: typescript

      function contentChildObservable<E extends Element = Element>(cmp: ComponentInterface, selector: string, options?: ContentChildObservableOptions): Observable<E | null>

   :param ComponentInterface cmp: The Stencil component instance for which to observe the content child element.
   :param string selector: The CSS selector to match the content child element.
   :param ContentChildObservableOptions options: Optional configuration for the observable
   :returns: Observable that emits either the content child element that matches the selector or ``null`` if it does not exist.
   :rtype: Observable<E | null>


.. js:class:: ContentChildObservableOptions

   Configuration options for observing a content child element.

   .. code-block:: typescript

      export type ContentChildObservableOptions = {
          distinct?: ElementComparatorFn | boolean;
          attributes?: boolean;
          attributeFilter?: string[];
      };

   .. js:attribute:: distinct

      :type: ElementComparatorFn | boolean

      **Optional:** Yes

      **Default:** ``true``

      Controls whether the observable emits only when the
      observed element changes.

      - ``true`` - emit only when the element reference changes.
      - ``false`` - emit every time, regardless if element reference changes.
      - ``ElementComparatorFn`` - use a custom comparator to
        determine whether two elements are equal.

      The comparator should return ``true`` when elements
      are equal and ``false`` otherwise.

   .. js:attribute:: attributes

      :type: boolean

      **Optional:** Yes

      **Default:** ``false``

      Controls whether the observable emits when attributes of the
      observed element change.

   .. js:attribute:: attributeFilter

      :type: string[]

      **Optional:** Yes

      **Default:** ``undefined``

      Specifies a list of attribute names to monitor. If provided, the observable will only emit when one of the specified attributes changes.

Example
-------

Example below is advanced, but it well demonstrates power of ReactiveX pattern 
and declarative programming vs imperative programming. In this example, we want
to implement component that will perform search operation based on input value. 
However, we want to allow highly customizable input element, so we will allow 
user to provide input element in the light DOM of our component. When input 
element is available, we want to subscribe to its input events and perform 
search operation based on the input value, with some additional operators 
applied to the input value, such as debounce and distinct until changed.

If during the lifetime of the component, input element is removed from the DOM, 
we will be unsubscribed from its input events, and when it is added back to the 
DOM, we will be subscribed again.

Operator ``untilDisconnected()`` is used to automatically unsubscribe from the
observable when component is disconnected from the DOM, so this component will 
not leak memory when it is removed from the DOM.

.. code-block:: tsx
   :caption: Observe content child element with selector 'input'. When input is available, subscribe to its input events and perform search.
   :linenos:

   import {
       Component,
       ComponentInterface,
       h,
   } from '@stencil/core';
   import { contentChildObservable, untilDisconnected } from '@runopenode/rxjs-stencil';
   import { fromEvent, Observable } from 'rxjs';
   import { filter, switchMap, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

   @Component({
       tag: 'my-cmp',
       shadow: true,
   })
   class MyCmp implements ComponentInterface {

       public connectedCallback(): void {
            contentChildObservable(this, 'input')
                .pipe(
                    filter((input: HTMLInputElement | null): input is HTMLInputElement => input !== null),
                    switchMap((input: HTMLInputElement): Observable<Event> => fromEvent(input, 'input')),
                    map((event: Event): string => (event.target as HTMLInputElement).value),
                    debounceTime(300),
                    distinctUntilChanged(),
                    untilDisconnected(this),
                ).subscribe((value: string): void => {
                    // Perform search with the input value...
                });
       }

       public render(): any {
           return (
               <Host>
                   <slot />
               </Host>
           );
       }
   }

.. code-block:: html
   :caption: Usage of <my-cmp> component with an input element in the light DOM.
   :linenos:

   <my-cmp>
       <input type="text" placeholder="Search..." />
   </my-cmp>
