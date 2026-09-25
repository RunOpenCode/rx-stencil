import {
    ComponentInterface,
    forceUpdate,
} from '@stencil/core';

export type SetPropertyOptions = {
    /**
     * Whether to schedule a render of the component after the
     * property is updated. By default, this value is set to
     * `false`, assuming that the property is annotated with
     * either @State or @Prop decorator.
     */
    scheduleRender?: boolean;
    /**
     * Whether to schedule a render of the component on the next
     * tick. By default, this value is set to `true`.
     */
    nextTick?: boolean;
}

/**
 * Set a property on a Stencil component and optionally schedule a render.
 *
 * This function returns a setter function that can be used to update the property value. Common use case
 * is to set it as subscriber to an observable, so that the property is updated whenever the observable
 * emits a new value.
 *
 * @param {ComponentInterface} cmp Component instance on which the property is to be set.
 * @param {string} property Name of the property to be set on the component.
 * @param {SetPropertyOptions} options Options to control the behavior of the property setter,
 *                                     such as whether to schedule a render and whether to do 
 *                                     it on the next tick.
 */
export function setProperty<T = any>(cmp: ComponentInterface, property: string, options: SetPropertyOptions = {}): (value: T) => void {
    let resolvedOptions: SetPropertyOptions = {
        scheduleRender: false,
        nextTick:       true,
        ...options,
    };

    return (value: T): void => {
        cmp[property] = value;

        if (!resolvedOptions.scheduleRender) {
            return;
        }

        if (!resolvedOptions.nextTick) {
            forceUpdate(cmp);
            return;
        }

        Promise.resolve().then((): void => forceUpdate(cmp));
    };
}
