/**
 * A function that compares two elements and returns true if they are equal, and false if they are not.
 */
export type ElementComparatorFn<E extends Element = Element> = (previous: E | null, current: E | null) => boolean;

/**
 * A function that filters elements.
 */
export type ElementFilterFn<E extends Element = Element> = (element: E | null) => boolean;

/**
 * A function that filters collection of elements.
 */
export type ElementsFilterFn<E extends Element = Element> = (elements: E[]) => boolean;
