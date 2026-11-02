========================
viewChildrenObservable()
========================

:bdg-primary:`Observable creation operator`

Observes elements in the DOM subtree of the component view that match the given
selector. Inspired by Angular's `@ViewChildren` decorator, this operator allows
you to observe changes in the view child elements of a component.

Uses :doc:`render-observable` to observe rendering of the component and emits
the current view child elements whenever the component is rendered.

When initialized, the observable will emit the current content child elements 
(or an empty array if none exist).

Implementation is more performant when component uses shadow DOM, while for
emulated shadow DOM, the observable will filter out elements that are not part
of the emulated view children.

.. warning:: Observer is very efficient when component uses shadow DOM, while 
             for emulated shadow DOM, the observable will filter out elements 
             that are not part of the emulated view child. Filtering process in
             that case might be expensive if there are many elements in the DOM 
             subtree of the component.

.. js:function:: viewChildrenObservable(cmp, selector, options)
    
    Creates an observable that emits the current view children elements of a 
    Stencil component whenever the component is rendered.
    
    .. code-block:: typescript
    
        viewChildrenObservable<E extends Element = Element>(cmp: ComponentInterface, selector: string, options?: ViewChildrenObservableOptions): Observable<E[]>
    
    :param ComponentInterface cmp: The Stencil component instance for which to observe the view children elements.
    :param string selector: The CSS selector used to identify the view children elements.
    :param ViewChildrenObservableOptions options: Optional configuration options for the observable.
    :returns: Observable that emits the current view children elements whenever the component is rendered.
    :rtype: Observable<E[]>

.. js:class:: ViewChildrenObservableOptions

   Configuration options for observing a view children elements.

   .. code-block:: typescript

      export type ViewChildrenObservableOptions = {
          distinct?: ElementComparatorFn | boolean;
      };

   .. js:attribute:: distinct

      :type: ElementComparatorFn | boolean

      **Optional:** Yes

      **Default:** ``true``

      Controls whether the observable emits only when the collection of
      observed elements changes.

      - ``true`` - emit only when the references of elements changes.
      - ``false`` - emit every time, regardless if element references changes.
      - ``ElementComparatorFn`` - use a custom comparator to
        determine whether two elements are equal.

      The comparator should return ``true`` when elements
      are equal and ``false`` otherwise.

Example
-------

Example of observing view children elements is not provided as it varies very
little from observing view child element. See :doc:`view-child-observable`
for example of observing view child element.
