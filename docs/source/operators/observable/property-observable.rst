====================
propertyObservable()
====================

:bdg-primary:`Observable creation operator`

Creates an observable that emits the value of a property on an component 
whenever it changes. It can be used to observe changes to a property on a 
Stencil component, regardless of whether the property is decorated with 
``@Prop()``, ``@State()`` or not.

While you can use common Stencil way of watching for property changes using
``@Watch()`` decorator, this operator allows you to observe property changes in
a reactive way, composing it with other observables and operators.

.. note:: Do note that underlying implementation of this operator uses 
          somewhat hacky way of observing property changes, which may not be
          future proof. This will change in the future with official release
          of signal based properties, which will allow to observe property 
          changes in a more robust way.


.. js:function:: propertyObservable(cmp, property)

    Creates an observable emitting the value of a property on a Stencil component
    whenever it changes.
    
    .. code-block:: typescript
    
       function propertyObservable<C extends ComponentInterface, K extends keyof C>(cmp: C, property: K): Observable<C[K]>
       function propertyObservable<T = unknown>(cmp: ComponentInterface, property: PropertyKey): Observable<T>;
    
    :param ComponentInterface cmp: The Stencil component instance for which to observe the property.
    :param PropertyKey property: The name of the property to observe.
    :returns: Observable that emits the value of the property whenever it changes.
    :rtype: Observable<T>

.. hint:: Operator can infer the type of property from the component only if
          the property is declared as public and has a type annotation. 
          Otherwise, you will need to provide the type explicitly or deal with 
          it as ``any`` type.

Example
-------

.. code-block:: tsx
   :caption: Observe changes to a property on a Stencil component
   :linenos:

   import {
       Component,
       ComponentInterface,
       h,
   } from '@stencil/core';
   import { propertyObservable } from '@runopenode/rxjs-stencil';
   import { Observable } from 'rxjs';

   @Component({
       tag: 'my-cmp',
       shadow: true,
   })
   class MyCmp implements ComponentInterface {

       public myProp: string;

       public constructor() {
            propertyObservable<string>(this, 'myProp')
                .subscribe((value: string): void => {
                    // Handle property change
                });
       }

       public render(): any {
           // Render component template
       }
   }

