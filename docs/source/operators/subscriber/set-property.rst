=============
setProperty()
=============

:bdg-secondary:`Subscriber`

Set a property on a Stencil component and optionally schedule a render.

This function returns a setter function that can be used to update the property
value. Common use case is to set it as subscriber to an observable, so that the
property is updated whenever the observable emits a new value.

This is a convenience operator that can be used instead of manually setting the
property and calling ``forceUpdate()`` on the component.

.. js:function:: setProperty(cmp, property, options)

    Creates a subscriber function that sets a property value from stream on a Stencil component and optionally schedules a render.
    
    .. code-block:: typescript
    
       function setProperty<T = any>(cmp: ComponentInterface, property: PropertyKey, options: SetPropertyOptions = {}): (value: T) => void
    
    :param ComponentInterface cmp: The Stencil component instance for which to flush value to property.
    :param PropertyKey property: The name of the property to flush value to.
    :param SetPropertyOptions options: Optional configuration for the subscriber.
    :returns: Subscriber function that sets a property value on a Stencil component and optionally schedules a render.
    :rtype: (value: T) => void

.. js:class:: SetPropertyOptions

    Configuration options for setting a property on a Stencil component.

    .. code-block:: typescript

       export type SetPropertyOptions = {
           scheduleRender?: boolean;
           nextTick?: boolean;
       };

    .. js:attribute:: scheduleRender

       :type: boolean

       **Optional:** Yes

       **Default:** ``false``

    .. js:attribute:: nextTick

       :type: boolean

       **Optional:** Yes

       **Default:** ``true``

       Controls whether the component should be re-rendered on the next tick after the property is set.

Example
-------

.. code-block:: typescript
   :caption: Subscribe to an observable and set a property on a Stencil component whenever the observable emits a new value.
   :linenos:

    import { Component, Prop } from '@stencil/core';
    import { Observable } from 'rxjs';
    import { setProperty } from '@runopenode/stencil-rxjs';

    @Component({
        tag: 'my-component',
        shadow: true,
    })
    export class MyComponent {

        private _value: string;

        private _observable$ = new Observable<string>();

        public connectedCallback(): void {
            this._observable$.subscribe(setProperty(this, '_value', { scheduleRender: true }));
        }
    }