======================================
QuerySelector() and QuerySelectorAll()
======================================

Decorators ``@QuerySelector()`` and ``@QuerySelectorAll()`` are syntactic sugar 
for the :doc:`content-child`, :doc:`view-child`, :doc:`content-children` and 
:doc:`view-children` decorators.

By default, ``@QuerySelector()`` decorator will use :doc:`view-child` decorator,
while ``@QuerySelectorAll()`` decorator will use :doc:`view-children` decorator.

You may override this behavior by passing ``{ target: 'content' }`` as second 
argument to ``@QuerySelector()`` or ``@QuerySelectorAll()`` decorators, which 
will make them use :doc:`content-child` and :doc:`content-children` decorators,
respectively.

First argument of the decorators is a CSS selector string used to query the
element(s) in the DOM subtree of the component (either view or contend 
child/children). The second optional argument is an object with configuration 
options for the underlying decorator.