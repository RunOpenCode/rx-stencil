import { Observable } from 'rxjs';
/**
 * Options for QuerySelector decorator.
 */
export type QuerySelectorOptions = {
  /**
   * If `true`, the element will be searched in the shadow root. Default is `false`.
   */
  shadowRoot?: boolean;
  /**
   * If `true`, mutation observer instead of `renderObservable` from this package will
   * be used to detect changes. Default is `false`.
   */
  mutationObserver?: boolean;
};
/**
 * Observe all sub nodes of the given node and notify
 * when any of them is removed and/or added.
 *
 * {@internal}
 */
export declare function observeSubNodes(target: Node): Observable<void>;
/**
 * Property decorator inspired by Angular's @ViewChild/@ContentChild.
 *
 * After each render, the decorated property will be set to the first element
 * matching the given selector. If no element is found, the property will be
 * set to null.
 */
export declare function QuerySelector<T extends HTMLElement = HTMLElement>(selector: string, options?: QuerySelectorOptions): any;
