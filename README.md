# @runopencode/rx-stencil

[![npm version](https://badge.fury.io/js/@runopencode%2Frx-stencil.svg)](https://badge.fury.io/js/@runopencode%2Frx-stencil)

This is a small utility library which provides a set of useful functions for working
with [Stencil](https://stenciljs.com) components in conjunction with [RxJS](https://rxjs.dev). RxJS is not, in general,
well integrated with Stencil, nor core concepts of Stencil in regard to reactivity. However, certain problems can be
solved much easier with RxJS, especially when it comes to working with problems related to executing HTTP request,
with requirements such as debouncing, throttling, retrying, etc.

> Major motivation for developing this library was to provide a simple way to integrate RxJS with Stencil since Stencil
> can be successfully used as framework-agnostic approach for developing design systems as well as smart
> components for server-side rendered applications. In conjunction with
> [@runopencode/http](https://github.com/RunOpenCode/http) Stencil can be used to communicate with RESTful APIs through
> RxJS and observables, instead of using imperative approach with Promises. This allows you to write very
> complex, glitch-free, components. Of course, you can use this library with any other HTTP client, or fetch API,
> wrapped by RxJS observables using function "[fromFetch()](https://rxjs.dev/api/fetch/fromFetch)".

## Table of contents

- [Components](docs/components.md)
    - [rx-async](docs/components.md#rx-async) - render observable/resolved promise value.
- Property decorators
    - [@QuerySelector()](docs/query-selector-decorator.md) - select single element from DOM within component subtree.
    - [@QuerySelectorAll()](docs/query-selector-all-decorator.md) - select multiple elements from DOM within component subtree.
- Operators
    - [Creation operators](docs/creation-operators.md)
        - [mutationObservable()](docs/creation-operators.md#mutationobservable) - observe changes in DOM subtree.
        - [propertyObservable()](docs/creation-operators.md#propertyobservable) - observe changes of component properties.
        - [propertiesObservable()](docs/creation-operators.md#propertiesobservable) - observe changes of multiple component properties.
        - [renderObservable()](docs/creation-operators.md#renderobservable) - observe invocation of `render()` method of component.
    - [Pipeable operators](docs/pipeable-operators.md)
        - [scheduleRender()](docs/pipeable-operators.md#schedulerender) - schedule rendering of component after observable emits in next micro task.
        - [toProperty()](docs/pipeable-operators.md#toproperty) - stream value of observable to component property.
        - [untilDisconnected()](docs/pipeable-operators.md#untildisconnected) - unsubscribe from observable when component is disconnected from the DOM.
- [Subscribers](docs/subscribers.md)
    - [setProperty()](docs/subscribers.md#setproperty) - set component property value.

## TODO

- [ ] Add moar tests.
- [ ] Add observables for other Stencil lifecycle events.
