================
scheduleRender()
================

:bdg-success:`Pipeable operator`

Schedule a render of the component. This is useful when you want to force a
render of the component as result of changing the values of the component which
are not tracked by Stencil (observables, for example).

By default, the render is scheduled on the next tick (after 
``Promise.resolve()``), but you can disable this behavior by passing ``false``
as second argument.

.. js:function:: scheduleRender(cmp, nextTick = true)

   Schedules a render of the component.

   .. code-block:: typescript

      function scheduleRender<T = unknown>(cmp: ComponentInterface, nextTick: boolean = true): MonoTypeOperatorFunction<T>

   :param ComponentInterface cmp: The Stencil component instance for which to schedule a render.
   :param boolean nextTick: Optional. If ``true``, the render will be scheduled on the next tick (after ``Promise.resolve()``). If ``false``, the render will be scheduled immediately.

Example
-------

.. code-block:: tsx
   :caption: Schedule rendering of component when observable emits
   :linenos:

   import { Component, h } from '@stencil/core';
   import { Observable, of } from 'rxjs';
   import { scheduleRender } from '@runopenode/stencil-rxjs';

   @Component({
       tag: 'my-component',
       shadow: true,
   })
   export class MyComponent {

       private myObservable$: Observable<number> = of(1, 2, 3);

       private _value: number = 0;

       public constructor() {
           this.myObservable$
               .pipe(
                   tap(value => this._value = value),
                   scheduleRender(this)
               )
               .subscribe();
       }

       render() {
           return (
               <div>{{ this._value }}</div>
           );
       }
   }