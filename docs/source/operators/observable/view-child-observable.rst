=====================
viewChildObservable()
=====================

:bdg-primary:`Observable creation operator`

Observes element in the DOM subtree of the component view that match the given
selector. Inspired by Angular's `@ViewChild` decorator, this operator allows
you to observe changes in the view child element of a component.

Uses :doc:`render-observable` to observe rendering of the component and emits
the current view child element whenever the component is rendered.

When initialized, the observable will emit the current content child element 
(or ``null`` if it does not exist).

Implementation is more performant when component uses shadow DOM, while for
emulated shadow DOM, the observable will filter out elements that are not part
of the emulated view child.

.. note:: This operator is alternative to JSX's ``ref`` attribute. With this
           operator, you can observe the view child element as a stream of
           changes which can be useful in reactive programming scenarios.

.. warning:: Observer is very efficient when component uses shadow DOM, while 
             for emulated shadow DOM, the observable will filter out elements 
             that are not part of the emulated view child. Filtering process in
             that case might be expensive if there are many elements in the DOM 
             subtree of the component. 

.. js:function:: viewChildObservable(cmp, selector, options)
    
    Creates an observable that emits the current view child element of a Stencil
    component whenever the component is rendered.
    
    .. code-block:: typescript
    
        viewChildObservable<E extends Element = Element>(cmp: ComponentInterface, selector: string, options?: ViewChildObservableOptions): Observable<E | null>
    
    :param ComponentInterface cmp: The Stencil component instance for which to observe the view child element.
    :param string selector: The CSS selector used to identify the view child element.
    :param ViewChildObservableOptions options: Optional configuration options for the observable.
    :returns: Observable that emits the current view child element whenever the component is rendered.
    :rtype: Observable<E | null>

.. js:class:: ViewChildObservableOptions

   Configuration options for observing a view child element.

   .. code-block:: typescript

      export type ViewChildObservableOptions = {
          distinct?: ElementComparatorFn | boolean;
      };

   .. js:attribute:: distinct

      :type: ElementComparatorFn | boolean

      **Optional:** Yes

      **Default:** ``true``

      Controls whether the observable emits only when the
      observed element changes.

      - ``true`` - emit only when the element reference changes.
      - ``false`` - emit every time, regardless if element reference changes.
      - ``ElementComparatorFn`` - use a custom comparator to
        determine whether two elements are equal.

      The comparator should return ``true`` when elements
      are equal and ``false`` otherwise.

Example
-------

.. code-block:: tsx
   :caption: Observe view child element changes
   :linenos:

   import {
       Component,
       ComponentInterface,
       h,
   } from '@stencil/core';
   import { viewChildObservable } from '@runopenode/rxjs-stencil';

   @Component({
       tag: 'my-cmp',
       shadow: true,
   })
   class MyCmp implements ComponentInterface {

       public constructor() {
            viewChildObservable(this, '.my-view-child')
                .subscribe((element: Element | null): void => {
                    console.log('View child element changed:', element);
                });
       }

       public render(): JSX.Element {
           return (
               <div>
                   <div class="my-view-child">Hello, World!</div>
               </div>
           );
       }
   }