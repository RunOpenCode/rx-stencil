======================
propertiesObservable()
======================

:bdg-primary:`Observable creation operator`

Creates an observable that emits the value of a properties on an component 
whenever properties change. It uses the same underlying implementation as
:doc:`property-observable` operator, in conjunction with ``combineLatest()`` 
operator, to observe multiple properties at once.

.. js:function:: propertiesObservable(cmp, ...properties)

    Creates an observable emitting the values of multiple properties on a Stencil component
    whenever they change.
    
    .. code-block:: typescript
    
        function propertiesObservable<T extends ComponentInterface, K extends keyof T>(cmp: T, ...properties: K[]): Observable<Pick<T, K>>;
        function propertiesObservable<P extends object>(cmp: ComponentInterface, ...properties: (keyof P)[]): Observable<P>;
    
    :param ComponentInterface cmp: The Stencil component instance for which to observe the properties.
    :param PropertyKey ...properties: The names of the properties to observe.
    :returns: Observable that emits an object containing the latest values of the specified properties whenever any of the properties change.
    :rtype: Record<PropertyKey, unknown>

.. hint:: Operator can infer the type of properties from the component only if
          the observed properties are declared as public and have a type 
          annotation. Otherwise, you will need to provide the types explicitly 
          or deal with ``any`` type.

Example
-------

.. code-block:: tsx
   :caption: Observe multiple properties on a Stencil component
   :linenos:

   import {
       Component,
       ComponentInterface,
       h,
   } from '@stencil/core';
   import { propertiesObservable } from '@runopenode/rxjs-stencil';
   import { Observable } from 'rxjs';

   @Component({
       tag: 'my-cmp',
       shadow: true,
   })
   class MyCmp implements ComponentInterface {

       public foo: string;

       public bar: number;

       public constructor() {
            propertiesObservable(this, 'foo', 'bar')
                .subscribe(({foo, bar}): void => {
                    // Handle changes to foo and bar
                });
       }

       public render(): any {
           // Render component template
       }
   }
