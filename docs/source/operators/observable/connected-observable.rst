=====================
connectedObservable()
=====================

:bdg-primary:`Observable creation operator`

Observes the connection state of a Stencil component to the DOM.

Connected observable is just a simple wrapper around Stencil's 
``connectedCallback()`` and ``disconnectedCallback()`` lifecycle methods which 
emits value when component is connected to the DOM, or disconnected from it. 
When created, current state of component is immediately emitted.

Uses hot observable pattern, which means that the observable is shared between
all subscribers and emits the same value to all of them.

This observable has little real world use cases, however, it is used internally
for other operators.

.. js:function:: connectedObservable(cmp)

   Creates an observable emitting the connection state of a Stencil component.

   .. code-block:: typescript

      function connectedObservable(cmp: ComponentInterface): Observable<boolean>;

   :param ComponentInterface cmp: The Stencil component instance to observe.
   :returns: Observable that emits ``true`` when the component is connected to the DOM and ``false`` when it is disconnected.
   :rtype: Observable<boolean>

Example
-------

.. code-block:: tsx
   :caption: Process window scroll events only when component is connected to the DOM
   :linenos:

   import {
       Component,
       ComponentInterface,
       h,
   } from '@stencil/core';
   import { connectedObservable } from '@runopenode/rxjs-stencil';
   import { fromEvent, Observable } from 'rxjs';
   import { filter, switchMap } from 'rxjs/operators';
   
   @Component({
       tag: 'my-cmp',
       shadow: true,
   })
   class MyCmp implements ComponentInterface {

       public constructor() {
            connectedObservable(this)
                .pipe(
                    filter((isConnected: boolean): boolean => isConnected),
                    switchMap((): Observable<Event> => fromEvent(window, 'scroll')),
                )
                .subscribe((event: Event): void => {
                    // Handle scroll event
                });
       }

       public render(): any {
           // Render component template
       }
   }
