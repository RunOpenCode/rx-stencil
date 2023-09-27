/**
 * Returns property descriptor for the given property of the component.
 *
 * {@internal}
 */
export function getPropertyDescriptor(cmp, property, configurableRequired = true) {
  // descriptors are defined on prototype, so we have to go one level up.
  let prototype = Object.getPrototypeOf(cmp);
  let descriptor = Object.getOwnPropertyDescriptor(prototype, property);
  if (!descriptor) {
    throw new Error(`Property "${property}" is not defined on component "${cmp.constructor.name}".`);
  }
  if (configurableRequired && !descriptor.configurable) {
    throw new Error(`Property "${property}" is not configurable on component "${cmp.constructor.name}".`);
  }
  return descriptor;
}
//# sourceMappingURL=get-property-descriptor.js.map
