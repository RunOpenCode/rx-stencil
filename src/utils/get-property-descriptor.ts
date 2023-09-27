import { ComponentInterface } from '@stencil/core';

/**
 * Returns property descriptor for the given property of the component.
 *
 * {@internal}
 */
export function getPropertyDescriptor(cmp: ComponentInterface, property: string, configurableRequired: boolean = true): PropertyDescriptor {
    // descriptors are defined on prototype, so we have to go one level up.
    let prototype: object              = Object.getPrototypeOf(cmp);
    let descriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(prototype, property);

    if (!descriptor) {
        throw new Error(`Property "${property}" is not defined on component "${cmp.constructor.name}".`);
    }

    if (configurableRequired && !descriptor.configurable) {
        throw new Error(`Property "${property}" is not configurable on component "${cmp.constructor.name}".`);
    }

    return descriptor;
}
