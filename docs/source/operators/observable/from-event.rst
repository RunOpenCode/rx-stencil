===========
fromEvent()
===========

:bdg-primary:`Observable creation operator`

Observes events emitted by a Stencil component. Inspired by RxJS's `fromEvent` 
function, this operator allows you to create an observable from DOM events using
component instance instead of a DOM element. It also supports event delegation,
allowing you to handle events from child elements matching a CSS selector.

.. _fromEvent(): https://rxjs.dev/api/index/function/fromEvent
.. _on(): https://api.jquery.com/on/#direct-and-delegated-events

See RxJS `fromEvent()`_ for more information about the original operator, see
JQuery's `on()`_ for more information about event delegation.

.. js:function:: fromEvent(cmp, eventName, delegate, options)

   Creates an observable emitting events from a Stencil component.

   .. code-block:: typescript

      function fromEvent<T extends Event = Event>(cmp: ComponentInterface, eventName: string, delegate?: string, options?: EventHandlerOptions): Observable<T>
      function fromEvent<T extends Event = Event>(cmp: ComponentInterface, eventName: string, options?: EventHandlerOptions): Observable<T>

   :param ComponentInterface cmp: The Stencil component instance for which to observe events.
   :param string eventName: The name of the event to observe.
   :param string delegate: An optional CSS selector to delegate the event to.
   :param EventHandlerOptions options: Optional configuration for the event handler.
   :returns: Observable that emits events of type T.
   :rtype: Observable<T>

.. js:class:: EventHandlerOptions

   Configuration options for observing events.

   .. code-block:: typescript

      export type EventHandlerOptions = {
          capture?: boolean;
          once?: boolean;
          passive?: boolean;
      };

   .. js:attribute:: capture

      :type: boolean

      **Optional:** Yes

      **Default:** ``false``

      Indicates that events of this type will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree.

   .. js:attribute:: once

      :type: boolean

      **Optional:** Yes

      **Default:** ``false``

      Indicates that the listener should be invoked at most once after being added. If true, the listener would be automatically removed when invoked and observers will be unsubscribed from the observable.

   .. js:attribute:: passive

      :type: boolean

      **Optional:** Yes

      **Default:** ``false``

      Indicates that the function specified by listener will never call preventDefault(). If it does, the user agent will ignore it and generate a console warning.

Example
-------

.. code-block:: tsx
   :caption: Observe click events on a Stencil component
   :linenos:

   import {
       Component,
       ComponentInterface,
       h,
   } from '@stencil/core';
   import { Observable } from 'rxjs';
   import { fromEvent } from '@runopenode/rxjs-stencil';

   @Component({
       tag: 'my-cmp',
       shadow: true,
   })
   class MyCmp implements ComponentInterface {

       public constructor() {
            fromEvent<MouseEvent>(this, 'click')
                .subscribe((event: MouseEvent): void => {
                    // Handle click event
                });
       }

       public render(): any {
           // Render component template
       }
   }