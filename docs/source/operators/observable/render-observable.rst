==================
renderObservable()
==================

:bdg-primary:`Observable creation operator`

Create a new Observable that emits when the component ``render()`` function is
called. Value will be emitted after the next microtask (next tick).

If component is already rendered, the observable will emit immediately.

It uses hot observable pattern, which means that the observable is shared
between all subscribers and emits the same value to all of them.

.. js:function:: renderObservable(cmp)

   Creates an observable emitting when the component `render()` function is called.

   .. code-block:: typescript

      function renderObservable(cmp: ComponentInterface): Observable<void>;

   :param ComponentInterface cmp: The Stencil component instance to observe.
   :returns: Observable that emits when the component `render()` function is called.
   :rtype: Observable<void>

Example
-------

.. code-block:: tsx
   :caption: Initialize custom logic when component is rendered
   :linenos:

   import {
       Component,
       ComponentInterface,
       h,
   } from '@stencil/core';
   import { take } from 'rxjs/operators';
   import { renderObservable } from '@runopenode/rxjs-stencil';

   @Component({
       tag: 'my-cmp',
       shadow: true,
   })
   class MyCmp implements ComponentInterface {

       public constructor() {
            renderObservable(this)
                .pipe(
                    take(1)
                )
                .subscribe((): void => {
                    // Initialize custom logic when component is rendered.
                });
       }

       public render(): any {
           // Render component template
       }
   }
