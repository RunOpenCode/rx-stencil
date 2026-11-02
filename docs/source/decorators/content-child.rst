===============
@ContentChild()
===============

This decorator is inspired by Angular's ``@ContentChild`` decorator and allows
you to observe changes in the content child element of a Stencil component and 
set the value of a decorated property with the latest emitted value from the
observable created by the :doc:`../operators/observable/content-child-observable` operator.

Property may be decorated with ``@State()`` decorator to trigger re-render of 
the component when the value of the property changes.

.. warning:: Performances of this decorator will have same caveats as the 
             used underlying observable. Read the documentation of the
             :doc:`../operators/observable/content-child-observable` operator 
             for more information about performance considerations.

.. js:function:: ContentChild(selector, options)

   Decorates a property with an observable emitting the content child element of
   a Stencil component that matches the given selector and sets the value of the
   decorated property with the latest emitted value from the observable created 
   by the :doc:`../operators/observable/content-child-observable` operator.

   .. code-block:: typescript

      function ContentChild<E extends Element = Element>(selector: string, options?: ContentChildOptions): PropertyDecorator

   :param string selector: The CSS selector to match the content child element.
   :param ContentChildOptions options: Optional configuration for the decorator.
   :returns: Property decorator that sets the value of the decorated property with the latest emitted value from the observable created by the :doc:`../operators/observable/content-child-observable` operator.
   :rtype: PropertyDecorator

.. js:class:: ContentChildOptions

   Configuration options for observing a content child element.

   .. code-block:: typescript

      export type ContentChildOptions = {
          cached?: boolean;
          filter?: ElementFilterFn | boolean;
          whileConnected?: boolean;
          distinct?: ElementComparatorFn | boolean;
          attributes?: boolean;
          attributeFilter?: string[];
      };

   .. js:attribute:: cached

      :type: boolean

      **Optional:** Yes

      **Default:** ``false``

      If ``true``, property will be set only once, with the value of the content
      child element, if found. However, with ``filter`` option set, property 
      will be set only once with the value of the filtered element.

   .. js:attribute:: filter

      :type: ElementFilterFn | boolean
    
      **Optional:** Yes

      **Default:** ``false``

      Controls whether the property will be set only with the value of the 
      filtered element. If ``true``, the property will be set only when the 
      content child element is found. If ``false``, the property will be set
      with the value of the content child element, if found, or ``null`` if not 
      found. If a function is provided, it will be used to filter the content 
      child element and the property will be set only with the value of the 
      filtered element.

   .. js:attribute:: whileConnected

      :type: boolean

      **Optional:** Yes

      **Default:** ``false``

      If ``true``, the property will be set only when the component is connected
      to the DOM. When component is disconnected, the property will not be set 
      with any values. However, when component is re-connected, the property will 
      be set with the current value, if it has changed in the meantime. You may 
      use this option to avoid unnecessary recalculations or side effects when
      the component is not in the DOM, preserving last set value.

   .. js:attribute:: distinct
    
      Underlying implementation of the decorator uses 
      :doc:`../operators/observable/content-child-observable` operator. See the
      documentation of the operator for more information about this option.

   .. js:attribute:: attributes
    
      Underlying implementation of the decorator uses 
      :doc:`../operators/observable/content-child-observable` operator. See the
      documentation of the operator for more information about this option.

   .. js:attribute:: attributeFilter
    
      Underlying implementation of the decorator uses 
      :doc:`../operators/observable/content-child-observable` operator. See the
      documentation of the operator for more information about this option.

Example
-------

.. code-block:: tsx
   :caption: Get content child element and set the value of a property with it.
   :linenos:

   import { Component, h, State, Watch } from '@stencil/core';
   import { ContentChild } from '@runopenode/stencil-rxjs';

   @Component({
       tag: 'my-component',
       shadow: true,
   })
   export class MyComponent {

       @ContentChild('input', { cached: true, filter: true })
       @State()
       private _input: HTMLInputElement | null = null;

       @Watch('_input')
       private _onInputReady(): void {
           this._input!.addEventListener('input', (event: Event): void => {
               console.log('Input value changed:', (event.target as HTMLInputElement).value);
           });
       }

       public render(): any {
           return (
               <div>
                   <slot></slot>
               </div>
           );
       }
   }
