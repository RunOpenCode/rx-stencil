import { ComponentInterface } from '../../stencil-public-runtime';
import { Observable } from 'rxjs';
/**
 * Returns an observable that emits when the component render()
 * function is called. Value will be emitted after the next
 * microtask (next tick).
 */
export declare function renderObservable(cmp: ComponentInterface): Observable<void>;
