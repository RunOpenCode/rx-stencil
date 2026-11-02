===========================
contentChildrenObservable()
===========================

:bdg-primary:`Observable creation operator`

Observes elements in the DOM subtree (content of `<slot>`) of the component that
match the given selector. Inspired by Angular's `@ContentChildren` decorator, 
this operator allows you to observe changes in the content child elements of a 
component.

Uses mutation observer to observe changes in the DOM subtree of the component 
and emits value when content children elements are added or removed (or 
attributes are changed, depending on configuration).

When initialized, the observable will emit the current content children elements 
(or empty array if they do not exist).

Implementation is more performant when component uses shadow DOM, while for
emulated shadow DOM, the observable will filter out elements that are part of 
the emulated view child.

.. warning:: As observer is using mutation observer, performance may be affected
             if there are many changes and many children in the DOM subtree of
             the component. Use this operator with caution and only when necessary.

.. warning:: When component uses emulated shadow DOM, the observable will filter 
             out elements that are not in emulated slot. Filtering process in 
             that case might be expensive if there are many elements in the DOM 
             subtree of the component.

.. js:function:: contentChildrenObservable(cmp, selector, options)

   Creates an observable emitting the content children elements of a Stencil 
   component that match the given selector.

   .. code-block:: typescript

      function contentChildrenObservable<E extends Element = Element>(cmp: ComponentInterface, selector: string, options?: ContentChildrenObservableOptions): Observable<E[]>

   :param ComponentInterface cmp: The Stencil component instance for which to observe the content children elements.
   :param string selector: The CSS selector to match the content children elements.
   :param ContentChildrenObservableOptions options: Optional configuration for the observable
   :returns: Observable that emits either the content children elements that match the selector or an empty array if they do not exist.
   :rtype: Observable<E[]>


.. js:class:: ContentChildrenObservableOptions

   Configuration options for observing content children elements.

   .. code-block:: typescript

      export type ContentChildrenObservableOptions = {
          distinct?: ElementComparatorFn | boolean;
          attributes?: boolean;
          attributeFilter?: string[];
      };

   .. js:attribute:: distinct

      :type: ElementComparatorFn | boolean

      **Optional:** Yes

      **Default:** ``true``

      Controls whether the observable emits only when the
      collection of observed elements changes.

      - ``true`` - emit only when at least one element reference changes.
      - ``false`` - emit every time, regardless if element references change.
      - ``ElementComparatorFn`` - use a custom comparator to
        determine whether two elements are equal.

      The comparator should return ``true`` when elements
      are equal and ``false`` otherwise.

   .. js:attribute:: attributes

      :type: boolean

      **Optional:** Yes

      **Default:** ``false``

      Controls whether the observable emits when attributes of the
      observed elements change.

   .. js:attribute:: attributeFilter

      :type: string[]

      **Optional:** Yes

      **Default:** ``undefined``

      Specifies a list of attribute names to monitor. If provided, the observable will only emit when one of the specified attributes changes.

Example
-------

Example of observing content children elements is not provided as it varies very
little from observing content child element. See :doc:`content-child-observable`
for example of observing content child element.
