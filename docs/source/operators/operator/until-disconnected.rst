===================
untilDisconnected()
===================

:bdg-success:`Pipeable operator`

Operator that unsubscribes from the source observable when the component is
disconnected from DOM.

.. attention:: This is the **MOST IMPORTANT** operator in this library. If you 
               are using observables in your Stencil component, you SHOULD use
               this operator, whenever is possible, to avoid memory leaks when
               component is removed from DOM.

.. tip:: Good practice is to use this operator as the last operator in the pipe.
         
.. tip:: If you subscribe to an observable when component is connected to DOM, 
         operator will unsubscribe from the observable when component is 
         disconnected from DOM. If component is garbage collected, this will 
         prevent memory leaks. If component is reconnected to DOM, since you are 
         subscribing to the observable in the ``connectedCallback()`` method, 
         you will be subscribed again to the observable.

.. js:function:: untilDisconnected(cmp)

    Creates a pipeable operator that unsubscribes from the source observable when
    the component is disconnected from DOM.
    
    .. code-block:: typescript
    
        function untilDisconnected<T = unknown>(cmp: ComponentInterface): MonoTypeOperatorFunction<T>
    
    :param ComponentInterface cmp: The Stencil component instance for which to unsubscribe from the source observable when disconnected from DOM.

Example
-------

.. code-block:: tsx
   :caption: Complex example of using ``untilDisconnected()`` operator in a Stencil component.
   :linenos:

   import {
       Component,
       ComponentInterface,
   } from '@stencil/core';
   import { contentChildObservable, untilDisconnected } from '@runopenode/rxjs-stencil';
   import { fromEvent, Observable } from 'rxjs';
   import { filter, switchMap, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
   import { fromFetch } from 'rxjs/fetch';

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
                    switchMap((value: string): Observable<Response> => fromFetch(`https://api.example.com/search?q=${value}`)),
                    untilDisconnected(this), // Unsubscribe from the observable when component is disconnected from DOM
                ).subscribe((response: Response): void => {;
                    // Handle the response from the search API...    
                });
       }
   }
