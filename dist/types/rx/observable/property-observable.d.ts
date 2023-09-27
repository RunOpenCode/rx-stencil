import { ComponentInterface } from '../../stencil-public-runtime';
import { Observable } from 'rxjs';
/**
 * Returns an observable that emits property value when the component property value changes.
 */
export declare function propertyObservable<T = any>(cmp: ComponentInterface, property: string): Observable<T>;
