=======================
@runopencode/rx-stencil
=======================

Welcome to the documentation for ``@runopencode/rx-stencil`` developed and 
maintained by RunOpenCode. This library is an open-source package designed to 
help developers include ReactiveX patterns for reactive programming in their 
Stencil components and applications with ease.

.. _GitHub: https://github.com/runopencode/rx-stencil

All libraries are published under MIT licence and hosted on `GitHub`_.

.. |npm| image:: https://badge.fury.io/js/@runopencode%2Frx-stencil.svg
   :target: https://badge.fury.io/js/@runopencode%2Frx-stencil
   :alt: npm version

|npm|

Introduction
------------

.. _Stencil: https://stenciljs.com
.. _RxJS: https://rxjs.dev

This is a small utility library which provides a set of useful functions for 
working with `Stencil`_ components in conjunction with `RxJS`_. RxJS is not,
in general, well integrated with Stencil, nor core concepts of Stencil in
regard to reactivity. However, certain problems can be solved much easier with 
RxJS, especially when it comes to working with problems related to executing 
HTTP requests, with requirements such as debouncing, throttling, retrying, etc.

Stencil introduced support for signals, which resolves some of the issues with
reactivity as well as developer experience. However, signals, while powerful,
are not well suited for solving problems where you need to work with streams of
data which can be interrupted, retried, or canceled. RxJS is a perfect fit for 
such problems, and this library provides a simple way to integrate RxJS with 
Stencil components, allowing you to use the best of both worlds.

.. warning:: **Watch out for memory leaks!** If you are unexperienced with RxJS,
             you may easily create memory leaks in your Stencil components. Get
             familiar with RxJS and its commonly used operators, and most 
             importantly, learn how to properly unsubscribe from observables 
             when they are no longer needed. This library provides some operators
             which can help you with that, but it is still your responsibility
             to ensure that you are not leaking memory in your components.

.. tip:: Subscribe in ``connectedCallback()`` and use ``untilDisconnected()`` 
         operator to automatically unsubscribe when component is disconnected 
         from the DOM. This will help you avoid memory leaks in your components.

Table of Contents
-----------------

.. toctree::
   :maxdepth: 2
   :titlesonly:

   Components<components/index>
   Operators<operators/index>
   Decorators<decorators/index>
   Contributing<contributing>

