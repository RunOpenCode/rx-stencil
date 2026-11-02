==========
@Observe()
==========

An alternative to the `@Watch()` decorator is the `@Observe()` decorator. 
The `@Observe()` decorator allows you to observe changes to any property, 
regardless if it is decorated with `@Prop()`, `@State()`, or any other decorator.

.. js:function:: Observe(options)

   Decorates a method with an observable which invokes it when the decorated 
   property changes.

   .. code-block:: typescript

      function Observe(property: PropertyKey, options?: ObserveOptions)

   :param PropertyKey property: The name of the property to observe for changes.
   :param ObserveOptions options: Optional configuration for the decorator.
   :returns: Method decorator that invokes the decorated method when the observed property changes.
   :rtype: MethodDecorator

.. js:class:: ObserveOptions

    Configuration options for observing a property.
    
    .. code-block:: typescript
    
        export type ObserveOptions = {
             immediate?: boolean;
             whileConnected?: boolean;
        };
    
    .. js:attribute:: immediate
    
        :type: boolean
    
        **Optional:** Yes
    
        **Default:** ``false``
    
        If ``true``, the decorated method will be invoked immediately with the
        current value of the observed property when the component is connected 
        to the DOM.
    
    .. js:attribute:: whileConnected
    
        :type: boolean
    
        **Optional:** Yes
    
        **Default:** ``false``
    
        If ``true``, the decorated method will be invoked only when the 
        component is connected to the DOM. If component is disconnected from the
        DOM and re-connected, the decorated method will be invoked again with 
        the current value of the observed property, if value has changed since 
        the last invocation.

Example
-------

.. code-block:: tsx
   :caption: Observe changes to a property and invoke a method
   :linenos:

   import { Component, h } from '@stencil/core';
   import { Observe } from '@runopenode/rxjs-stencil';

   @Component({
       tag: 'my-component',
       shadow: true,
   })
   export class MyComponent {

       private _foo: string = '';

       private _bar: string = '';

       @Observe('_foo', { immediate: true, whileConnected: true })
       @Observe('_bar', { immediate: true, whileConnected: true })
       private _onChange(current: string, previous: string, property: PropertyKey): void {
           console.log(`Property ${String(property)} changed from ${previous} to ${current}`);
       }

       public render(): any {
           return (
               <div>{this._foo}</div>
               <div>{this._bar}</div>
           );
       }
   }