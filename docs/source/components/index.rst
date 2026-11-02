==========
Components
==========

.. _Observable: https://rxjs.dev/guide/observable
.. _Promise: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

There is only one component available within this library at the moment which
allows you to easily render value of `Observable`_ or `Promise`_ in your Stencil 
component's template. The component is ``rx-async``.

``rx-async``
------------

``rx-async`` is a simple component which accepts an observable or promise as a
property and renders the result of the observable. It is similar to the `async`
pipe in Angular, except it can only render stringable value (basically, anything 
that can be converted to string).

Properties
++++++++++

- ``value: PromiseLike<T> | Observable<T> | T | null | undefined`` - value to be
  rendered. It can be an observable, a promise, a scalar value, or 
  null/undefined.
- ``transform: (value: T) => string`` - optional function to transform the value
  before rendering. If not provided, the value will be converted to string using 
  ``String(value)``.

Example
+++++++

.. code-block:: tsx
   :caption: Using <rx-async /> component in Stencil template
   :linenos:

   import {
       Component,
       ComponentInterface,
       Host,
       h,
   }                  from '@stencil/core';
   import { Subject } from 'rxjs';
   
   @Component({
       tag: 'app-counter',
       shadow: true,
   })
   class AppCounter implements ComponentInterface {

       private readonly counter$: Subject<number> = new Subject();

       public connectedCallback(): void {
           setInterval((): void => {
               this.counter$.next(Math.random());
           }, 1000);
       }

       public render(): any {
           return (
               <Host>
                   <rx-async
                       value={this.counter$}
                       transform={(value: number): string => `Counter value: ${value.toFixed(2)}`}
                   />
               </Host>
           );
       }
   }

