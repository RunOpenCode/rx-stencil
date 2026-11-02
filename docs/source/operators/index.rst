=========
Operators
=========

ReactiveX (RxJS as its JavaScript implementation) defines in general two types 
of operators: creation operators and pipable operators. Creation operators are
used to create new Observables, while pipable operators are used to transform
or somehow manipulate the values emitted by an Observable.

.. _documentation: https://rxjs.dev/guide/operators

Read more about operators in the official `documentation`_ about operators.

Creation operators
------------------

.. toctree::
   :maxdepth: 2
   :titlesonly:

   observable/connected-observable
   observable/content-child-observable
   observable/content-children-observable
   observable/from-event
   observable/mutation-observable
   observable/properties-observable
   observable/property-observable
   observable/render-observable
   observable/view-child-observable
   observable/view-children-observable

Pipeable operators
------------------

.. toctree::
   :maxdepth: 2
   :titlesonly:

   operator/schedule-render
   operator/to-property
   operator/until-disconnected
   operator/while-connected

Subscriptions
-------------

.. toctree::
   :maxdepth: 2
   :titlesonly:

   subscriber/set-property

