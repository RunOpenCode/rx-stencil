/**
 * Options for QuerySelectorAll decorator.
 */
export type QuerySelectorAllOptions = {
  /**
   * If `true`, the elements will be searched in the shadow root. Default is `false`.
   */
  shadowRoot?: boolean;
  /**
   * If `true`, mutation observer instead of `renderObservable` from this package will
   * be used to detect changes. Default is `false`.
   */
  mutationObserver?: boolean;
};
/**
 * Property decorator inspired by Angular's @ViewChild/@ContentChild.
 *
 * After each render, the decorated property will be set to the first element
 * matching the given selector. If no element is found, the property will be
 * set to null.
 */
export declare function QuerySelectorAll<T extends HTMLElement = HTMLElement>(selector: string, options?: QuerySelectorAllOptions): any;
