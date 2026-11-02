====================
mutationObservable()
====================

:bdg-primary:`Observable creation operator`

Creates mutation observer and return observable that emits mutation records when
the target node is mutated. 

.. _MutationObserver: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver

Read more about `MutationObserver`_.

This observable has little real world use cases in context of design of Stencil 
components, however, it is used internally for other operators.

.. _MutationRecord: https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord
.. _MutationObserverInit: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserverInit

.. js:function:: mutationObservable(target, options)

   Creates an observable emitting mutation records when the target node is mutated.

   .. code-block:: typescript

      function mutationObservable(target: Node, options?: MutationObserverInit): Observable<MutationRecord[]>;

   :param Node target: The target node to observe for mutations.
   :param MutationObserverInit options: The options for the mutation observer. See `MutationObserverInit`_ for more details.
   :returns: Observable that emits an array of `MutationRecord`_ objects when mutations occur.
   :rtype: Observable<MutationRecord[]>
