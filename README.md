# @runopencode/rx-stencil

[![npm version](https://badge.fury.io/js/@runopencode%2Frx-stencil.svg)](https://badge.fury.io/js/@runopencode%2Frx-stencil)

This is a small utility library which provides a set of useful functions for working with
[Stencil](https://stenciljs.com) components in conjunction with [RxJS](https://rxjs.dev). RxJS is not, in general, well
integrated with Stencil, nor core concepts of Stencil in regard to reactivity. However, certain problems can be solved 
much easier with RxJS, especially when it comes to working with problems related to executing HTTP request, with 
requirements such as debouncing, throttling, retrying, etc.

Stencil will eventually introduce support for signals, which resolves some of the issues with reactivity. However,
signals, while powerful, are not well suited for solving problems where you need to work with streams of data which
can be interrupted, retried, or canceled. RxJS is a perfect fit for such problems, and this library provides a simple
way to integrate RxJS with Stencil components, allowing you to use the best of both worlds.

> Major motivation for developing this library was to provide a simple way to integrate RxJS with Stencil since Stencil
> can be successfully used as framework-agnostic approach for developing design systems as well as smart
> components for server-side rendered applications. In conjunction with
> [@runopencode/http](https://github.com/RunOpenCode/http) Stencil can be used to communicate with RESTful APIs through
> RxJS and observables, instead of using imperative approach with Promises. This allows you to write very
> complex, glitch-free, components. Of course, you can use this library with any other HTTP client, or fetch API,
> wrapped by RxJS observables using function [`fromFetch()`](https://rxjs.dev/api/fetch/fromFetch).
> 
> In conjunction with [@stencil-community/context](https://github.com/stencil-community/context) and decent router 
> library, you can build very complex, glitch-free, SPA applications with Stencil without using any other framework.

## Documentation

Documentation is available at [https://rx-stencil.runopencode.com](https://rx-stencil.runopencode.com).

## TODO

- [ ] Add observables for other Stencil lifecycle events.
