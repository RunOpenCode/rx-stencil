==========
Decorators
==========

Library provides a set of decorators that can be used to enhance the functionality 
of Stencil components. These decorators allow developers to easily query and observe
elements in the component's view or content, as well as react to changes in 
component's state.

It worth noting that the decorators are built on top of the underlying observable 
operators. Decorators which observe elements in the component's view or content 
are inspired by Angular's decorators (e.g., ``@ViewChild``, ``@ContentChildren``)
while decorators ``@QuerySelector()`` and ``@QuerySelectorAll()`` are inspired
by LitElement's ``querySelector()`` and ``querySelectorAll()`` methods.

Available decorators
--------------------

.. toctree::
   :maxdepth: 2
   :titlesonly:

   observe
   content-child
   content-children
   view-child
   view-children
   query-selector
