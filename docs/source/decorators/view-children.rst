===============
@ViewChildren()
===============

This decorator is inspired by Angular's ``@ViewChildren`` decorator and allows
you to observe changes in the view children elements of a Stencil component and 
set the value of a decorated property with the latest emitted value from the
observable created by the :doc:`../operators/observable/view-children-observable` 
operator.

Property may be decorated with ``@State()`` decorator to trigger re-render of 
the component when the value of the property changes.

.. warning:: Performances of this decorator will have same caveats as the 
             used underlying observable. Read the documentation of the
             :doc:`../operators/observable/view-children-observable` operator 
             for more information about performance considerations.

.. js:function:: ViewChildren(selector, options)

   Decorates a property with an observable emitting the view children 
   elements of a Stencil component that matches the given selector and sets the
   value of the decorated property with the latest emitted value from the
   observable created by the :doc:`../operators/observable/view-children-observable`
   operator.    

   .. code-block:: typescript
    
      function ViewChildren<E extends Element = Element>(selector: string, options?: ViewChildrenOptions): PropertyDecorator

   :param string selector: The CSS selector to match the view children elements.
   :param ViewChildrenOptions options: Optional configuration for the observable.
   :returns: Property decorator that sets the value of the decorated property with the latest emitted value from the observable created by the :doc:`../operators/observable/view-children-observable` operator.
   :rtype: PropertyDecorator

.. js:class:: ViewChildrenOptions

   Configuration options for observing a view children elements.
   
   .. code-block:: typescript
   
      export type ViewChildrenOptions = {
           cached?: boolean;
           filter?: ElementsFilterFn | boolean;
           whileConnected?: boolean;
           distinct?: ElementComparatorFn | boolean;
      };
   
   .. js:attribute:: cached
   
      :type: boolean
   
      **Optional:** Yes
   
      **Default:** ``false``
   
      If ``true``, property will be set only once, with the value of the view
      children elements, if found. However, with ``filter`` option set, property 
      will be set only once with the value of the filtered elements.

   .. js:attribute:: filter

      :type: ElementsFilterFn | boolean
    
      **Optional:** Yes

      **Default:** ``false``

      Controls whether the property will be set only with the value of the 
      filtered elements. If ``true``, the property will be set only when the 
      view children elements are found. If ``false``, the property will be set
      with the value of the view children elements, if found, or empty array 
      if not found. If a function is provided, it will be used to filter the 
      view children elements and the property will be set only with the value 
      of the filtered elements.

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
      :doc:`../operators/observable/view-children-observable` operator. See the
      documentation of the operator for more information about this option.

