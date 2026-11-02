================
whileConnected()
================

:bdg-success:`Pipeable operator`

Operator that emits values from the source observable only while the component 
is connected to DOM.

This can be useful for cases where you want to move components in and out of 
the DOM, but keep subscription to the observable active only while the component
is connected. In general, this operator should be used when you want to avoid
reacting to values from an observable when the component is disconnected from 
the DOM.

Operator allows you to discard values from the source observable when the 
component is disconnected, or, to keep the last value, or last N values, or 
all values emitted while the component is disconnected, and emit them when the
component is connected again.

.. danger:: This operator will potentially lead to memory leaks. Subscription
            will be kept alive while component is disconnected. You **MUST** 
            ensure that you unsubscribe from the observable when component is
            intended to be destroyed, otherwise you will leak memory. Only case
            when garbage collection will be able to clean up the subscription is
            when component is the one producing and consuming the values from
            observable.

.. warning:: Be careful with re-emitting values when component is connected 
             again. Large buffer of values fills up memory, while re-emitting 
             them may lead to performance issues due to backpressure, especially
             if they are emitted in a tight loop.

.. js:function:: whileConnected(cmp, options)

   Creates pipable operator that emits values from the source observable only
   while the component is connected to DOM.

   .. code-block:: typescript

      function whileConnected<T>(cmp: ComponentInterface, options?: WhileConnectedOptions): MonoTypeOperatorFunction<T>

   :param ComponentInterface cmp: The Stencil component instance for which to observe the connection state.
   :param WhileConnectedOptions options: Optional configuration for the operator.
   :returns: Observable that emits values from the source observable only while the component is connected to DOM.
   :rtype: Observable<T>

.. js:class:: WhileConnectedOptions

   Configuration options for the operator.

   .. code-block:: typescript

      export type WhileConnectedOptions = {
          reemit?: boolean | number;
      };

   .. js:attribute:: reemit

      :type: boolean | number

      **Optional:** Yes

      **Default:** false

      Controls how many values from the source observable should be buffered while
      the component is disconnected from DOM. When component is connected again,
      buffered values will be emitted in order they were received.

      - ``false`` - discard all values emitted while component is disconnected.
      - ``true`` - keep only last value emitted while component is disconnected.
      - ``N`` - keep last N values emitted while component is disconnected, N > 1.
      - ``Infinity`` - keep all values emitted while component is disconnected.

Example
-------

.. code-block:: tsx
   :caption: Render number of seconds since component was initialized, but only while component is connected to DOM.
   :linenos:

   import { Component, h } from '@stencil/core';
   import { Observable, interval } from 'rxjs';
   import { whileConnected, scheduleRender } from '@runopenode/stencil-rxjs';

   @Component({
       tag: 'my-component',
       shadow: true,
   })
   export class MyComponent {

       private myObservable$: Observable<number> = interval(1000);

       private _value: number = 0;

       public constructor() {
           this.myObservable$
               .pipe(
                   whileConnected(this, { reemit: true }),
                   scheduleRender(this),
               )
               .subscribe(value => this._value = value);
       }

       render() {
           return (
               <div>{{ this._value }}</div>
           );
       }
   }
