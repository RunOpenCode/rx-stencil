============
toProperty()
============

:bdg-success:`Pipeable operator`

Use this operator to tap into a value stream and flush value to component property. It is shortcut for 
``tap(value => cmp.prop = value)``. It is useful when you want to bind observable value to component property.

.. js:function:: toProperty(cmp, prop)

    Creates a pipeable operator that flushes value to component property.
    
    .. code-block:: typescript
    
        function toProperty<T = unknown>(cmp: ComponentInterface, prop: PropertyKey): MonoTypeOperatorFunction<T>
    
    :param ComponentInterface cmp: The Stencil component instance for which to flush value to property.
    :param PropertyKey prop: The name of the property to flush value to.

Example
-------

.. code-block:: tsx
   :caption: Flush observable value to component property.
   :linenos:

   import { Component, h } from '@stencil/core';
   import { Observable, of } from 'rxjs';
   import { toProperty, scheduleRender } from '@runopenode/stencil-rxjs';

   @Component({
       tag: 'my-component',
       shadow: true,
   })
   export class MyComponent {

       private _observable$: Observable<number> = of(1, 2, 3);

       private _value: number = 0;

       public constructor() {
           this._observable$
               .pipe(
                   toProperty(this, '_value'),
                   scheduleRender(this),
               )
               .subscribe();
       }

       render() {
           return (
               <div>{{ this._value }}</div>
           );
       }
   }
