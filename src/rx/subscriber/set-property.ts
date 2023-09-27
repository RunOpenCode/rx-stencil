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
