import { ComponentInterface } from '@stencil/core';
import {
    HostRef,
    HTMLStencilElement,
}                             from '@stencil/core/internal';

/**
 * Describes a node that has been relocated for slot emulation by Stencil.
 *
 * These nodes have additional properties to indicate their original location and slot name.
 *
 * @internal
 */
export type EmulatedSlotNode<E extends Element = HTMLElement> = E & {
    // Original node location before Stencil relocated it for slot emulation.
    's-ol'?: Node;
    // Slot name of the node, if any. If missing, and has 's-ol', then the node is a default slot node.
    's-sn'?: string;
}

/**
 * Get the host reference of a component.
 *
 * This is useful for accessing the underlying DOM element of a Stencil component.
 *
 * @internal
 */
export function getHostRef(cmp: ComponentInterface): HostRef {
    return (cmp as any).__stencil__getHostRef();
}

/**
 * Check if a property is defined as a member of the component with @State or @Prop decorator.
 *
 * @internal
 */
export function isPropOrState(cmp: ComponentInterface, property: string): boolean {
    let hostRef: HostRef = getHostRef(cmp);
    return !!hostRef.$cmpMeta$.$members$![property];
}

/**
 * Check if a component uses Shadow DOM.
 *
 * @internal
 */
export function usesShadowDom(cmp: ComponentInterface): boolean {
    let hostRef: HostRef = getHostRef(cmp);
    let flags: number    = hostRef.$cmpMeta$.$flags$;

    return (flags & (1 << 0)) !== 0;
}

/**
 * Check if a node is an emulated view child node.
 *
 * We are checking if node is a child node of the component which is not
 * in emulated slot.
 *
 * @internal
 */
export function isEmulatedViewChild(node: Node, element: HTMLStencilElement): boolean {
    // If the node has the 's-ol' property, it is not an emulated content child.
    if ('s-ol' in node) {
        return false;
    }

    // If it is direct child of the component, it is not an emulated content child.
    if (node.parentElement === element) {
        return false;
    }

    return isEmulatedViewChild(node.parentElement as Node, element);
}

/**
 * Get the tag name of a component.
 *
 * @internal
 */
export function getComponentTagName(cmp: ComponentInterface): string {
    let hostRef: HostRef = getHostRef(cmp);
    return hostRef.$cmpMeta$.$tagName$;
}

/**
 * Check if a component has been rendered at least once.
 *
 * @internal
 */
export function isRendered(cmp: ComponentInterface): boolean {
    let hostRef: HostRef = getHostRef(cmp);
    return (hostRef.$renderCount$ || 0) > 0;
}
