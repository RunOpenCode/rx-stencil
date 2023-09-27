# @runopencode/rx-stencil

This is a small utility library which provides a set of useful functions for working with StencilJS components in
conjunction with RxJS. RxJS is not, in general, well integrated with StencilJS, nor core concepts of StencilJS in regard
to reactivity. However, certain problems can be solved much easier with RxJS, especially when it comes to working with
problems related to executing HTTP request, with requirements such as debouncing, throttling, retrying, etc.

> Major motivation for developing this library was to provide a simple way to integrate RxJS with StencilJS
> since StencilJS can be successfully used as framework-agnostic approach for developing design systems as well as smart
> components for server-side rendered applications. In conjunction
> with [@runopencode/http](https://github.com/RunOpenCode/http) StencilJS can be used to communicate with RESTful APIs
> through RxJS and observables, instead of using imperative approach with Promises. This allows you to write very
> complex, glitch-free, components.

## Table of contents

- [Components](docs/components.md)
  - [<rx-async>](docs/components.md#rx-async)
- Decorators
  - [@QuerySelector()](docs/query-selector-decorator.md)

